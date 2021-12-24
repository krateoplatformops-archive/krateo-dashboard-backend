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

import { CatalogApi } from '@backstage/catalog-client';
import {
  Entity,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { TableColumn, TableProps } from '@backstage/core-components';
import {
  IdentityApi,
  identityApiRef,
  ProfileInfo,
  storageApiRef,
} from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  DefaultStarredEntitiesApi,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import {
  mockBreakpoint,
  MockStorageApi,
  renderWithEffects,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { createComponentRouteRef } from '../../routes';
import { EntityRow } from '../CatalogTable';
import { CatalogPage } from './CatalogPage';

describe('CatalogPage', () => {
  const origReplaceState = window.history.replaceState;
  beforeEach(() => {
    window.history.replaceState = jest.fn();
  });
  afterEach(() => {
    window.history.replaceState = origReplaceState;
  });

  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity1',
            },
            spec: {
              owner: 'tools',
              type: 'service',
            },
            relations: [
              {
                type: RELATION_OWNED_BY,
                target: { kind: 'Group', name: 'tools', namespace: 'default' },
              },
            ],
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity2',
            },
            spec: {
              owner: 'not-tools',
              type: 'service',
            },
            relations: [
              {
                type: RELATION_OWNED_BY,
                target: {
                  kind: 'Group',
                  name: 'not-tools',
                  namespace: 'default',
                },
              },
            ],
          },
        ] as Entity[],
      }),
    getLocationByEntity: () =>
      Promise.resolve({ id: 'id', type: 'github', target: 'url' }),
    getEntityByName: async entityName => {
      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: { name: entityName.name },
        relations: [
          {
            type: RELATION_MEMBER_OF,
            target: { namespace: 'default', kind: 'Group', name: 'tools' },
          },
        ],
      };
    },
  };
  const testProfile: Partial<ProfileInfo> = {
    displayName: 'Display Name',
  };
  const identityApi: Partial<IdentityApi> = {
    getUserId: () => 'tools',
    getIdToken: async () => undefined,
    getProfile: () => testProfile,
  };
  const storageApi = MockStorageApi.create();

  const renderWrapped = (children: React.ReactNode) =>
    renderWithEffects(
      wrapInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, catalogApi],
            [identityApiRef, identityApi],
            [storageApiRef, storageApi],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({ storageApi }),
            ],
          ]}
        >
          {children}
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/create': createComponentRouteRef,
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      ),
    );

  // TODO(freben): The test timeouts are bumped in this file, because it seems
  // page and table rerenders accumulate to occasionally go over the default
  // limit. We should investigate why these timeouts happen.

  it('should render the default column of the grid', async () => {
    const { getAllByRole } = await renderWrapped(<CatalogPage />);

    const columnHeader = getAllByRole('button').filter(
      c => c.tagName === 'SPAN',
    );
    const columnHeaderLabels = columnHeader.map(c => c.textContent);

    expect(columnHeaderLabels).toEqual([
      'Name',
      'System',
      'Owner',
      'Type',
      'Lifecycle',
      'Description',
      'Tags',
      'Actions',
    ]);
  }, 20_000);

  it('should render the custom column passed as prop', async () => {
    const columns: TableColumn<EntityRow>[] = [
      { title: 'Foo', field: 'entity.foo' },
      { title: 'Bar', field: 'entity.bar' },
      { title: 'Baz', field: 'entity.spec.lifecycle' },
    ];
    const { getAllByRole } = await renderWrapped(
      <CatalogPage columns={columns} />,
    );

    const columnHeader = getAllByRole('button').filter(
      c => c.tagName === 'SPAN',
    );
    const columnHeaderLabels = columnHeader.map(c => c.textContent);

    expect(columnHeaderLabels).toEqual(['Foo', 'Bar', 'Baz', 'Actions']);
  }, 20_000);

  it('should render the default actions of an item in the grid', async () => {
    const { findByTitle, findByText } = await renderWrapped(<CatalogPage />);
    expect(await findByText(/Owned \(1\)/)).toBeInTheDocument();
    expect(await findByTitle(/View/)).toBeInTheDocument();
    expect(await findByTitle(/Edit/)).toBeInTheDocument();
    expect(await findByTitle(/Add to favorites/)).toBeInTheDocument();
  }, 20_000);

  it('should render the custom actions of an item passed as prop', async () => {
    const actions: TableProps<EntityRow>['actions'] = [
      () => {
        return {
          icon: () => <DashboardIcon fontSize="small" />,
          tooltip: 'Foo Action',
          disabled: false,
          onClick: () => jest.fn(),
        };
      },
      () => {
        return {
          icon: () => <DashboardIcon fontSize="small" />,
          tooltip: 'Bar Action',
          disabled: true,
          onClick: () => jest.fn(),
        };
      },
    ];

    const { findByTitle, findByText } = await renderWrapped(
      <CatalogPage actions={actions} />,
    );
    expect(await findByText(/Owned \(1\)/)).toBeInTheDocument();
    expect(await findByTitle(/Foo Action/)).toBeInTheDocument();
    expect(await findByTitle(/Bar Action/)).toBeInTheDocument();
    expect((await findByTitle(/Bar Action/)).firstChild).toBeDisabled();
  }, 20_000);

  // this test right now causes some red lines in the log output when running tests
  // related to some theme issues in mui-table
  // https://github.com/mbrn/material-table/issues/1293
  it('should render', async () => {
    const { findByText, getByTestId } = await renderWrapped(<CatalogPage />);
    await expect(findByText(/Owned \(1\)/)).resolves.toBeInTheDocument();
    fireEvent.click(getByTestId('user-picker-all'));
    await expect(findByText(/All \(2\)/)).resolves.toBeInTheDocument();
  }, 20_000);

  it('should set initial filter correctly', async () => {
    const { findByText } = await renderWrapped(
      <CatalogPage initiallySelectedFilter="all" />,
    );
    await expect(findByText(/All \(2\)/)).resolves.toBeInTheDocument();
  }, 20_000);

  // this test is for fixing the bug after favoriting an entity, the matching
  // entities defaulting to "owned" filter and not based on the selected filter
  it('should render the correct entities filtered on the selected filter', async () => {
    await renderWrapped(<CatalogPage />);
    await expect(screen.findByText(/Owned \(1\)/)).resolves.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('user-picker-starred'));
    await expect(
      screen.findByText(/Starred \(0\)/),
    ).resolves.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('user-picker-all'));
    await expect(screen.findByText(/All \(2\)/)).resolves.toBeInTheDocument();

    const starredIcons = await screen.findAllByTitle('Add to favorites');
    fireEvent.click(starredIcons[0]);
    await expect(screen.findByText(/All \(2\)/)).resolves.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('user-picker-starred'));
    await expect(
      screen.findByText(/Starred \(1\)/),
    ).resolves.toBeInTheDocument();
  }, 20_000);

  it('should wrap filter in drawer on smaller screens', async () => {
    mockBreakpoint({ matches: true });
    const { getByRole } = await renderWrapped(<CatalogPage />);
    const button = getByRole('button', { name: 'Filters' });
    expect(getByRole('presentation', { hidden: true })).toBeInTheDocument();
    fireEvent.click(button);
    expect(getByRole('presentation')).toBeVisible();
  }, 20_000);
});
