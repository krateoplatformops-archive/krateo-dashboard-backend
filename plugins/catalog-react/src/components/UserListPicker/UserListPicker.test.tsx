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

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  Entity,
  RELATION_OWNED_BY,
  UserEntity,
} from '@backstage/catalog-model';
import { UserListPicker } from './UserListPicker';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityTagFilter, UserListFilter } from '../../filters';
import { CatalogApi } from '@backstage/catalog-client';
import { catalogApiRef } from '../../api';
import { MockStorageApi, TestApiRegistry } from '@backstage/test-utils';

import { ApiProvider } from '@backstage/core-app-api';
import {
  ConfigApi,
  configApiRef,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';

const mockUser: UserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    namespace: 'default',
    name: 'testUser',
  },
  spec: {
    memberOf: [],
  },
};

const mockConfigApi = {
  getOptionalString: () => 'Test Company',
} as Partial<ConfigApi>;

const mockCatalogApi = {
  getEntityByName: () => Promise.resolve(mockUser),
} as Partial<CatalogApi>;

const mockIdentityApi = {
  getUserId: () => 'testUser',
  getIdToken: async () => undefined,
} as Partial<IdentityApi>;

const apis = TestApiRegistry.from(
  [configApiRef, mockConfigApi],
  [catalogApiRef, mockCatalogApi],
  [identityApiRef, mockIdentityApi],
  [storageApiRef, MockStorageApi.create()],
);

const mockIsOwnedEntity = (entity: Entity) =>
  entity.metadata.name === 'component-1';

const mockIsStarredEntity = (entity: Entity) =>
  entity.metadata.name === 'component-3';

jest.mock('../../hooks', () => {
  const actual = jest.requireActual('../../hooks');
  return {
    ...actual,
    useEntityOwnership: () => ({
      isOwnedEntity: mockIsOwnedEntity,
    }),
    useStarredEntities: () => ({
      isStarredEntity: mockIsStarredEntity,
    }),
  };
});

const backendEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'namespace-1',
      name: 'component-1',
      tags: ['tag1'],
    },
    relations: [
      {
        type: RELATION_OWNED_BY,
        target: { kind: 'User', namespace: 'default', name: 'testUser' },
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'namespace-2',
      name: 'component-2',
      tags: ['tag1'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'namespace-2',
      name: 'component-3',
      tags: [],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'namespace-2',
      name: 'component-4',
      tags: [],
    },
    relations: [
      {
        type: RELATION_OWNED_BY,
        target: { kind: 'User', namespace: 'default', name: 'testUser' },
      },
    ],
  },
];

describe('<UserListPicker />', () => {
  it('renders filter groups', () => {
    const { queryByText } = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ backendEntities }}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(queryByText('Personal')).toBeInTheDocument();
    expect(queryByText('Test Company')).toBeInTheDocument();
  });

  it('renders filters', () => {
    const { getAllByRole } = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ backendEntities }}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(
      getAllByRole('menuitem').map(({ textContent }) => textContent),
    ).toEqual(['Owned', 'Starred', 'All']);
  });

  it('includes counts alongside each filter', async () => {
    const { getAllByRole } = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ backendEntities }}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    // Material UI renders ListItemSecondaryActions outside the
    // menuitem itself, so we pick off the next sibling.
    await waitFor(() => {
      expect(
        getAllByRole('menuitem').map(
          ({ nextSibling }) => nextSibling?.textContent,
        ),
      ).toEqual(['1', '1', '4']);
    });
  });

  it('respects other frontend filters in counts', async () => {
    const { getAllByRole } = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            backendEntities,
            filters: { tags: new EntityTagFilter(['tag1']) },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(
        getAllByRole('menuitem').map(
          ({ nextSibling }) => nextSibling?.textContent,
        ),
      ).toEqual(['1', '0', '2']);
    });
  });

  it('respects the query parameter filter value', () => {
    const updateFilters = jest.fn();
    const queryParameters = { user: 'owned' };
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ backendEntities, updateFilters, queryParameters }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      user: new UserListFilter('owned', mockIsOwnedEntity, mockIsStarredEntity),
    });
  });

  it('updates user filter when a menuitem is selected', () => {
    const updateFilters = jest.fn();
    const { getByText } = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ backendEntities, updateFilters }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    fireEvent.click(getByText('Starred'));

    expect(updateFilters).toHaveBeenLastCalledWith({
      user: new UserListFilter(
        'starred',
        mockIsOwnedEntity,
        mockIsStarredEntity,
      ),
    });
  });
});
