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

import { errorApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';
import { TextField } from '@material-ui/core';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AnalyzeResult, catalogImportApiRef } from '../../api';
import { asInputRef } from '../helpers';
import {
  generateEntities,
  StepPrepareCreatePullRequest,
} from './StepPrepareCreatePullRequest';

describe('<StepPrepareCreatePullRequest />', () => {
  const catalogImportApi: jest.Mocked<typeof catalogImportApiRef.T> = {
    analyzeUrl: jest.fn(),
    submitPullRequest: jest.fn(),
    preparePullRequest: jest.fn(),
  };

  const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    getEntityByName: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByEntity: jest.fn(),
    getLocationById: jest.fn(),
    removeLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityAncestors: jest.fn(),
  };

  const errorApi: jest.Mocked<typeof errorApiRef.T> = {
    error$: jest.fn(),
    post: jest.fn(),
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <TestApiProvider
      apis={[
        [catalogImportApiRef, catalogImportApi],
        [catalogApiRef, catalogApi],
        [errorApiRef, errorApi],
      ]}
    >
      {children}
    </TestApiProvider>
  );

  const onPrepareFn = jest.fn();
  const analyzeResult = {
    type: 'repository',
    url: 'https://my-repository',
    integrationType: 'github',
    generatedEntities: [
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          namespace: 'default',
        },
        spec: {
          owner: 'my-owner',
        },
      },
    ],
  } as Extract<AnalyzeResult, { type: 'repository' }>;

  beforeEach(() => {
    jest.resetAllMocks();

    (catalogImportApi.preparePullRequest! as jest.Mock).mockResolvedValue({
      title: 'My title',
      body: 'My **body**',
    });
  });

  it('renders without exploding', async () => {
    catalogApi.getEntities.mockReturnValue(Promise.resolve({ items: [] }));

    await act(async () => {
      const { findByText } = render(
        <StepPrepareCreatePullRequest
          analyzeResult={analyzeResult}
          onPrepare={onPrepareFn}
          renderFormFields={({ register }) => {
            return (
              <>
                <TextField {...asInputRef(register('title'))} />
                <TextField {...asInputRef(register('body'))} />
                <TextField {...asInputRef(register('componentName'))} />
                <TextField {...asInputRef(register('owner'))} />
              </>
            );
          }}
        />,
        {
          wrapper: Wrapper,
        },
      );

      const title = await findByText('My title');
      const description = await findByText('body', { selector: 'strong' });
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();
      expect(description).toBeInTheDocument();
      expect(description).toBeVisible();
    });
  });

  it('should submit created PR', async () => {
    catalogApi.getEntities.mockReturnValue(Promise.resolve({ items: [] }));
    catalogImportApi.submitPullRequest.mockReturnValue(
      Promise.resolve({
        location: 'https://my/location.yaml',
        link: 'https://my/pull',
      }),
    );

    await act(async () => {
      render(
        <StepPrepareCreatePullRequest
          analyzeResult={analyzeResult}
          onPrepare={onPrepareFn}
          renderFormFields={({ register }) => {
            return (
              <>
                <TextField {...asInputRef(register('title'))} />
                <TextField {...asInputRef(register('body'))} />
                <TextField
                  {...asInputRef(register('componentName'))}
                  id="name"
                  label="name"
                />
                <TextField
                  {...asInputRef(register('owner'))}
                  id="owner"
                  label="owner"
                />
              </>
            );
          }}
        />,
        {
          wrapper: Wrapper,
        },
      );

      userEvent.type(await screen.findByLabelText('name'), '-changed');
      userEvent.type(await screen.findByLabelText('owner'), '-changed');
      userEvent.click(screen.getByRole('button', { name: /Create PR/i }));
    });

    expect(catalogImportApi.submitPullRequest).toBeCalledTimes(1);
    expect(catalogImportApi.submitPullRequest.mock.calls[0]).toMatchObject([
      {
        body: 'My **body**',
        fileContent: `apiVersion: "1"
kind: Component
metadata:
  name: my-component-changed
  namespace: default
spec:
  owner: my-owner-changed
`,
        repositoryUrl: 'https://my-repository',
        title: 'My title',
      },
    ]);
    expect(onPrepareFn).toBeCalledTimes(1);
    expect(onPrepareFn.mock.calls[0]).toMatchObject([
      {
        type: 'repository',
        url: 'https://my-repository',
        integrationType: 'github',
        pullRequest: {
          url: 'https://my/pull',
        },
        locations: [
          {
            entities: [
              {
                kind: 'Component',
                name: 'my-component-changed',
                namespace: 'default',
              },
            ],
            target: 'https://my/location.yaml',
          },
        ],
      },
      {
        notRepeatable: true,
      },
    ]);
  });

  it('should show error message', async () => {
    catalogApi.getEntities.mockResolvedValueOnce({ items: [] });
    catalogImportApi.submitPullRequest.mockRejectedValueOnce(
      new Error('some error'),
    );

    await act(async () => {
      render(
        <StepPrepareCreatePullRequest
          analyzeResult={analyzeResult}
          onPrepare={onPrepareFn}
          renderFormFields={({ register }) => {
            return (
              <>
                <TextField {...asInputRef(register('title'))} />
                <TextField {...asInputRef(register('body'))} />
                <TextField {...asInputRef(register('componentName'))} />
                <TextField {...asInputRef(register('owner'))} />
              </>
            );
          }}
        />,
        {
          wrapper: Wrapper,
        },
      );

      userEvent.click(
        await screen.findByRole('button', { name: /Create PR/i }),
      );
    });

    expect(screen.getByText('some error')).toBeInTheDocument();
    expect(catalogImportApi.submitPullRequest).toBeCalledTimes(1);
    expect(onPrepareFn).toBeCalledTimes(0);
  });

  it('should load groups', async () => {
    const renderFormFieldsFn = jest.fn();
    catalogApi.getEntities.mockReturnValue(
      Promise.resolve({
        items: [
          {
            apiVersion: '1',
            kind: 'Group',
            metadata: {
              name: 'my-group',
            },
          },
        ],
      }),
    );

    await act(async () => {
      render(
        <StepPrepareCreatePullRequest
          analyzeResult={analyzeResult}
          onPrepare={onPrepareFn}
          renderFormFields={renderFormFieldsFn}
        />,
        {
          wrapper: Wrapper,
        },
      );
    });

    expect(catalogApi.getEntities).toBeCalledTimes(1);
    expect(renderFormFieldsFn).toBeCalled();
    expect(renderFormFieldsFn.mock.calls[0][0]).toMatchObject({
      groups: [],
      groupsLoading: true,
    });
    expect(
      renderFormFieldsFn.mock.calls[
        renderFormFieldsFn.mock.calls.length - 1
      ][0],
    ).toMatchObject({ groups: ['my-group'], groupsLoading: false });
  });

  describe('generateEntities', () => {
    it.each([[undefined], [null]])(
      'should not include blank namespace for %s',
      namespace => {
        expect(
          generateEntities(
            [{ metadata: { namespace: namespace as any } }],
            'my-component',
            'group-1',
          ),
        ).toEqual([
          expect.objectContaining({
            metadata: expect.not.objectContaining({
              namespace: 'default',
            }),
          }),
        ]);
      },
    );

    it.each([['default'], ['my-namespace']])(
      'should include explicit namespace %s',
      namespace => {
        expect(
          generateEntities(
            [{ metadata: { namespace } }],
            'my-component',
            'group-1',
          ),
        ).toEqual([
          expect.objectContaining({
            metadata: expect.objectContaining({
              namespace,
            }),
          }),
        ]);
      },
    );
  });
});
