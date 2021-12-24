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

import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  createRouteRef,
  createSubRouteRef,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { JenkinsClient, jenkinsApiRef } from './api';

export const rootRouteRef = createRouteRef({
  id: 'jenkins',
});

export const buildRouteRef = createSubRouteRef({
  id: 'jenkins/builds',
  path: '/builds/:jobFullName/:buildNumber',
  parent: rootRouteRef,
});

export const jenkinsPlugin = createPlugin({
  id: 'jenkins',
  apis: [
    createApiFactory({
      api: jenkinsApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new JenkinsClient({ discoveryApi, identityApi }),
    }),
  ],
  routes: {
    entityContent: rootRouteRef,
  },
});

export const EntityJenkinsContent = jenkinsPlugin.provide(
  createRoutableExtension({
    name: 'EntityJenkinsContent',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);
export const EntityLatestJenkinsRunCard = jenkinsPlugin.provide(
  createComponentExtension({
    name: 'EntityLatestJenkinsRunCard',
    component: {
      lazy: () => import('./components/Cards').then(m => m.LatestRunCard),
    },
  }),
);
