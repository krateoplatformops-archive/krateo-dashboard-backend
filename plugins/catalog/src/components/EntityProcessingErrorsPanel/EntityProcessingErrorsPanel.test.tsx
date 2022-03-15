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

import { AlphaEntity, stringifyEntityRef } from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import React from 'react';
import { EntityProcessingErrorsPanel } from './EntityProcessingErrorsPanel';

describe('<EntityProcessErrors />', () => {
  const getEntityAncestors: jest.MockedFunction<
    CatalogApi['getEntityAncestors']
  > = jest.fn();
  const apis = TestApiRegistry.from([catalogApiRef, { getEntityAncestors }]);

  it('renders EntityProcessErrors if the entity has errors', async () => {
    const entity: AlphaEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
      },

      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
      status: {
        items: [
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message:
              'InputError: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
            error: {
              name: 'InputError',
              message:
                'Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'foo',
            level: 'error',
            message: 'InputError: This should not be rendered',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message: 'InputError: Foo',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
        ],
      },
    };

    getEntityAncestors.mockResolvedValue({
      rootEntityRef: stringifyEntityRef(entity),
      items: [{ entity, parentEntityRefs: [] }],
    });
    const { getByText, queryByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <EntityProcessingErrorsPanel />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(
      getByText(
        'Error: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
      ),
    ).toBeInTheDocument();
    expect(getByText('Error: Foo')).toBeInTheDocument();
    expect(queryByText('Error: This should not be rendered')).toBeNull();
    expect(
      queryByText('The error below originates from'),
    ).not.toBeInTheDocument();
  });

  it('renders EntityProcessErrors if the parent entity has errors', async () => {
    const entity: AlphaEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const parent: AlphaEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'parent',
        description: 'This is the description',
      },

      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
      status: {
        items: [
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message:
              'InputError: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
            error: {
              name: 'InputError',
              message:
                'Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'foo',
            level: 'error',
            message: 'InputError: This should not be rendered',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message: 'InputError: Foo',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
        ],
      },
    };
    getEntityAncestors.mockResolvedValue({
      rootEntityRef: stringifyEntityRef(entity),
      items: [
        { entity, parentEntityRefs: [stringifyEntityRef(parent)] },
        { entity: parent, parentEntityRefs: [] },
      ],
    });
    const { getByText, queryByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <EntityProcessingErrorsPanel />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(
      getByText(
        'Error: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
      ),
    ).toBeInTheDocument();
    expect(getByText('Error: Foo')).toBeInTheDocument();
    expect(queryByText('Error: This should not be rendered')).toBeNull();
    expect(queryByText('The error below originates from')).toBeInTheDocument();
  });
});
