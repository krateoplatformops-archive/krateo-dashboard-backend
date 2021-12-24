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

import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { DatabaseHandler } from './DatabaseHandler';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;
  const db = await database.getClient();

  const dbHandler = await DatabaseHandler.create({ database: db });

  logger.info('Initializing Bazaar backend');

  const router = Router();
  router.use(express.json());

  router.get('/members/:ref', async (request, response) => {
    const entity_ref = decodeURIComponent(request.params.ref);
    const data = await dbHandler.getMembers(entity_ref);

    if (data?.length) {
      response.json({ status: 'ok', data: data });
    } else {
      response.json({ status: 'ok', data: [] });
    }
  });

  router.put('/member', async (request, response) => {
    const { user_id, entity_ref, picture } = request.body;
    await dbHandler.addMember(user_id, entity_ref, picture);

    response.json({ status: 'ok' });
  });

  router.delete('/member/:ref/:id', async (request, response) => {
    const { ref, id } = request.params;

    const count = await dbHandler.deleteMember(id, ref);

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.get('/metadata/:ref', async (request, response) => {
    const ref = decodeURIComponent(request.params.ref);

    const data = await dbHandler.getMetadata(ref);
    response.json({ status: 'ok', data: data });
  });

  router.get('/entities', async (_, response) => {
    const data = await dbHandler.getEntities();

    response.json({ status: 'ok', data: data });
  });

  router.put('/metadata', async (request, response) => {
    const bazaarProject = request.body;

    const count = await dbHandler.updateMetadata(bazaarProject);

    if (count) {
      response.json({ status: 'ok' });
    } else {
      await dbHandler.insertMetadata(bazaarProject);
      response.json({ status: 'ok' });
    }
  });

  router.delete('/metadata/:ref', async (request, response) => {
    const ref = decodeURIComponent(request.params.ref);

    const count = await dbHandler.deleteMetadata(ref);

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.use(errorHandler());
  return router;
}
