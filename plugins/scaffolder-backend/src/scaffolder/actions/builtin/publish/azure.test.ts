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
jest.mock('azure-devops-node-api', () => ({
  WebApi: jest.fn(),
  getPersonalAccessTokenHandler: jest.fn().mockReturnValue(() => {}),
}));

jest.mock('../helpers');

import { createPublishAzureAction } from './azure';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { WebApi } from 'azure-devops-node-api';
import { PassThrough } from 'stream';
import { initRepoAndPush } from '../helpers';

describe('publish:azure', () => {
  const config = new ConfigReader({
    integrations: {
      azure: [
        { host: 'dev.azure.com', token: 'tokenlols' },
        { host: 'myazurehostnotoken.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishAzureAction({ integrations, config });
  const mockContext = {
    input: {
      repoUrl: 'dev.azure.com?repo=repo&owner=owner&organization=org',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  const mockGitClient = {
    createRepository: jest.fn(),
  };
  const mockGitApi = {
    getGitApi: jest.fn().mockReturnValue(mockGitClient),
  };

  (WebApi as unknown as jest.Mock).mockImplementation(() => mockGitApi);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'dev.azure.com?repo=bob' },
      }),
    ).rejects.toThrow(/missing owner/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'dev.azure.com?owner=owner' },
      }),
    ).rejects.toThrow(/missing repo/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'dev.azure.com?owner=owner&repo=repo' },
      }),
    ).rejects.toThrow(/missing organization/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'azure.com?repo=bob&owner=owner&organization=org' },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there is no token in the integration config that is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl:
            'myazurehostnotoken.com?repo=bob&owner=owner&organization=org',
        },
      }),
    ).rejects.toThrow(/No token provided for Azure Integration/);
  });

  it('should throw when no repo is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'dev.azure.com?repo=bob&owner=owner&organization=org',
        },
      }),
    ).rejects.toThrow(/Unable to create the repository/);
  });

  it('should not throw if there is a token provided through ctx.input', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'http://google.com',
    }));

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'myazurehostnotoken.com?repo=bob&owner=owner&organization=org',
        token: 'lols',
      },
    });

    expect(WebApi).toHaveBeenCalledWith(
      'https://myazurehostnotoken.com/org',
      expect.any(Function),
    );

    expect(mockGitClient.createRepository).toHaveBeenCalledWith(
      {
        name: 'bob',
      },
      'owner',
    );
  });

  it('should throw if there is no remoteUrl returned', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: null,
    }));
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'dev.azure.com?repo=bob&owner=owner&organization=org',
        },
      }),
    ).rejects.toThrow(/No remote URL returned/);
  });

  it('should call the azureApis with the correct values', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'http://google.com',
    }));

    await action.handler(mockContext);

    expect(WebApi).toHaveBeenCalledWith(
      'https://dev.azure.com/org',
      expect.any(Function),
    );

    expect(mockGitClient.createRepository).toHaveBeenCalledWith(
      {
        name: 'bob',
      },
      'owner',
    );
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
    }));

    await action.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      defaultBranch: 'master',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      gitAuthorInfo: {},
    });
  });

  it('should call initRepoAndPush with the correct default branch', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
    }));

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      defaultBranch: 'master',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      gitAuthorInfo: {},
    });
  });

  it('should call initRepoAndPush with the configured defaultAuthor', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        azure: [
          { host: 'dev.azure.com', token: 'tokenlols' },
          { host: 'myazurehostnotoken.com' },
        ],
      },
      scaffolder: {
        defaultAuthor: {
          name: 'Test',
          email: 'example@example.com',
        },
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishAzureAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
    }));

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      gitAuthorInfo: { name: 'Test', email: 'example@example.com' },
    });
  });

  it('should call initRepoAndPush with the configured defaultCommitMessage', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        azure: [
          { host: 'dev.azure.com', token: 'tokenlols' },
          { host: 'myazurehostnotoken.com' },
        ],
      },
      scaffolder: {
        defaultCommitMessage: 'Test commit message',
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishAzureAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
    }));

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'Test commit message',
      gitAuthorInfo: { email: undefined, name: undefined },
    });
  });

  it('should call output with the remoteUrl and the repoContentsUrl', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
    }));

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://dev.azure.com/organization/project/_git/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://dev.azure.com/organization/project/_git/repo',
    );
  });
});
