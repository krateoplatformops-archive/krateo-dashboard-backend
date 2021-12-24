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

import React, { PropsWithChildren } from 'react';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '../api';
import { renderHook } from '@testing-library/react-hooks';
import { useEntityKinds } from './useEntityKinds';
import { TestApiProvider } from '@backstage/test-utils';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
  },
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template',
    },
  },
  {
    apiVersion: '1',
    kind: 'System',
    metadata: {
      name: 'system',
    },
  },
];

const mockCatalogApi: Partial<CatalogApi> = {
  getEntities: jest.fn().mockResolvedValue({ items: entities }),
};

const wrapper = ({ children }: PropsWithChildren<{}>) => {
  return (
    <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
      {children}
    </TestApiProvider>
  );
};

describe('useEntityKinds', () => {
  it('does not return duplicate kinds', async () => {
    const { result, waitForValueToChange } = renderHook(
      () => useEntityKinds(),
      {
        wrapper,
      },
    );
    await waitForValueToChange(() => result.current);
    expect(result.current.kinds).toBeDefined();
    expect(result.current.kinds!.length).toBe(3);
  });

  it('sorts entity kinds', async () => {
    const { result, waitForValueToChange } = renderHook(
      () => useEntityKinds(),
      {
        wrapper,
      },
    );
    await waitForValueToChange(() => result.current);
    expect(result.current.kinds).toEqual(['Component', 'System', 'Template']);
  });
});
