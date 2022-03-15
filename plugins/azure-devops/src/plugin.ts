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

import {
  AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION,
  AZURE_DEVOPS_PROJECT_ANNOTATION,
  AZURE_DEVOPS_REPO_ANNOTATION,
} from './constants';
import {
  azurePipelinesEntityContentRouteRef,
  azurePullRequestDashboardRouteRef,
  azurePullRequestsEntityContentRouteRef,
} from './routes';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { AzureDevOpsClient } from './api/AzureDevOpsClient';
import { Entity } from '@backstage/catalog-model';
import { azureDevOpsApiRef } from './api/AzureDevOpsApi';

export const isAzureDevOpsAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[AZURE_DEVOPS_REPO_ANNOTATION]);

export const isAzurePipelinesAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[AZURE_DEVOPS_REPO_ANNOTATION]) ||
  (Boolean(entity.metadata.annotations?.[AZURE_DEVOPS_PROJECT_ANNOTATION]) &&
    Boolean(
      entity.metadata.annotations?.[AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION],
    ));

export const azureDevOpsPlugin = createPlugin({
  id: 'azureDevOps',
  apis: [
    createApiFactory({
      api: azureDevOpsApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new AzureDevOpsClient({ discoveryApi, identityApi }),
    }),
  ],
});

export const AzurePullRequestsPage = azureDevOpsPlugin.provide(
  createRoutableExtension({
    name: 'AzurePullRequestsPage',
    component: () =>
      import('./components/PullRequestsPage').then(m => m.PullRequestsPage),
    mountPoint: azurePullRequestDashboardRouteRef,
  }),
);

export const EntityAzurePipelinesContent = azureDevOpsPlugin.provide(
  createRoutableExtension({
    name: 'EntityAzurePipelinesContent',
    component: () =>
      import('./components/EntityPageAzurePipelines').then(
        m => m.EntityPageAzurePipelines,
      ),
    mountPoint: azurePipelinesEntityContentRouteRef,
  }),
);

export const EntityAzurePullRequestsContent = azureDevOpsPlugin.provide(
  createRoutableExtension({
    name: 'EntityAzurePullRequestsContent',
    component: () =>
      import('./components/EntityPageAzurePullRequests').then(
        m => m.EntityPageAzurePullRequests,
      ),
    mountPoint: azurePullRequestsEntityContentRouteRef,
  }),
);
