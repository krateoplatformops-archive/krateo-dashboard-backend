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

import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  defaultGroupTransformer,
  MicrosoftGraphOrgReaderProcessor,
} from '@backstage/plugin-catalog-backend-module-msgraph';
import {
  LdapOrgReaderProcessor,
  LdapOrgEntityProvider,
  GroupConfig,
  LdapVendor,
} from '@backstage/plugin-catalog-backend-module-ldap';
import { GroupEntity } from '@backstage/catalog-model';
import { SearchEntry } from 'ldapjs';

export async function myGroupTransformer(
  vendor: LdapVendor,
  config: GroupConfig,
  group: SearchEntry,
): Promise<GroupEntity | undefined> {
  // Transformations may change namespace, change entity naming pattern, fill
  // profile with more or other details...
  console.log(`Transforming group ${group.dn}`);
  // Create the group entity on your own, or wrap the default transformer
  return await defaultGroupTransformer(vendor, config, group);
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  // const ldapEntityProvider = LdapOrgEntityProvider.fromConfig(env.config, {
  //   id: 'custom-ldap',
  //   // target needs to match the catalog.processors.ldapOrg.providers.target specified in app-config
  //   target: 'ldap://localhost:10389',
  //   logger: env.logger,
  // });

  const builder = await CatalogBuilder.create(env);
  // builder.addEntityProvider(ldapEntityProvider);

  // You can change the refresh interval for the other catalog entries independently, or just leave the line below out to use the default refresh interval
  // builder.setRefreshIntervalSeconds(100);

  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
      logger: env.logger,
    }),
  );
  builder.addProcessor(
    LdapOrgReaderProcessor.fromConfig(env.config, {
      logger: env.logger,
      groupTransformer: myGroupTransformer,
    }),
  );
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();

  // await env.scheduler.scheduleTask({
  //   id: 'refresh_ldap',
  //   // frequency sets how often you want to ingest users and groups from LDAP, in this case every 60 minutes
  //   frequency: Duration.fromObject({ minutes: 60 }),
  //   timeout: Duration.fromObject({ minutes: 15 }),
  //   fn: async () => {
  //     try {
  //       await ldapEntityProvider.read();
  //     } catch (error) {
  //       env.logger.error(error);
  //     }
  //   },
  // });

  return router;
}
