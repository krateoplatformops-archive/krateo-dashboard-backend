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
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  ConfigApi,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {
  GitHubIntegrationConfig,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { ScmAuthApi } from '@backstage/integration-react';
import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';
import { PartialEntity } from '../types';
import { AnalyzeResult, CatalogImportApi } from './CatalogImportApi';
import { getGithubIntegrationConfig } from './GitHub';
import { trimEnd } from 'lodash';
import { getBranchName, getCatalogFilename } from '../components/helpers';

/**
 * The default implementation of the {@link CatalogImportApi}.
 *
 * @public
 */
export class CatalogImportClient implements CatalogImportApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly scmAuthApi: ScmAuthApi;
  private readonly scmIntegrationsApi: ScmIntegrationRegistry;
  private readonly catalogApi: CatalogApi;
  private readonly configApi: ConfigApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    scmAuthApi: ScmAuthApi;
    identityApi: IdentityApi;
    scmIntegrationsApi: ScmIntegrationRegistry;
    catalogApi: CatalogApi;
    configApi: ConfigApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.scmAuthApi = options.scmAuthApi;
    this.identityApi = options.identityApi;
    this.scmIntegrationsApi = options.scmIntegrationsApi;
    this.catalogApi = options.catalogApi;
    this.configApi = options.configApi;
  }

  async analyzeUrl(url: string): Promise<AnalyzeResult> {
    if (
      new URL(url).pathname.match(/\.ya?ml$/) ||
      new URL(url).searchParams.get('path')?.match(/.ya?ml$/)
    ) {
      const location = await this.catalogApi.addLocation({
        type: 'url',
        target: url,
        dryRun: true,
      });

      return {
        type: 'locations',
        locations: [
          {
            exists: location.exists,
            target: location.location.target,
            entities: location.entities.map(e => ({
              kind: e.kind,
              namespace: e.metadata.namespace ?? 'default',
              name: e.metadata.name,
            })),
          },
        ],
      };
    }

    const ghConfig = getGithubIntegrationConfig(this.scmIntegrationsApi, url);
    if (!ghConfig) {
      const other = this.scmIntegrationsApi.byUrl(url);
      const catalogFilename = getCatalogFilename(this.configApi);

      if (other) {
        throw new Error(
          `The ${other.title} integration only supports full URLs to ${catalogFilename} files. Did you try to pass in the URL of a directory instead?`,
        );
      }
      throw new Error(
        `This URL was not recognized as a valid GitHub URL because there was no configured integration that matched the given host name. You could try to paste the full URL to a ${catalogFilename} file instead.`,
      );
    }

    // TODO: this could be part of the analyze-location endpoint
    const locations = await this.checkGitHubForExistingCatalogInfo({
      ...ghConfig,
      url,
    });

    if (locations.length > 0) {
      return {
        type: 'locations',
        locations,
      };
    }

    return {
      type: 'repository',
      integrationType: 'github',
      url: url,
      generatedEntities: await this.generateEntityDefinitions({
        repo: url,
      }),
    };
  }

  async preparePullRequest(): Promise<{
    title: string;
    body: string;
  }> {
    const appTitle =
      this.configApi.getOptionalString('app.title') ?? 'Backstage';
    const appBaseUrl = this.configApi.getString('app.baseUrl');
    const catalogFilename = getCatalogFilename(this.configApi);

    return {
      title: `Add ${catalogFilename} config file`,
      body: `This pull request adds a **Backstage entity metadata file** \
to this repository so that the component can be added to the \
[${appTitle} software catalog](${appBaseUrl}).\n\nAfter this pull request is merged, \
the component will become available.\n\nFor more information, read an \
[overview of the Backstage software catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview).`,
    };
  }

  async submitPullRequest(options: {
    repositoryUrl: string;
    fileContent: string;
    title: string;
    body: string;
  }): Promise<{ link: string; location: string }> {
    const { repositoryUrl, fileContent, title, body } = options;

    const ghConfig = getGithubIntegrationConfig(
      this.scmIntegrationsApi,
      repositoryUrl,
    );

    if (ghConfig) {
      return await this.submitGitHubPrToRepo({
        ...ghConfig,
        repositoryUrl,
        fileContent,
        title,
        body,
      });
    }

    throw new Error('unimplemented!');
  }

  // TODO: this could be part of the catalog api
  private async generateEntityDefinitions(options: {
    repo: string;
  }): Promise<PartialEntity[]> {
    const { token } = await this.identityApi.getCredentials();
    const response = await fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/analyze-location`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        method: 'POST',
        body: JSON.stringify({
          location: { type: 'url', target: options.repo },
        }),
      },
    ).catch(e => {
      throw new Error(`Failed to generate entity definitions, ${e.message}`);
    });
    if (!response.ok) {
      throw new Error(
        `Failed to generate entity definitions. Received http response ${response.status}: ${response.statusText}`,
      );
    }

    const payload = await response.json();
    return payload.generateEntities.map((x: any) => x.entity);
  }

  // TODO: this response should better be part of the analyze-locations response and scm-independent / implemented per scm
  private async checkGitHubForExistingCatalogInfo(options: {
    url: string;
    owner: string;
    repo: string;
    githubIntegrationConfig: GitHubIntegrationConfig;
  }): Promise<
    Array<{
      target: string;
      entities: CompoundEntityRef[];
    }>
  > {
    const { url, owner, repo, githubIntegrationConfig } = options;

    const { token } = await this.scmAuthApi.getCredentials({ url });
    const octo = new Octokit({
      auth: token,
      baseUrl: githubIntegrationConfig.apiBaseUrl,
    });
    const catalogFilename = getCatalogFilename(this.configApi);
    const query = `repo:${owner}/${repo}+filename:${catalogFilename}`;

    const searchResult = await octo.search.code({ q: query }).catch(e => {
      throw new Error(
        formatHttpErrorMessage(
          "Couldn't search repository for metadata file.",
          e,
        ),
      );
    });
    const exists = searchResult.data.total_count > 0;
    if (exists) {
      const repoInformation = await octo.repos.get({ owner, repo }).catch(e => {
        throw new Error(formatHttpErrorMessage("Couldn't fetch repo data", e));
      });
      const defaultBranch = repoInformation.data.default_branch;

      return await Promise.all(
        searchResult.data.items
          .map(i => `${trimEnd(url, '/')}/blob/${defaultBranch}/${i.path}`)
          .map(async target => {
            const result = await this.catalogApi.addLocation({
              type: 'url',
              target,
              dryRun: true,
            });
            return {
              target,
              exists: result.exists,
              entities: result.entities.map(e => ({
                kind: e.kind,
                namespace: e.metadata.namespace ?? 'default',
                name: e.metadata.name,
              })),
            };
          }),
      );
    }

    return [];
  }

  // TODO: extract this function and implement for non-github
  private async submitGitHubPrToRepo(options: {
    owner: string;
    repo: string;
    title: string;
    body: string;
    fileContent: string;
    repositoryUrl: string;
    githubIntegrationConfig: GitHubIntegrationConfig;
  }): Promise<{ link: string; location: string }> {
    const {
      owner,
      repo,
      title,
      body,
      fileContent,
      repositoryUrl,
      githubIntegrationConfig,
    } = options;

    const { token } = await this.scmAuthApi.getCredentials({
      url: repositoryUrl,
      additionalScope: {
        repoWrite: true,
      },
    });

    const octo = new Octokit({
      auth: token,
      baseUrl: githubIntegrationConfig.apiBaseUrl,
    });

    const branchName = getBranchName(this.configApi);
    const fileName = getCatalogFilename(this.configApi);

    const repoData = await octo.repos
      .get({
        owner,
        repo,
      })
      .catch(e => {
        throw new Error(formatHttpErrorMessage("Couldn't fetch repo data", e));
      });

    const parentRef = await octo.git
      .getRef({
        owner,
        repo,
        ref: `heads/${repoData.data.default_branch}`,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage("Couldn't fetch default branch data", e),
        );
      });

    await octo.git
      .createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: parentRef.data.object.sha,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a new branch with name '${branchName}'`,
            e,
          ),
        );
      });

    await octo.repos
      .createOrUpdateFileContents({
        owner,
        repo,
        path: fileName,
        message: title,
        content: Base64.encode(fileContent),
        branch: branchName,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a commit with ${fileName} file added`,
            e,
          ),
        );
      });

    const pullRequestResponse = await octo.pulls
      .create({
        owner,
        repo,
        title,
        head: branchName,
        body,
        base: repoData.data.default_branch,
      })
      .catch(e => {
        throw new Error(
          formatHttpErrorMessage(
            `Couldn't create a pull request for ${branchName} branch`,
            e,
          ),
        );
      });

    return {
      link: pullRequestResponse.data.html_url,
      location: `https://${githubIntegrationConfig.host}/${owner}/${repo}/blob/${repoData.data.default_branch}/${fileName}`,
    };
  }
}

function formatHttpErrorMessage(
  message: string,
  error: { status: number; message: string },
) {
  return `${message}, received http response status code ${error.status}: ${error.message}`;
}
