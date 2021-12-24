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
import { renderInTestApp } from '@backstage/test-utils';
import { BuildsPage } from './BuildsPage';

jest.mock('../BuildDetails', () => ({
  withRequest: (component: any) => component,
  BuildDetails: () => 'BuildDetails',
}));

jest.mock('../BuildList', () => ({
  BuildList: () => 'BuildList',
}));

describe('BuildPage', () => {
  it('should render BuildDetails if build id is provided in path', async () => {
    const rendered = await renderInTestApp(<BuildsPage />, {
      routeEntries: [`/buildId`],
    });

    expect(rendered.getByText('BuildDetails')).toBeInTheDocument();
  });

  it('should render BuildList if no build id is provided in path', async () => {
    const rendered = await renderInTestApp(<BuildsPage />);

    expect(rendered.getByText('BuildList')).toBeInTheDocument();
  });
});
