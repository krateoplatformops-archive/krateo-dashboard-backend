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

import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubAppCredentialsMux,
  GithubCredentialsProvider,
  GitHubIntegrationConfig,
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-backend';
import { graphql } from '@octokit/graphql';
import { Logger } from 'winston';
import {
  buildOrgHierarchy,
  getOrganizationTeams,
  getOrganizationUsers,
  GithubMultiOrgConfig,
  readGithubMultiOrgConfig,
} from './lib';

/**
 * Extracts teams and users out of a multiple GitHub orgs namespaced per org.
 *
 * Be aware that this processor may not be compatible with future org structures in the catalog.
 *
 * @public
 */
export class GithubMultiOrgReaderProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly orgs: GithubMultiOrgConfig;
  private readonly logger: Logger;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(
    config: Config,
    options: {
      logger: Logger;
      githubCredentialsProvider?: GithubCredentialsProvider;
    },
  ) {
    const c = config.getOptionalConfig('catalog.processors.githubMultiOrg');
    const integrations = ScmIntegrations.fromConfig(config);

    return new GithubMultiOrgReaderProcessor({
      ...options,
      integrations,
      orgs: c ? readGithubMultiOrgConfig(c) : [],
    });
  }

  constructor(options: {
    integrations: ScmIntegrationRegistry;
    logger: Logger;
    orgs: GithubMultiOrgConfig;
    githubCredentialsProvider?: GithubCredentialsProvider;
  }) {
    this.integrations = options.integrations;
    this.logger = options.logger;
    this.orgs = options.orgs;
    this.githubCredentialsProvider =
      options.githubCredentialsProvider ||
      DefaultGithubCredentialsProvider.fromIntegrations(this.integrations);
  }
  getProcessorName(): string {
    return 'GithubMultiOrgReaderProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'github-multi-org') {
      return false;
    }

    const gitHubConfig = this.integrations.github.byUrl(
      location.target,
    )?.config;
    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub integration that matches ${location.target}. Please add a configuration entry for it under integrations.github`,
      );
    }

    const allUsersMap = new Map();
    const baseUrl = new URL(location.target).origin;

    const orgsToProcess = this.orgs.length
      ? this.orgs
      : await this.getAllOrgs(gitHubConfig);

    for (const orgConfig of orgsToProcess) {
      try {
        const { headers, type: tokenType } =
          await this.githubCredentialsProvider.getCredentials({
            url: `${baseUrl}/${orgConfig.name}`,
          });
        const client = graphql.defaults({
          baseUrl: gitHubConfig.apiBaseUrl,
          headers,
        });

        const startTimestamp = Date.now();
        this.logger.info(
          `Reading GitHub users and teams for org: ${orgConfig.name}`,
        );
        const { users } = await getOrganizationUsers(
          client,
          orgConfig.name,
          tokenType,
          orgConfig.userNamespace,
        );
        const { groups, groupMemberUsers } = await getOrganizationTeams(
          client,
          orgConfig.name,
          orgConfig.groupNamespace,
        );

        const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
        this.logger.debug(
          `Read ${users.length} GitHub users and ${groups.length} GitHub teams from ${orgConfig.name} in ${duration} seconds`,
        );

        let prefix: string = orgConfig.userNamespace ?? '';
        if (prefix.length > 0) prefix += '/';

        users.forEach(u => {
          if (!allUsersMap.has(prefix + u.metadata.name)) {
            allUsersMap.set(prefix + u.metadata.name, u);
          }
        });

        for (const [groupName, userNames] of groupMemberUsers.entries()) {
          for (const userName of userNames) {
            const user = allUsersMap.get(prefix + userName);
            if (user && !user.spec.memberOf.includes(groupName)) {
              user.spec.memberOf.push(groupName);
            }
          }
        }
        buildOrgHierarchy(groups);

        for (const group of groups) {
          emit(processingResult.entity(location, group));
        }
      } catch (e) {
        this.logger.error(
          `Failed to read GitHub org data for ${orgConfig.name}: ${e}`,
        );
      }
    }

    const allUsers = Array.from(allUsersMap.values());
    for (const user of allUsers) {
      emit(processingResult.entity(location, user));
    }

    return true;
  }

  // Note: Does not support usage of PATs
  private async getAllOrgs(
    gitHubConfig: GitHubIntegrationConfig,
  ): Promise<GithubMultiOrgConfig> {
    const githubAppMux = new GithubAppCredentialsMux(gitHubConfig);
    const installs = await githubAppMux.getAllInstallations();

    return installs
      .map(install =>
        install.target_type === 'Organization' &&
        install.account &&
        install.account.login
          ? {
              name: install.account.login,
              groupNamespace: install.account.login.toLowerCase(),
            }
          : undefined,
      )
      .filter(Boolean) as GithubMultiOrgConfig;
  }
}
