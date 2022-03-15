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

import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { initRepoAndPush } from '../helpers';
import { GitRepositoryCreateOptions } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import { getRepoSourceDirectory, parseRepoUrl } from './util';
import { createTemplateAction } from '../../createTemplateAction';
import { Config } from '@backstage/config';

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to Azure.
 * @public
 */
export function createPublishAzureAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    defaultBranch?: string;
    sourcePath?: string;
    token?: string;
  }>({
    id: 'publish:azure',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to Azure.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
          },
          description: {
            title: 'Repository Description',
            type: 'string',
          },
          defaultBranch: {
            title: 'Default Branch',
            type: 'string',
            description: `Sets the default branch on the repository. The default value is 'master'`,
          },
          sourcePath: {
            title: 'Source Path',
            description:
              'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            type: 'string',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to Azure',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          remoteUrl: {
            title: 'A URL to the repository with the provider',
            type: 'string',
          },
          repoContentsUrl: {
            title: 'A URL to the root of the repository',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { repoUrl, defaultBranch = 'master' } = ctx.input;

      const { owner, repo, host, organization } = parseRepoUrl(
        repoUrl,
        integrations,
      );

      if (!organization) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing organization`,
        );
      }

      const integrationConfig = integrations.azure.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      if (!integrationConfig.config.token && !ctx.input.token) {
        throw new InputError(`No token provided for Azure Integration ${host}`);
      }

      const token = ctx.input.token ?? integrationConfig.config.token!;
      const authHandler = getPersonalAccessTokenHandler(token);

      const webApi = new WebApi(`https://${host}/${organization}`, authHandler);
      const client = await webApi.getGitApi();
      const createOptions: GitRepositoryCreateOptions = { name: repo };
      const returnedRepo = await client.createRepository(createOptions, owner);

      if (!returnedRepo) {
        throw new InputError(
          `Unable to create the repository with Organization ${organization}, Project ${owner} and Repo ${repo}.
          Please make sure that both the Org and Project are typed corrected and exist.`,
        );
      }
      const remoteUrl = returnedRepo.remoteUrl;

      if (!remoteUrl) {
        throw new InputError(
          'No remote URL returned from create repository for Azure',
        );
      }

      // blam: Repo contents is serialized into the path,
      // so it's just the base path I think
      const repoContentsUrl = remoteUrl;

      const gitAuthorInfo = {
        name: config.getOptionalString('scaffolder.defaultAuthor.name'),
        email: config.getOptionalString('scaffolder.defaultAuthor.email'),
      };

      await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, ctx.input.sourcePath),
        remoteUrl,
        defaultBranch,
        auth: {
          username: 'notempty',
          password: token,
        },
        logger: ctx.logger,
        commitMessage: config.getOptionalString(
          'scaffolder.defaultCommitMessage',
        ),
        gitAuthorInfo,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
