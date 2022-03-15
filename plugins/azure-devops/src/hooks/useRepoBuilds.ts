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
  RepoBuild,
  RepoBuildOptions,
} from '@backstage/plugin-azure-devops-common';

import { AZURE_DEVOPS_DEFAULT_TOP } from '../constants';
import { Entity } from '@backstage/catalog-model';
import { azureDevOpsApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { useProjectRepoFromEntity } from './useProjectRepoFromEntity';

export function useRepoBuilds(
  entity: Entity,
  defaultLimit?: number,
): {
  items?: RepoBuild[];
  loading: boolean;
  error?: Error;
} {
  const top = defaultLimit ?? AZURE_DEVOPS_DEFAULT_TOP;
  const options: RepoBuildOptions = {
    top: top,
  };

  const api = useApi(azureDevOpsApiRef);
  const { project, repo } = useProjectRepoFromEntity(entity);

  const { value, loading, error } = useAsync(() => {
    return api.getRepoBuilds(project, repo, options);
  }, [api, project, repo, entity]);

  return {
    items: value?.items,
    loading,
    error,
  };
}
