/*
 * Copyright 2021 The Backstage Authors
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

import { AddressInfo } from 'net';
import { Server } from 'http';
import express, { Router } from 'express';
import { RestContext, rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { PermissionIntegrationClient } from './PermissionIntegrationClient';

describe('PermissionIntegrationClient', () => {
  describe('applyConditions', () => {
    let server: SetupServerApi;

    const mockConditions = {
      not: {
        allOf: [
          { rule: 'RULE_1', params: [] },
          { rule: 'RULE_2', params: ['abc'] },
        ],
      },
    };

    const mockApplyConditionsHandler = jest.fn(
      (_req, res, { json }: RestContext) => {
        return res(json({ result: AuthorizeResult.ALLOW }));
      },
    );

    const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
    const discovery: PluginEndpointDiscovery = {
      async getBaseUrl() {
        return mockBaseUrl;
      },
      async getExternalBaseUrl() {
        throw new Error('Not implemented.');
      },
    };

    const client: PermissionIntegrationClient = new PermissionIntegrationClient(
      {
        discovery,
      },
    );

    beforeAll(() => {
      server = setupServer();
      server.listen({ onUnhandledRequest: 'error' });
      server.use(
        rest.post(
          `${mockBaseUrl}/.well-known/backstage/permissions/apply-conditions`,
          mockApplyConditionsHandler,
        ),
      );
    });

    afterAll(() => server.close());

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should make a POST request to the correct endpoint', async () => {
      await client.applyConditions({
        pluginId: 'test-plugin',
        resourceRef: 'testResource1',
        resourceType: 'test-resource',
        conditions: mockConditions,
      });

      expect(mockApplyConditionsHandler).toHaveBeenCalled();
    });

    it('should include a request body', async () => {
      await client.applyConditions({
        pluginId: 'test-plugin',
        resourceRef: 'testResource1',
        resourceType: 'test-resource',
        conditions: mockConditions,
      });

      expect(mockApplyConditionsHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: mockConditions,
          },
        }),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should return the response from the fetch request', async () => {
      const response = await client.applyConditions({
        pluginId: 'test-plugin',
        resourceRef: 'testResource1',
        resourceType: 'test-resource',
        conditions: mockConditions,
      });

      expect(response).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
    });

    it('should not include authorization headers if no token is supplied', async () => {
      await client.applyConditions({
        pluginId: 'test-plugin',
        resourceRef: 'testResource1',
        resourceType: 'test-resource',
        conditions: mockConditions,
      });

      const request = mockApplyConditionsHandler.mock.calls[0][0];
      expect(request.headers.has('authorization')).toEqual(false);
    });

    it('should include correctly-constructed authorization header if token is supplied', async () => {
      await client.applyConditions(
        {
          pluginId: 'test-plugin',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: mockConditions,
        },
        'Bearer fake-token',
      );

      const request = mockApplyConditionsHandler.mock.calls[0][0];
      expect(request.headers.get('authorization')).toEqual('Bearer fake-token');
    });

    it('should forward response errors', async () => {
      mockApplyConditionsHandler.mockImplementationOnce(
        (_req, res, { status }: RestContext) => {
          return res(status(401));
        },
      );

      await expect(
        client.applyConditions({
          pluginId: 'test-plugin',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: mockConditions,
        }),
      ).rejects.toThrowError(/401/i);
    });

    it('should reject invalid responses', async () => {
      mockApplyConditionsHandler.mockImplementationOnce(
        (_req, res, { json }: RestContext) => {
          return res(json({ outcome: AuthorizeResult.ALLOW }));
        },
      );

      await expect(
        client.applyConditions({
          pluginId: 'test-plugin',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: mockConditions,
        }),
      ).rejects.toThrowError(/invalid input/i);
    });
  });

  describe('integration with @backstage/plugin-permission-node', () => {
    let server: Server;
    let client: PermissionIntegrationClient;

    beforeAll(async () => {
      const router = Router();

      router.use(
        createPermissionIntegrationRouter({
          resourceType: 'test-resource',
          getResource: async resourceRef => ({ id: resourceRef }),
          rules: [
            {
              name: 'RULE_1',
              description: 'Test rule 1',
              apply: (_resource: any, input: 'yes' | 'no') => input === 'yes',
              toQuery: () => {
                throw new Error('Not implemented');
              },
            },
            {
              name: 'RULE_2',
              description: 'Test rule 2',
              apply: (_resource: any, input: 'yes' | 'no') => input === 'yes',
              toQuery: () => {
                throw new Error('Not implemented');
              },
            },
          ],
        }),
      );

      const app = express();

      app.use('/test-plugin', router);

      await new Promise<void>(resolve => {
        server = app.listen(resolve);
      });

      const discovery: PluginEndpointDiscovery = {
        async getBaseUrl(pluginId: string) {
          const listenPort = (server.address()! as AddressInfo).port;

          return `http://0.0.0.0:${listenPort}/${pluginId}`;
        },
        async getExternalBaseUrl() {
          throw new Error('Not implemented.');
        },
      };

      client = new PermissionIntegrationClient({
        discovery,
      });
    });

    afterAll(
      async () =>
        new Promise<void>((resolve, reject) =>
          server.close(err => (err ? reject(err) : resolve())),
        ),
    );

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('works for simple conditions', async () => {
      await expect(
        client.applyConditions({
          pluginId: 'test-plugin',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: { rule: 'RULE_1', params: ['no'] },
        }),
      ).resolves.toEqual({ result: AuthorizeResult.DENY });
    });

    it('works for complex criteria', async () => {
      await expect(
        client.applyConditions({
          pluginId: 'test-plugin',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: {
            allOf: [
              {
                allOf: [
                  { rule: 'RULE_1', params: ['yes'] },
                  { not: { rule: 'RULE_2', params: ['no'] } },
                ],
              },
              {
                not: {
                  allOf: [
                    { rule: 'RULE_1', params: ['no'] },
                    { rule: 'RULE_2', params: ['yes'] },
                  ],
                },
              },
            ],
          },
        }),
      ).resolves.toEqual({ result: AuthorizeResult.ALLOW });
    });
  });
});
