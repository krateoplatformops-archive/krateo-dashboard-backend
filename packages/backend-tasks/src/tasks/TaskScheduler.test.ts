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

import { DatabaseManager, getVoidLogger } from '@backstage/backend-common';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Duration } from 'luxon';
import { TaskScheduler } from './TaskScheduler';
import waitForExpect from 'wait-for-expect';

describe('TaskScheduler', () => {
  const logger = getVoidLogger();
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(
    databaseId: TestDatabaseId,
  ): Promise<DatabaseManager> {
    const knex = await databases.init(databaseId);
    const databaseManager: Partial<DatabaseManager> = {
      forPlugin: () => ({
        getClient: async () => knex,
      }),
    };
    return databaseManager as DatabaseManager;
  }

  it.each(databases.eachSupportedId())(
    'can return a working v1 plugin impl, %p',
    async databaseId => {
      const database = await createDatabase(databaseId);
      const manager = new TaskScheduler(database, logger).forPlugin('test');
      const fn = jest.fn();

      await manager.scheduleTask({
        id: 'task1',
        timeout: Duration.fromMillis(5000),
        frequency: Duration.fromMillis(5000),
        fn,
      });

      await waitForExpect(() => {
        expect(fn).toBeCalled();
      });
    },
    60_000,
  );

  it.each(databases.eachSupportedId())(
    'can return a working v2 plugin impl, %p',
    async databaseId => {
      const database = await createDatabase(databaseId);
      const manager = new TaskScheduler(database, logger).forPlugin('test');
      const fn = jest.fn();

      await manager.scheduleTask({
        id: 'task2',
        timeout: Duration.fromMillis(5000),
        frequency: { cron: '* * * * * *' },
        fn,
      });

      await waitForExpect(() => {
        expect(fn).toBeCalled();
      });
    },
    60_000,
  );
});
