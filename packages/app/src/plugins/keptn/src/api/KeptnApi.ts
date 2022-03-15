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

// import { MetricKey, SonarUrlProcessorFunc } from './types';
import { createApiRef } from '@backstage/core-plugin-api';

export const keptnApiRef = createApiRef<KeptnApi>({
  id: 'plugin.keptn.service',
  description: 'Used by the Keptn plugin to make requests',
});

export type KeptnApi = {
  getMetadata(componentKey?: string): Promise<any | undefined>;
  getProject(componentKey?: string): Promise<any | undefined>;
  getSequence(componentKey?: string): Promise<any | undefined>;
  getEvent(componentKey?: any): Promise<any | undefined>;
  postEvent(componentKey?: any): Promise<any | undefined>;
};
