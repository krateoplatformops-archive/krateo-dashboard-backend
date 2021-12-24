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

import { techdocsApiRef, techdocsStorageApiRef } from './api';
import { TechDocsClient, TechDocsStorageClient } from './client';
import {
  rootDocsRouteRef,
  rootRouteRef,
  rootCatalogDocsRouteRef,
} from './routes';
import {
  configApiRef,
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

export const techdocsPlugin = createPlugin({
  id: 'techdocs',
  apis: [
    createApiFactory({
      api: techdocsStorageApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ configApi, discoveryApi, identityApi }) =>
        new TechDocsStorageClient({
          configApi,
          discoveryApi,
          identityApi,
        }),
    }),
    createApiFactory({
      api: techdocsApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ configApi, discoveryApi, identityApi }) =>
        new TechDocsClient({
          configApi,
          discoveryApi,
          identityApi,
        }),
    }),
  ],
  routes: {
    root: rootRouteRef,
    docRoot: rootDocsRouteRef,
    entityContent: rootCatalogDocsRouteRef,
  },
});

export const TechdocsPage = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'TechdocsPage',
    component: () => import('./Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const EntityTechdocsContent = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'EntityTechdocsContent',
    component: () => import('./Router').then(m => m.EmbeddedDocsRouter),
    mountPoint: rootCatalogDocsRouteRef,
  }),
);

// takes a list of entities and renders documentation cards
export const DocsCardGrid = techdocsPlugin.provide(
  createComponentExtension({
    name: 'DocsCardGrid',
    component: {
      lazy: () =>
        import('./home/components/DocsCardGrid').then(m => m.DocsCardGrid),
    },
  }),
);

// takes a list of entities and renders table listing documentation
export const DocsTable = techdocsPlugin.provide(
  createComponentExtension({
    name: 'DocsTable',
    component: {
      lazy: () => import('./home/components/DocsTable').then(m => m.DocsTable),
    },
  }),
);

// takes a custom tabs config object and renders a documentation landing page
export const TechDocsCustomHome = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'TechDocsCustomHome',
    component: () =>
      import('./home/components/TechDocsCustomHome').then(
        m => m.TechDocsCustomHome,
      ),
    mountPoint: rootRouteRef,
  }),
);

export const TechDocsIndexPage = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'TechDocsIndexPage',
    component: () =>
      import('./home/components/TechDocsIndexPage').then(
        m => m.TechDocsIndexPage,
      ),
    mountPoint: rootRouteRef,
  }),
);

export const TechDocsReaderPage = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'TechDocsReaderPage',
    component: () =>
      import('./reader/components/TechDocsPage').then(m => m.TechDocsPage),
    mountPoint: rootDocsRouteRef,
  }),
);
