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

import {
  CoreV1Api,
  KubeConfig,
  Metrics,
  CustomObjectsApi,
} from '@kubernetes/client-node';
import { ClusterDetails } from '../types/types';

export class KubernetesClientProvider {
  // visible for testing
  getKubeConfig(clusterDetails: ClusterDetails) {
    const cluster = {
      name: clusterDetails.name,
      server: clusterDetails.url,
      skipTLSVerify: clusterDetails.skipTLSVerify,
      caData: clusterDetails.caData,
    };

    // TODO configure
    const user = {
      name: 'backstage',
      token: clusterDetails.serviceAccountToken,
    };

    const context = {
      name: `${clusterDetails.name}`,
      user: user.name,
      cluster: cluster.name,
    };

    const kc = new KubeConfig();
    if (clusterDetails.serviceAccountToken) {
      kc.loadFromOptions({
        clusters: [cluster],
        users: [user],
        contexts: [context],
        currentContext: context.name,
      });
    } else {
      kc.loadFromDefault();
    }

    return kc;
  }

  getCoreClientByClusterDetails(clusterDetails: ClusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);

    return kc.makeApiClient(CoreV1Api);
  }

  getMetricsClient(clusterDetails: ClusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);

    return new Metrics(kc);
  }

  getCustomObjectsClient(clusterDetails: ClusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);

    return kc.makeApiClient(CustomObjectsApi);
  }
}
