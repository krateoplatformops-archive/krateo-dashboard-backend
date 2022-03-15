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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import type { Location } from '@backstage/catalog-client';
import type { Entity } from '@backstage/catalog-model';
import express from 'express';
import request from 'supertest';
import { EntitiesCatalog } from '../catalog';
import { LocationInput, LocationService, RefreshService } from './types';
import { basicEntityFilter } from './request';
import { createRouter } from './createRouter';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common';

describe('createRouter readonly disabled', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationService: jest.Mocked<LocationService>;
  let app: express.Express;
  let refreshService: RefreshService;

  beforeAll(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      removeEntityByUid: jest.fn(),
      entityAncestry: jest.fn(),
      facets: jest.fn(),
    };
    locationService = {
      getLocation: jest.fn(),
      createLocation: jest.fn(),
      listLocations: jest.fn(),
      deleteLocation: jest.fn(),
    };
    refreshService = { refresh: jest.fn() };
    const router = await createRouter({
      entitiesCatalog,
      locationService,
      logger: getVoidLogger(),
      refreshService,
      config: new ConfigReader(undefined),
      permissionIntegrationRouter: express.Router(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /refresh', () => {
    it('refreshes an entity using the refresh service', async () => {
      const response = await request(app)
        .post('/refresh')
        .set('Content-Type', 'application/json')
        .set('authorization', 'Bearer someauthtoken')
        .send({ entityRef: 'Component/default:foo' });
      expect(response.status).toBe(200);
      expect(refreshService.refresh).toHaveBeenCalledWith({
        entityRef: 'Component/default:foo',
        authorizationToken: 'someauthtoken',
      });
    });
  });
  describe('GET /entities', () => {
    it('happy path: lists entities', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.entities.mockResolvedValueOnce({
        entities: [entities[0]],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });

    it('parses single and multiple request parameters and passes them down', async () => {
      entitiesCatalog.entities.mockResolvedValueOnce({
        entities: [],
        pageInfo: { hasNextPage: false },
      });
      const response = await request(app).get(
        '/entities?filter=a=1,a=2,b=3&filter=c=4',
      );

      expect(response.status).toEqual(200);
      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: {
          anyOf: [
            {
              allOf: [
                { key: 'a', values: ['1', '2'] },
                { key: 'b', values: ['3'] },
              ],
            },
            { allOf: [{ key: 'c', values: ['4'] }] },
          ],
        },
      });
    });
  });

  describe('GET /entities/by-uid/:uid', () => {
    it('can fetch entity by uid', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
        },
      };
      entitiesCatalog.entities.mockResolvedValue({
        entities: [entity],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-uid/zzz');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({ 'metadata.uid': 'zzz' }),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.entities.mockResolvedValue({
        entities: [],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-uid/zzz');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({ 'metadata.uid': 'zzz' }),
      });
      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/uid/);
    });
  });

  describe('GET /entities/by-name/:kind/:namespace/:name', () => {
    it('can fetch entity by name', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'k',
        metadata: {
          name: 'n',
          namespace: 'ns',
        },
      };
      entitiesCatalog.entities.mockResolvedValue({
        entities: [entity],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-name/k/ns/n');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({
          kind: 'k',
          'metadata.namespace': 'ns',
          'metadata.name': 'n',
        }),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.entities.mockResolvedValue({
        entities: [],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-name/b/d/c');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({
          kind: 'b',
          'metadata.namespace': 'd',
          'metadata.name': 'c',
        }),
      });
      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/name/);
    });
  });

  describe('DELETE /entities/by-uid/:uid', () => {
    it('can remove', async () => {
      entitiesCatalog.removeEntityByUid.mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/entities/by-uid/apa')
        .set('authorization', 'Bearer someauthtoken');

      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa', {
        authorizationToken: 'someauthtoken',
      });
      expect(response.status).toEqual(204);
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.removeEntityByUid.mockRejectedValue(
        new NotFoundError('nope'),
      );

      const response = await request(app)
        .delete('/entities/by-uid/apa')
        .set('authorization', 'Bearer someauthtoken');

      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa', {
        authorizationToken: 'someauthtoken',
      });
      expect(response.status).toEqual(404);
    });
  });

  describe('GET /locations', () => {
    it('happy path: lists locations', async () => {
      const locations: Location[] = [
        { id: 'foo', type: 'url', target: 'example.com' },
      ];
      locationService.listLocations.mockResolvedValueOnce(locations);

      const response = await request(app)
        .get('/locations')
        .set('authorization', 'Bearer someauthtoken');

      expect(locationService.listLocations).toHaveBeenCalledTimes(1);
      expect(locationService.listLocations).toHaveBeenCalledWith({
        authorizationToken: 'someauthtoken',
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        { data: { id: 'foo', target: 'example.com', type: 'url' } },
      ]);
    });
  });

  describe('GET /locations/:id', () => {
    it('happy path: gets location by id', async () => {
      const location: Location = {
        id: 'foo',
        type: 'url',
        target: 'example.com',
      };
      locationService.getLocation.mockResolvedValueOnce(location);

      const response = await request(app)
        .get('/locations/foo')
        .set('authorization', 'Bearer someauthtoken');

      expect(locationService.getLocation).toHaveBeenCalledTimes(1);
      expect(locationService.getLocation).toHaveBeenCalledWith('foo', {
        authorizationToken: 'someauthtoken',
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 'foo',
        target: 'example.com',
        type: 'url',
      });
    });
  });

  describe('POST /locations', () => {
    it('rejects malformed locations', async () => {
      const spec = {
        typez: 'b',
        target: 'c',
      } as unknown as LocationInput;

      const response = await request(app)
        .post('/locations')
        .set('authorization', 'Bearer someauthtoken')
        .send(spec);

      expect(locationService.createLocation).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
    });

    it('passes the body down', async () => {
      const spec: LocationInput = {
        type: 'b',
        target: 'c',
      };

      locationService.createLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app)
        .post('/locations')
        .set('authorization', 'Bearer someauthtoken')
        .send(spec);

      expect(locationService.createLocation).toHaveBeenCalledTimes(1);
      expect(locationService.createLocation).toHaveBeenCalledWith(spec, false, {
        authorizationToken: 'someauthtoken',
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });

    it('supports dry run', async () => {
      const spec: LocationInput = {
        type: 'b',
        target: 'c',
      };

      locationService.createLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app)
        .post('/locations?dryRun=true')
        .set('authorization', 'Bearer someauthtoken')
        .send(spec);

      expect(locationService.createLocation).toHaveBeenCalledTimes(1);
      expect(locationService.createLocation).toHaveBeenCalledWith(spec, true, {
        authorizationToken: 'someauthtoken',
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });
  });

  describe('DELETE /locations', () => {
    it('deletes the location', async () => {
      locationService.deleteLocation.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .delete('/locations/foo')
        .set('authorization', 'Bearer someauthtoken');

      expect(locationService.deleteLocation).toHaveBeenCalledTimes(1);
      expect(locationService.deleteLocation).toHaveBeenCalledWith('foo', {
        authorizationToken: 'someauthtoken',
      });

      expect(response.status).toEqual(204);
    });
  });
});

describe('createRouter readonly enabled', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let app: express.Express;
  let locationService: jest.Mocked<LocationService>;

  beforeAll(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      removeEntityByUid: jest.fn(),
      entityAncestry: jest.fn(),
      facets: jest.fn(),
    };
    locationService = {
      getLocation: jest.fn(),
      createLocation: jest.fn(),
      listLocations: jest.fn(),
      deleteLocation: jest.fn(),
    };
    const router = await createRouter({
      entitiesCatalog,
      locationService,
      logger: getVoidLogger(),
      config: new ConfigReader({
        catalog: {
          readonly: true,
        },
      }),
      permissionIntegrationRouter: express.Router(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /entities', () => {
    it('happy path: lists entities', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.entities.mockResolvedValueOnce({
        entities: [entities[0]],
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });
  });

  describe('DELETE /entities/by-uid/:uid', () => {
    // this delete is allowed as there is no other way to remove entities
    it('is allowed', async () => {
      const response = await request(app)
        .delete('/entities/by-uid/apa')
        .set('authorization', 'Bearer someauthtoken');

      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa', {
        authorizationToken: 'someauthtoken',
      });
      expect(response.status).toEqual(204);
    });
  });

  describe('GET /locations', () => {
    it('happy path: lists locations', async () => {
      const locations: Location[] = [
        { id: 'foo', type: 'url', target: 'example.com' },
      ];
      locationService.listLocations.mockResolvedValueOnce(locations);

      const response = await request(app)
        .get('/locations')
        .set('authorization', 'Bearer someauthtoken');

      expect(locationService.listLocations).toHaveBeenCalledTimes(1);
      expect(locationService.listLocations).toHaveBeenCalledWith({
        authorizationToken: 'someauthtoken',
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        { data: { id: 'foo', target: 'example.com', type: 'url' } },
      ]);
    });
  });

  describe('GET /locations/:id', () => {
    it('happy path: gets location by id', async () => {
      const location: Location = {
        id: 'foo',
        type: 'url',
        target: 'example.com',
      };
      locationService.getLocation.mockResolvedValueOnce(location);

      const response = await request(app)
        .get('/locations/foo')
        .set('authorization', 'Bearer someauthtoken');

      expect(locationService.getLocation).toHaveBeenCalledTimes(1);
      expect(locationService.getLocation).toHaveBeenCalledWith('foo', {
        authorizationToken: 'someauthtoken',
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 'foo',
        target: 'example.com',
        type: 'url',
      });
    });
  });

  describe('POST /locations', () => {
    it('is not allowed', async () => {
      const spec: LocationInput = {
        type: 'b',
        target: 'c',
      };

      const response = await request(app)
        .post('/locations')
        .set('authorization', 'Bearer someauthtoken')
        .send(spec);

      expect(locationService.createLocation).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
      expect(response.text).toMatch(/not allowed in readonly/);
    });

    it('supports dry run', async () => {
      const spec: LocationInput = {
        type: 'b',
        target: 'c',
      };

      locationService.createLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app)
        .post('/locations?dryRun=true')
        .set('authorization', 'Bearer someauthtoken')
        .send(spec);

      expect(locationService.createLocation).toHaveBeenCalledTimes(1);
      expect(locationService.createLocation).toHaveBeenCalledWith(spec, true, {
        authorizationToken: 'someauthtoken',
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });
  });

  describe('DELETE /locations', () => {
    it('is not allowed', async () => {
      const response = await request(app)
        .delete('/locations/foo')
        .set('authorization', 'Bearer someauthtoken');

      expect(locationService.deleteLocation).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });
  });
});

describe('NextRouter permissioning', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationService: jest.Mocked<LocationService>;
  let app: express.Express;
  let refreshService: RefreshService;

  const fakeRule = {
    name: 'FAKE_RULE',
    description: 'fake rule',
    apply: () => true,
    toQuery: () => ({ key: '', values: [] }),
  };

  beforeAll(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      removeEntityByUid: jest.fn(),
      entityAncestry: jest.fn(),
      facets: jest.fn(),
    };
    locationService = {
      getLocation: jest.fn(),
      createLocation: jest.fn(),
      listLocations: jest.fn(),
      deleteLocation: jest.fn(),
    };
    refreshService = { refresh: jest.fn() };
    const router = await createRouter({
      entitiesCatalog,
      locationService,
      logger: getVoidLogger(),
      refreshService,
      config: new ConfigReader(undefined),
      permissionIntegrationRouter: createPermissionIntegrationRouter({
        resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
        rules: [fakeRule],
        getResources: jest.fn((resourceRefs: string[]) =>
          Promise.resolve(
            resourceRefs.map(resourceRef => ({ id: resourceRef })),
          ),
        ),
      }),
    });
    app = express().use(router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('accepts and evaluates conditions at the apply-conditions endpoint', async () => {
    const spideySense: Entity = {
      apiVersion: 'a',
      kind: 'component',
      metadata: {
        name: 'spidey-sense',
      },
    };
    entitiesCatalog.entities.mockResolvedValueOnce({
      entities: [spideySense],
      pageInfo: { hasNextPage: false },
    });

    const requestBody = {
      items: [
        {
          id: '123',
          resourceType: 'catalog-entity',
          resourceRef: 'component:default/spidey-sense',
          conditions: { rule: 'FAKE_RULE', params: ['user:default/spiderman'] },
        },
      ],
    };
    const response = await request(app)
      .post('/.well-known/backstage/permissions/apply-conditions')
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [{ id: '123', result: AuthorizeResult.ALLOW }],
    });
  });
});
