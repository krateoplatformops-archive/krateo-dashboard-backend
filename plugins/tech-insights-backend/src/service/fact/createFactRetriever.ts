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
  FactRetriever,
  FactRetrieverRegistration,
} from '@backstage/plugin-tech-insights-node';

/**
 * @public
 *
 * A helper function to construct fact retriever registrations.
 *
 * @param cadence - cron expression to indicate when the fact retriever should be triggered
 * @param factRetriever - Implementation of fact retriever consisting of at least id, version, schema and handler
 *
 *
 * @remarks
 *
 * Cron expressions help:
 * ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 *
 */
export function createFactRetrieverRegistration(
  cadence: string,
  factRetriever: FactRetriever,
): FactRetrieverRegistration {
  return {
    cadence,
    factRetriever,
  };
}
