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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { assertError, serializeError } from '@backstage/errors';
import { Hash } from 'crypto';
import stableStringify from 'fast-json-stable-stringify';
import { Logger } from 'winston';
import { ProcessingDatabase, RefreshStateItem } from '../database/types';
import { createCounterMetric, createSummaryMetric } from '../util/metrics';
import {
  CatalogProcessingEngine,
  CatalogProcessingOrchestrator,
  EntityProcessingResult,
} from '../processing/types';
import { Stitcher } from '../stitching/Stitcher';
import { startTaskPipeline } from './TaskPipeline';

const CACHE_TTL = 5;

export class DefaultCatalogProcessingEngine implements CatalogProcessingEngine {
  private readonly tracker = progressTracker();
  private stopFunc?: () => void;

  constructor(
    private readonly logger: Logger,
    private readonly processingDatabase: ProcessingDatabase,
    private readonly orchestrator: CatalogProcessingOrchestrator,
    private readonly stitcher: Stitcher,
    private readonly createHash: () => Hash,
    private readonly pollingIntervalMs: number = 1000,
  ) {}

  async start() {
    if (this.stopFunc) {
      throw new Error('Processing engine is already started');
    }

    this.stopFunc = startTaskPipeline<RefreshStateItem>({
      lowWatermark: 5,
      highWatermark: 10,
      pollingIntervalMs: this.pollingIntervalMs,
      loadTasks: async count => {
        try {
          const { items } = await this.processingDatabase.transaction(
            async tx => {
              return this.processingDatabase.getProcessableEntities(tx, {
                processBatchSize: count,
              });
            },
          );
          return items;
        } catch (error) {
          this.logger.warn('Failed to load processing items', error);
          return [];
        }
      },
      processTask: async item => {
        const track = this.tracker.processStart(item, this.logger);

        try {
          const {
            id,
            state,
            unprocessedEntity,
            entityRef,
            locationKey,
            resultHash: previousResultHash,
          } = item;
          const result = await this.orchestrator.process({
            entity: unprocessedEntity,
            state,
          });

          track.markProcessorsCompleted(result);

          if (result.ok) {
            if (stableStringify(state) !== stableStringify(result.state)) {
              await this.processingDatabase.transaction(async tx => {
                await this.processingDatabase.updateEntityCache(tx, {
                  id,
                  state: {
                    ttl: CACHE_TTL,
                    ...result.state,
                  },
                });
              });
            }
          } else {
            const maybeTtl = state?.ttl;
            const ttl = Number.isInteger(maybeTtl) ? (maybeTtl as number) : 0;
            await this.processingDatabase.transaction(async tx => {
              await this.processingDatabase.updateEntityCache(tx, {
                id,
                state: ttl > 0 ? { ...state, ttl: ttl - 1 } : {},
              });
            });
          }

          for (const error of result.errors) {
            // TODO(freben): Try to extract the location out of the unprocessed
            // entity and add as meta to the log lines
            this.logger.warn(error.message, {
              entity: entityRef,
            });
          }
          const errorsString = JSON.stringify(
            result.errors.map(e => serializeError(e)),
          );

          let hashBuilder = this.createHash().update(errorsString);
          if (result.ok) {
            const { entityRefs: parents } =
              await this.processingDatabase.transaction(tx =>
                this.processingDatabase.listParents(tx, {
                  entityRef,
                }),
              );

            hashBuilder = hashBuilder
              .update(stableStringify({ ...result.completedEntity }))
              .update(stableStringify([...result.deferredEntities]))
              .update(stableStringify([...result.relations]))
              .update(stableStringify([...parents]));
          }

          const resultHash = hashBuilder.digest('hex');
          if (resultHash === previousResultHash) {
            // If nothing changed in our produced outputs, we cannot have any
            // significant effect on our surroundings; therefore, we just abort
            // without any updates / stitching.
            track.markSuccessfulWithNoChanges();
            return;
          }

          // If the result was marked as not OK, it signals that some part of the
          // processing pipeline threw an exception. This can happen both as part of
          // non-catastrophic things such as due to validation errors, as well as if
          // something fatal happens inside the processing for other reasons. In any
          // case, this means we can't trust that anything in the output is okay. So
          // just store the errors and trigger a stich so that they become visible to
          // the outside.
          if (!result.ok) {
            await this.processingDatabase.transaction(async tx => {
              await this.processingDatabase.updateProcessedEntityErrors(tx, {
                id,
                errors: errorsString,
                resultHash,
              });
            });
            await this.stitcher.stitch(
              new Set([stringifyEntityRef(unprocessedEntity)]),
            );
            track.markSuccessfulWithErrors();
            return;
          }

          result.completedEntity.metadata.uid = id;
          await this.processingDatabase.transaction(async tx => {
            await this.processingDatabase.updateProcessedEntity(tx, {
              id,
              processedEntity: result.completedEntity,
              resultHash,
              errors: errorsString,
              relations: result.relations,
              deferredEntities: result.deferredEntities,
              locationKey,
            });
          });

          const setOfThingsToStitch = new Set<string>([
            stringifyEntityRef(result.completedEntity),
            ...result.relations.map(relation =>
              stringifyEntityRef(relation.source),
            ),
          ]);
          await this.stitcher.stitch(setOfThingsToStitch);

          track.markSuccessfulWithChanges(setOfThingsToStitch.size);
        } catch (error) {
          assertError(error);
          track.markFailed(error);
        }
      },
    });
  }

  async stop() {
    if (this.stopFunc) {
      this.stopFunc();
      this.stopFunc = undefined;
    }
  }
}

// Helps wrap the timing and logging behaviors
function progressTracker() {
  const stitchedEntities = createCounterMetric({
    name: 'catalog_stitched_entities_count',
    help: 'Amount of entities stitched',
  });
  const processedEntities = createCounterMetric({
    name: 'catalog_processed_entities_count',
    help: 'Amount of entities processed',
    labelNames: ['result'],
  });
  const processingDuration = createSummaryMetric({
    name: 'catalog_processing_duration_seconds',
    help: 'Time spent executing the full processing flow',
    labelNames: ['result'],
  });
  const processorsDuration = createSummaryMetric({
    name: 'catalog_processors_duration_seconds',
    help: 'Time spent executing catalog processors',
    labelNames: ['result'],
  });
  const processingQueueDelay = createSummaryMetric({
    name: 'catalog_processing_queue_delay_seconds',
    help: 'The amount of delay between being scheduled for processing, and the start of actually being processed',
  });

  function processStart(item: RefreshStateItem, logger: Logger) {
    logger.debug(`Processing ${item.entityRef}`);

    if (item.nextUpdateAt) {
      processingQueueDelay.observe(-item.nextUpdateAt.diffNow().as('seconds'));
    }

    const endOverallTimer = processingDuration.startTimer();
    const endProcessorsTimer = processorsDuration.startTimer();

    function markProcessorsCompleted(result: EntityProcessingResult) {
      endProcessorsTimer({ result: result.ok ? 'ok' : 'failed' });
    }

    function markSuccessfulWithNoChanges() {
      endOverallTimer({ result: 'unchanged' });
      processedEntities.inc({ result: 'unchanged' }, 1);
    }

    function markSuccessfulWithErrors() {
      endOverallTimer({ result: 'errors' });
      processedEntities.inc({ result: 'errors' }, 1);
    }

    function markSuccessfulWithChanges(stitchedCount: number) {
      endOverallTimer({ result: 'changed' });
      stitchedEntities.inc(stitchedCount);
      processedEntities.inc({ result: 'changed' }, 1);
    }

    function markFailed(error: Error) {
      processedEntities.inc({ result: 'failed' }, 1);
      logger.warn(`Processing of ${item.entityRef} failed`, error);
    }

    return {
      markProcessorsCompleted,
      markSuccessfulWithNoChanges,
      markSuccessfulWithErrors,
      markSuccessfulWithChanges,
      markFailed,
    };
  }

  return { processStart };
}
