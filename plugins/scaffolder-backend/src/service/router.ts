/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError, NotFoundError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import {
  TemplateEntityV1beta3,
  TaskSpec,
} from '@backstage/plugin-scaffolder-common';
import express from 'express';
import Router from 'express-promise-router';
import { validate } from 'jsonschema';
import { Logger } from 'winston';
import { TemplateFilter } from '../lib';
import {
  createBuiltinActions,
  DatabaseTaskStore,
  TaskBroker,
  TaskWorker,
  TemplateAction,
  TemplateActionRegistry,
} from '../scaffolder';
import { StorageTaskBroker } from '../scaffolder/tasks/StorageTaskBroker';
import { getEntityBaseUrl, getWorkingDirectory, findTemplate } from './helpers';

/**
 * RouterOptions
 *
 * @public
 */
export interface RouterOptions {
  logger: Logger;
  config: Config;
  reader: UrlReader;
  database: PluginDatabaseManager;
  catalogClient: CatalogApi;
  actions?: TemplateAction<any>[];
  taskWorkers?: number;
  taskBroker?: TaskBroker;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
}

function isSupportedTemplate(entity: TemplateEntityV1beta3) {
  return entity.apiVersion === 'scaffolder.backstage.io/v1beta3';
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const {
    logger: parentLogger,
    config,
    reader,
    database,
    catalogClient,
    actions,
    taskWorkers,
    additionalTemplateFilters,
  } = options;

  const logger = parentLogger.child({ plugin: 'scaffolder' });
  const workingDirectory = await getWorkingDirectory(config, logger);
  const integrations = ScmIntegrations.fromConfig(config);
  let taskBroker: TaskBroker;

  if (!options.taskBroker) {
    const databaseTaskStore = await DatabaseTaskStore.create({
      database: await database.getClient(),
    });
    taskBroker = new StorageTaskBroker(databaseTaskStore, logger);
  } else {
    taskBroker = options.taskBroker;
  }

  const actionRegistry = new TemplateActionRegistry();

  const workers = [];
  for (let i = 0; i < (taskWorkers || 1); i++) {
    const worker = await TaskWorker.create({
      taskBroker,
      actionRegistry,
      integrations,
      logger,
      workingDirectory,
      additionalTemplateFilters,
    });
    workers.push(worker);
  }

  const actionsToRegister = Array.isArray(actions)
    ? actions
    : createBuiltinActions({
        integrations,
        catalogClient,
        reader,
        config,
        additionalTemplateFilters,
      });

  actionsToRegister.forEach(action => actionRegistry.register(action));
  workers.forEach(worker => worker.start());

  router
    .get(
      '/v2/templates/:namespace/:kind/:name/parameter-schema',
      async (req, res) => {
        const { namespace, kind, name } = req.params;
        const template = await findTemplate({
          catalogApi: catalogClient,
          entityRef: { kind, namespace, name },
          token: getBearerToken(req.headers.authorization),
        });
        if (isSupportedTemplate(template)) {
          const parameters = [template.spec.parameters ?? []].flat();
          res.json({
            title: template.metadata.title ?? template.metadata.name,
            steps: parameters.map(schema => ({
              title: schema.title ?? 'Fill in template parameters',
              schema,
            })),
          });
        } else {
          throw new InputError(
            `Unsupported apiVersion field in schema entity, ${
              (template as Entity).apiVersion
            }`,
          );
        }
      },
    )
    .get('/v2/actions', async (_req, res) => {
      const actionsList = actionRegistry.list().map(action => {
        return {
          id: action.id,
          description: action.description,
          schema: action.schema,
        };
      });
      res.json(actionsList);
    })
    .post('/v2/tasks', async (req, res) => {
      const templateRef: string = req.body.templateRef;

      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      console.log(templateRef);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

      const { kind, namespace, name } = parseEntityRef(templateRef, {
        defaultKind: 'template',
      });
      const values = req.body.values;
      const token = getBearerToken(req.headers.authorization);
      const template = await findTemplate({
        catalogApi: catalogClient,
        entityRef: { kind, namespace, name },
        token: getBearerToken(req.headers.authorization),
      });

      if (!isSupportedTemplate(template)) {
        throw new InputError(
          `Unsupported apiVersion field in schema entity, ${
            (template as Entity).apiVersion
          }`,
        );
      }

      for (const parameters of [template.spec.parameters ?? []].flat()) {
        const result = validate(values, parameters);
        if (!result.valid) {
          res.status(400).json({ errors: result.errors });
          return;
        }
      }

      const baseUrl = getEntityBaseUrl(template);

      const taskSpec: TaskSpec = {
        apiVersion: template.apiVersion,
        steps: template.spec.steps.map((step, index) => ({
          ...step,
          id: step.id ?? `step-${index + 1}`,
          name: step.name ?? step.action,
        })),
        output: template.spec.output ?? {},
        parameters: values,
        templateInfo: {
          entityRef: stringifyEntityRef({
            kind,
            namespace,
            name: template.metadata?.name,
          }),
          baseUrl,
        },
      };

      const result = await taskBroker.dispatch({
        spec: taskSpec,
        secrets: {
          ...req.body.secrets,
          backstageToken: token,
        },
      });

      res.status(201).json({ id: result.taskId });
    })
    .get('/v2/tasks/:taskId', async (req, res) => {
      const { taskId } = req.params;
      const task = await taskBroker.get(taskId);
      if (!task) {
        throw new NotFoundError(`Task with id ${taskId} does not exist`);
      }
      // Do not disclose secrets
      delete task.secrets;
      res.status(200).json(task);
    })
    .get('/v2/tasks/:taskId/eventstream', async (req, res) => {
      const { taskId } = req.params;
      const after =
        req.query.after !== undefined ? Number(req.query.after) : undefined;

      logger.debug(`Event stream observing taskId '${taskId}' opened`);

      // Mandatory headers and http status to keep connection open
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
      });

      // After client opens connection send all events as string
      const subscription = taskBroker.event$({ taskId, after }).subscribe({
        error: error => {
          logger.error(
            `Received error from event stream when observing taskId '${taskId}', ${error}`,
          );
        },
        next: ({ events }) => {
          let shouldUnsubscribe = false;
          for (const event of events) {
            res.write(
              `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
            );
            if (event.type === 'completion') {
              shouldUnsubscribe = true;
            }
          }
          // res.flush() is only available with the compression middleware
          res.flush?.();
          if (shouldUnsubscribe) subscription.unsubscribe();
        },
      });

      // When client closes connection we update the clients list
      // avoiding the disconnected one
      req.on('close', () => {
        subscription.unsubscribe();
        logger.debug(`Event stream observing taskId '${taskId}' closed`);
      });
    })
    .get('/v2/tasks/:taskId/events', async (req, res) => {
      const { taskId } = req.params;
      const after = Number(req.query.after) || undefined;

      // cancel the request after 30 seconds. this aligns with the recommendations of RFC 6202.
      const timeout = setTimeout(() => {
        res.json([]);
      }, 30_000);

      // Get all known events after an id (always includes the completion event) and return the first callback
      const subscription = taskBroker.event$({ taskId, after }).subscribe({
        error: error => {
          logger.error(
            `Received error from event stream when observing taskId '${taskId}', ${error}`,
          );
        },
        next: ({ events }) => {
          clearTimeout(timeout);
          subscription.unsubscribe();
          res.json(events);
        },
      });

      // When client closes connection we update the clients list
      // avoiding the disconnected one
      req.on('close', () => {
        subscription.unsubscribe();
        clearTimeout(timeout);
      });
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}

function getBearerToken(header?: string): string | undefined {
  return header?.match(/Bearer\s+(\S+)/i)?.[1];
}
