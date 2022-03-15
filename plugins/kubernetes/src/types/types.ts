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

import type { JsonObject } from '@backstage/types';
import {
  V1Deployment,
  V1Pod,
  V1ReplicaSet,
  V1HorizontalPodAutoscaler,
  V1Service,
  V1ConfigMap,
  V1Ingress,
  V1Job,
  V1CronJob,
} from '@kubernetes/client-node';

export interface DeploymentResources {
  pods: V1Pod[];
  replicaSets: V1ReplicaSet[];
  deployments: V1Deployment[];
  horizontalPodAutoscalers: V1HorizontalPodAutoscaler[];
}

export interface GroupedResponses extends DeploymentResources {
  services: V1Service[];
  configMaps: V1ConfigMap[];
  ingresses: V1Ingress[];
  jobs: V1Job[];
  cronJobs: V1CronJob[];
  customResources: any[];
}

export interface ClusterLinksFormatterOptions {
  dashboardUrl?: URL;
  dashboardParameters?: JsonObject;
  object: any;
  kind: string;
}

export type ClusterLinksFormatter = (
  options: ClusterLinksFormatterOptions,
) => URL;
