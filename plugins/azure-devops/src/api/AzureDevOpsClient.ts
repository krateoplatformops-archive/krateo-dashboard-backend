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
  DashboardPullRequest,
  PullRequest,
  PullRequestOptions,
  RepoBuild,
  RepoBuildOptions,
  Team,
} from '@backstage/plugin-azure-devops-common';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

import { AzureDevOpsApi } from './AzureDevOpsApi';
import { ResponseError } from '@backstage/errors';

export class AzureDevOpsClient implements AzureDevOpsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  public async getRepoBuilds(
    projectName: string,
    repoName: string,
    options?: RepoBuildOptions,
  ): Promise<{ items: RepoBuild[] }> {
    const queryString = new URLSearchParams();
    if (options?.top) {
      queryString.append('top', options.top.toString());
    }
    const urlSegment = `repo-builds/${encodeURIComponent(
      projectName,
    )}/${encodeURIComponent(repoName)}?${queryString}`;

    const items = await this.get<RepoBuild[]>(urlSegment);
    return { items };
  }

  public async getPullRequests(
    projectName: string,
    repoName: string,
    options?: PullRequestOptions,
  ): Promise<{ items: PullRequest[] }> {
    const queryString = new URLSearchParams();
    if (options?.top) {
      queryString.append('top', options.top.toString());
    }
    if (options?.status) {
      queryString.append('status', options.status.toString());
    }
    const urlSegment = `pull-requests/${encodeURIComponent(
      projectName,
    )}/${encodeURIComponent(repoName)}?${queryString}`;

    const items = await this.get<PullRequest[]>(urlSegment);
    return { items };
  }

  public getDashboardPullRequests(
    projectName: string,
  ): Promise<DashboardPullRequest[]> {
    return this.get<DashboardPullRequest[]>(
      `dashboard-pull-requests/${projectName}?top=100`,
    );
  }

  public getAllTeams(): Promise<Team[]> {
    return this.get<Team[]>('all-teams');
  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('azure-devops')}/`;
    const url = new URL(path, baseUrl);

    const idToken = await this.identityApi.getIdToken();
    const response = await fetch(url.toString(), {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }
}
