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

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  GitHubIntegrationConfig,
  ScmIntegrations,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { graphql } from '@octokit/graphql';
import { merge } from 'lodash';
import { Logger } from 'winston';
import {
  assignGroupsToUsers,
  buildOrgHierarchy,
  getOrganizationTeams,
  getOrganizationUsers,
  parseGitHubOrgUrl,
} from './lib';

// TODO: Consider supporting an (optional) webhook that reacts on org changes
/** @public */
export class GitHubOrgEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;
  private githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(
    config: Config,
    options: {
      id: string;
      orgUrl: string;
      logger: Logger;
      githubCredentialsProvider?: GithubCredentialsProvider;
    },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);
    const gitHubConfig = integrations.github.byUrl(options.orgUrl)?.config;

    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub Org provider that matches ${options.orgUrl}. Please add a configuration for an integration.`,
      );
    }

    const logger = options.logger.child({
      target: options.orgUrl,
    });

    return new GitHubOrgEntityProvider({
      id: options.id,
      orgUrl: options.orgUrl,
      logger,
      gitHubConfig,
      githubCredentialsProvider:
        options.githubCredentialsProvider ||
        DefaultGithubCredentialsProvider.fromIntegrations(integrations),
    });
  }

  constructor(
    private options: {
      id: string;
      orgUrl: string;
      gitHubConfig: GitHubIntegrationConfig;
      logger: Logger;
      githubCredentialsProvider?: GithubCredentialsProvider;
    },
  ) {
    this.githubCredentialsProvider =
      options.githubCredentialsProvider ||
      SingleInstanceGithubCredentialsProvider.create(options.gitHubConfig);
  }

  getProviderName() {
    return `GitHubOrgEntityProvider:${this.options.id}`;
  }

  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
  }

  async read() {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const { markReadComplete } = trackProgress(this.options.logger);

    const { headers, type: tokenType } =
      await this.githubCredentialsProvider.getCredentials({
        url: this.options.orgUrl,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const { org } = parseGitHubOrgUrl(this.options.orgUrl);
    const { users } = await getOrganizationUsers(client, org, tokenType);
    const { groups, groupMemberUsers } = await getOrganizationTeams(
      client,
      org,
    );
    assignGroupsToUsers(users, groupMemberUsers);
    buildOrgHierarchy(groups);

    const { markCommitComplete } = markReadComplete({ users, groups });

    await this.connection.applyMutation({
      type: 'full',
      entities: [...users, ...groups].map(entity => ({
        locationKey: `github-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          org,
          entity,
        ),
      })),
    });

    markCommitComplete();
  }
}

// Helps wrap the timing and logging behaviors
function trackProgress(logger: Logger) {
  let timestamp = Date.now();
  let summary: string;

  logger.info('Reading GitHub users and groups');

  function markReadComplete(read: { users: unknown[]; groups: unknown[] }) {
    summary = `${read.users.length} GitHub users and ${read.groups.length} GitHub groups`;
    const readDuration = ((Date.now() - timestamp) / 1000).toFixed(1);
    timestamp = Date.now();
    logger.info(`Read ${summary} in ${readDuration} seconds. Committing...`);
    return { markCommitComplete };
  }

  function markCommitComplete() {
    const commitDuration = ((Date.now() - timestamp) / 1000).toFixed(1);
    logger.info(`Committed ${summary} in ${commitDuration} seconds.`);
  }

  return { markReadComplete };
}

// Makes sure that emitted entities have a proper location
export function withLocations(
  baseUrl: string,
  org: string,
  entity: Entity,
): Entity {
  const location =
    entity.kind === 'Group'
      ? `url:${baseUrl}/orgs/${org}/teams/${entity.metadata.name}`
      : `url:${baseUrl}/${entity.metadata.name}`;
  return merge(
    {
      metadata: {
        annotations: {
          [ANNOTATION_LOCATION]: location,
          [ANNOTATION_ORIGIN_LOCATION]: location,
        },
      },
    },
    entity,
  ) as Entity;
}
