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

import { ConfigReader } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ScaffolderClient } from './api';

const MockedEventSource = global.EventSource as jest.MockedClass<
  typeof EventSource
>;

const server = setupServer();

describe('api', () => {
  setupRequestMockHandlers(server);
  const mockBaseUrl = 'http://backstage/api';

  const discoveryApi = { getBaseUrl: async () => mockBaseUrl };
  const fetchApi = new MockFetchApi();
  const scmIntegrationsApi = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [
          {
            host: 'hello.com',
          },
        ],
      },
    }),
  );

  let apiClient: ScaffolderClient;
  beforeEach(() => {
    apiClient = new ScaffolderClient({
      scmIntegrationsApi,
      discoveryApi,
      fetchApi,
    });
  });

  it('should return default and custom integrations', async () => {
    const allowedHosts = [
      'hello.com',
      'gitlab.com',
      'github.com',
      'dev.azure.com',
      'bitbucket.org',
    ];
    const { integrations } = await apiClient.getIntegrationsList({
      allowedHosts,
    });
    integrations.forEach(integration =>
      expect(allowedHosts).toContain(integration.host),
    );
  });

  describe('streamEvents', () => {
    describe('eventsource', () => {
      it('should work', async () => {
        MockedEventSource.prototype.addEventListener.mockImplementation(
          (type, fn) => {
            if (typeof fn !== 'function') {
              return;
            }

            if (type === 'log') {
              fn({
                data: '{"id":1,"taskId":"a-random-id","type":"log","createdAt":"","body":{"message":"My log message"}}',
              } as any);
            } else if (type === 'completion') {
              fn({
                data: '{"id":2,"taskId":"a-random-id","type":"completion","createdAt":"","body":{"message":"Finished!"}}',
              } as any);
            }
          },
        );

        const next = jest.fn();

        await new Promise<void>(complete => {
          apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({ next, complete });
        });

        expect(MockedEventSource).toBeCalledWith(
          'http://backstage/api/v2/tasks/a-random-task-id/eventstream',
          { withCredentials: true },
        );
        expect(MockedEventSource.prototype.close).toBeCalled();

        expect(next).toBeCalledTimes(2);
        expect(next).toBeCalledWith({
          id: 1,
          taskId: 'a-random-id',
          type: 'log',
          createdAt: '',
          body: { message: 'My log message' },
        });
        expect(next).toBeCalledWith({
          id: 2,
          taskId: 'a-random-id',
          type: 'completion',
          createdAt: '',
          body: { message: 'Finished!' },
        });
      });
    });

    describe('longPolling', () => {
      beforeEach(() => {
        apiClient = new ScaffolderClient({
          scmIntegrationsApi,
          discoveryApi,
          fetchApi,
          useLongPollingLogs: true,
        });
      });

      it('should work', async () => {
        server.use(
          rest.get(
            `${mockBaseUrl}/v2/tasks/:taskId/events`,
            (req, res, ctx) => {
              const { taskId } = req.params;
              const after = req.url.searchParams.get('after');

              if (taskId === 'a-random-task-id') {
                if (!after) {
                  return res(
                    ctx.json([
                      {
                        id: 1,
                        taskId: 'a-random-id',
                        type: 'log',
                        createdAt: '',
                        body: { message: 'My log message' },
                      },
                    ]),
                  );
                } else if (after === '1') {
                  return res(
                    ctx.json([
                      {
                        id: 2,
                        taskId: 'a-random-id',
                        type: 'completion',
                        createdAt: '',
                        body: { message: 'Finished!' },
                      },
                    ]),
                  );
                }
              }

              return res(ctx.status(500));
            },
          ),
        );

        const next = jest.fn();

        await new Promise<void>(complete =>
          apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({ next, complete }),
        );

        expect(next).toBeCalledTimes(2);
        expect(next).toBeCalledWith({
          id: 1,
          taskId: 'a-random-id',
          type: 'log',
          createdAt: '',
          body: { message: 'My log message' },
        });
        expect(next).toBeCalledWith({
          id: 2,
          taskId: 'a-random-id',
          type: 'completion',
          createdAt: '',
          body: { message: 'Finished!' },
        });
      });

      it('should unsubscribe', async () => {
        expect.assertions(3);

        server.use(
          rest.get(
            `${mockBaseUrl}/v2/tasks/:taskId/events`,
            (req, res, ctx) => {
              const { taskId } = req.params;

              const after = req.url.searchParams.get('after');

              // use assertion to make sure it is not called after unsubscribing
              expect(after).toBe(null);

              if (taskId === 'a-random-task-id') {
                return res(
                  ctx.json([
                    {
                      id: 1,
                      taskId: 'a-random-id',
                      type: 'log',
                      createdAt: '',
                      body: { message: 'My log message' },
                    },
                  ]),
                );
              }

              return res(ctx.status(500));
            },
          ),
        );

        const next = jest.fn();

        await new Promise<void>(complete => {
          const subscription = apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({
              next: (...args) => {
                next(...args);
                subscription.unsubscribe();
                complete();
              },
            });
        });

        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith({
          id: 1,
          taskId: 'a-random-id',
          type: 'log',
          createdAt: '',
          body: { message: 'My log message' },
        });
      });

      it('should continue after error', async () => {
        const called = jest.fn();

        server.use(
          rest.get(
            `${mockBaseUrl}/v2/tasks/:taskId/events`,
            (_req, res, ctx) => {
              called();

              if (called.mock.calls.length > 1) {
                return res(
                  ctx.json([
                    {
                      id: 2,
                      taskId: 'a-random-id',
                      type: 'completion',
                      createdAt: '',
                      body: { message: 'Finished!' },
                    },
                  ]),
                );
              }

              return res(ctx.status(500));
            },
          ),
        );

        const next = jest.fn();

        await new Promise<void>(complete =>
          apiClient
            .streamLogs({ taskId: 'a-random-task-id' })
            .subscribe({ next, complete }),
        );

        expect(called).toBeCalledTimes(2);

        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith({
          id: 2,
          taskId: 'a-random-id',
          type: 'completion',
          createdAt: '',
          body: { message: 'Finished!' },
        });
      });
    });
  });
});
