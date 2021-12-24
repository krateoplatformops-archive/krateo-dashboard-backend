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

import { CatalogClient } from '@backstage/catalog-client';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import React from 'react';
import { useOutlet } from 'react-router';
import { catalogImportApiRef, CatalogImportClient } from '../../api';
import { ImportPage } from './ImportPage';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useOutlet: jest.fn(),
}));

describe('<ImportPage />', () => {
  const identityApi = {
    getUserId: () => {
      return 'user';
    },
    getProfile: () => {
      return {};
    },
    getIdToken: () => {
      return Promise.resolve('token');
    },
    signOut: () => {
      return Promise.resolve();
    },
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(),
    getCredentials: jest.fn(),
  };

  let apis: TestApiRegistry;

  beforeEach(() => {
    apis = TestApiRegistry.from(
      [configApiRef, new ConfigReader({ integrations: {} })],
      [catalogApiRef, new CatalogClient({ discoveryApi: {} as any })],
      [
        catalogImportApiRef,
        new CatalogImportClient({
          discoveryApi: {} as any,
          identityApi,
          scmAuthApi: {} as any,
          scmIntegrationsApi: {} as any,
          catalogApi: {} as any,
          configApi: new ConfigReader({}),
        }),
      ],
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ImportPage />
      </ApiProvider>,
    );

    expect(
      getByText('Start tracking your component in Backstage'),
    ).toBeInTheDocument();
  });

  it('renders with custom children', async () => {
    (useOutlet as jest.Mock).mockReturnValue(<div>Hello World</div>);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ImportPage />
      </ApiProvider>,
    );

    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
