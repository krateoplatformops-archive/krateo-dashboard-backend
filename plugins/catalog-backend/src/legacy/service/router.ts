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

import { errorHandler } from '@backstage/backend-common';
import type { Entity } from '@backstage/catalog-model';
import {
  analyzeLocationSchema,
  locationSpecSchema,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import yn from 'yn';
import { EntitiesCatalog } from '../../catalog';
import { LocationsCatalog } from '../catalog';
import { LocationAnalyzer } from '../../ingestion/types';
import { HigherOrderOperation } from '../ingestion/types';
import {
  RefreshService,
  LocationService,
  RefreshOptions,
} from '../../service/types';
import {
  basicEntityFilter,
  parseEntityFilterParams,
  parseEntityPaginationParams,
  parseEntityTransformParams,
} from '../../service/request';
import {
  disallowReadonlyMode,
  requireRequestBody,
  validateRequestBody,
} from '../../service/util';

/** @deprecated This was part of the legacy catalog engine */
export interface RouterOptions {
  entitiesCatalog?: EntitiesCatalog;
  locationsCatalog?: LocationsCatalog;
  higherOrderOperation?: HigherOrderOperation;
  locationAnalyzer?: LocationAnalyzer;
  locationService?: LocationService;
  refreshService?: RefreshService;
  logger: Logger;
  config: Config;
}

/** @deprecated This was part of the legacy catalog engine */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer,
    locationService,
    refreshService,
    config,
    logger,
  } = options;

  const router = Router();
  router.use(express.json());

  const readonlyEnabled =
    config.getOptionalBoolean('catalog.readonly') || false;
  if (readonlyEnabled) {
    logger.info('Catalog is running in readonly mode');
  }

  if (refreshService) {
    router.post('/refresh', async (req, res) => {
      const refreshOptions: RefreshOptions = req.body;
      await refreshService.refresh(refreshOptions);
      res.status(200).send();
    });
  }

  if (entitiesCatalog) {
    router
      .get('/entities', async (req, res) => {
        const { entities, pageInfo } = await entitiesCatalog.entities({
          filter: parseEntityFilterParams(req.query),
          fields: parseEntityTransformParams(req.query),
          pagination: parseEntityPaginationParams(req.query),
        });

        // Add a Link header to the next page
        if (pageInfo.hasNextPage) {
          const url = new URL(`http://ignored${req.url}`);
          url.searchParams.delete('offset');
          url.searchParams.set('after', pageInfo.endCursor);
          res.setHeader('link', `<${url.pathname}${url.search}>; rel="next"`);
        }

        // TODO(freben): encode the pageInfo in the response
        res.json(entities);
      })
      .post('/entities', async (req, res) => {
        /*
         * NOTE: THIS METHOD IS DEPRECATED AND NOT RECOMMENDED TO USE
         *
         * Posting entities to this method has unclear semantics and will not
         * properly subject them to limitations, processing, or resolution of
         * relations.
         *
         * It stays around in the service for the time being, but may be
         * removed or change semantics at any time without prior notice.
         */
        disallowReadonlyMode(readonlyEnabled);

        const body = await requireRequestBody(req);
        const [result] = await entitiesCatalog.batchAddOrUpdateEntities!([
          { entity: body as Entity, relations: [] },
        ]);
        const response = await entitiesCatalog.entities({
          filter: basicEntityFilter({ 'metadata.uid': result.entityId }),
        });
        res.status(200).json(response.entities[0]);
      })
      .get('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;
        const { entities } = await entitiesCatalog.entities({
          filter: basicEntityFilter({ 'metadata.uid': uid }),
        });
        if (!entities.length) {
          throw new NotFoundError(`No entity with uid ${uid}`);
        }
        res.status(200).json(entities[0]);
      })
      .delete('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;
        await entitiesCatalog.removeEntityByUid(uid);
        res.status(204).end();
      })
      .get('/entities/by-name/:kind/:namespace/:name', async (req, res) => {
        const { kind, namespace, name } = req.params;
        const { entities } = await entitiesCatalog.entities({
          filter: basicEntityFilter({
            kind: kind,
            'metadata.namespace': namespace,
            'metadata.name': name,
          }),
        });
        if (!entities.length) {
          throw new NotFoundError(
            `No entity named '${name}' found, with kind '${kind}' in namespace '${namespace}'`,
          );
        }
        res.status(200).json(entities[0]);
      });
  }

  if (locationService) {
    router
      .post('/locations', async (req, res) => {
        const input = await validateRequestBody(req, locationSpecSchema);
        const dryRun = yn(req.query.dryRun, { default: false });

        // when in dryRun addLocation is effectively a read operation so we don't
        // need to disallow readonly
        if (!dryRun) {
          disallowReadonlyMode(readonlyEnabled);
        }

        const output = await locationService.createLocation(input, dryRun);
        res.status(201).json(output);
      })
      .get('/locations', async (_req, res) => {
        const locations = await locationService.listLocations();
        res.status(200).json(locations.map(l => ({ data: l })));
      })

      .get('/locations/:id', async (req, res) => {
        const { id } = req.params;
        const output = await locationService.getLocation(id);
        res.status(200).json(output);
      })
      .delete('/locations/:id', async (req, res) => {
        disallowReadonlyMode(readonlyEnabled);

        const { id } = req.params;
        await locationService.deleteLocation(id);
        res.status(204).end();
      });
  }

  if (higherOrderOperation) {
    router.post('/locations', async (req, res) => {
      const input = await validateRequestBody(req, locationSpecSchema);
      const dryRun = yn(req.query.dryRun, { default: false });

      // when in dryRun addLocation is effectively a read operation so we don't
      // need to disallow readonly
      if (!dryRun) {
        disallowReadonlyMode(readonlyEnabled);
      }

      const output = await higherOrderOperation.addLocation(input, { dryRun });
      res.status(201).json(output);
    });
  }

  if (locationsCatalog) {
    router
      .get('/locations', async (_req, res) => {
        const output = await locationsCatalog.locations();
        res.status(200).json(output);
      })
      .get('/locations/:id/history', async (req, res) => {
        const { id } = req.params;
        const output = await locationsCatalog.locationHistory(id);
        res.status(200).json(output);
      })
      .get('/locations/:id', async (req, res) => {
        const { id } = req.params;
        const output = await locationsCatalog.location(id);
        res.status(200).json(output);
      })
      .delete('/locations/:id', async (req, res) => {
        disallowReadonlyMode(readonlyEnabled);

        const { id } = req.params;
        await locationsCatalog.removeLocation(id);
        res.status(204).end();
      });
  }

  if (locationAnalyzer) {
    router.post('/analyze-location', async (req, res) => {
      const input = await validateRequestBody(req, analyzeLocationSchema);
      const output = await locationAnalyzer.analyzeLocation(input);
      res.status(200).json(output);
    });
  }

  router.use(errorHandler());
  return router;
}
