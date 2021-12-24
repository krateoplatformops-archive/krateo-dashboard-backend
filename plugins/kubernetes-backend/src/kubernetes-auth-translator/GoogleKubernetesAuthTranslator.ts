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

import { KubernetesAuthTranslator } from './types';
import { GKEClusterDetails } from '../types/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';

export class GoogleKubernetesAuthTranslator
  implements KubernetesAuthTranslator
{
  async decorateClusterDetailsWithAuth(
    clusterDetails: GKEClusterDetails,
    requestBody: KubernetesRequestBody,
  ): Promise<GKEClusterDetails> {
    const clusterDetailsWithAuthToken: GKEClusterDetails = Object.assign(
      {},
      clusterDetails,
    );
    const authToken: string | undefined = requestBody.auth?.google;

    if (authToken) {
      clusterDetailsWithAuthToken.serviceAccountToken = authToken;
    } else {
      throw new Error(
        'Google token not found under auth.google in request body',
      );
    }
    return clusterDetailsWithAuthToken;
  }
}
