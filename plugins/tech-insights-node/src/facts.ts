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

import { DateTime, DurationLike } from 'luxon';
import { Config } from '@backstage/config';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Logger } from 'winston';

/**
 * A container for facts. The shape of the fact records needs to correspond to the FactSchema with same `ref` value.
 * Each container contains a reference to an entity which can be a Backstage entity or a generic construct
 * outside of backstage with same shape.
 *
 * Container may contain multiple individual facts and their values
 *
 * @public
 */
export type TechInsightFact = {
  /**
   * Entity reference that this fact relates to
   */
  entity: {
    namespace: string;
    kind: string;
    name: string;
  };

  /**
   * A collection of fact values as key value pairs.
   *
   * Key indicates fact name as it is defined in FactSchema
   */
  facts: Record<
    string,
    | number
    | string
    | boolean
    | DateTime
    | number[]
    | string[]
    | boolean[]
    | DateTime[]
  >;

  /**
   * Optional timestamp value which can be used to override retrieval time of the fact row.
   * Otherwise when stored into data storage, defaults to current time
   */
  timestamp?: DateTime;
};

/**
 * Response type used when returning from database and API.
 * Adds a field for ref for easier usage
 *
 * @public
 */
export type FlatTechInsightFact = TechInsightFact & {
  /**
   * Reference and unique identifier of the fact row
   */
  id: string;
};

/**
 * A record type to specify individual fact shapes
 *
 * Used as part of a schema to validate, identify and generically construct usage implementations
 * of individual fact values in the system.
 *
 * @public
 */
export type FactSchema = {
  /**
   * Name of the fact
   */
  [name: string]: {
    /**
     * Type of the individual fact value
     *
     * Numbers are split into integers and floating point values.
     * `set` indicates a collection of values
     */
    type: 'integer' | 'float' | 'string' | 'boolean' | 'datetime' | 'set';

    /**
     * A description of this individual fact value
     */
    description: string;

    /**
     * Optional semver string to indicate when this specific fact definition was added to the schema
     */
    since?: string;

    /**
     * Metadata related to an individual fact.
     * Can contain links, additional description texts and other actionable data.
     *
     * Currently loosely typed, but in the future when patterns emerge, key shapes can be defined
     *
     * examples:
     * ```
     * \{
     *   link: 'https://sonarqube.mycompany.com/fix-these-issues',
     *   suggestion: 'To affect this value, you can do x, y, z',
     *   minValue: 0
     * \}
     * ```
     */
    metadata?: Record<string, any>;
  };
};

/**
 * @public
 *
 * FactRetrieverContext injected into individual handler methods of FactRetriever implementations.
 * The context can be used to construct logic to retrieve entities, contact integration points
 * and fetch and calculate fact values from external sources.
 */
export type FactRetrieverContext = {
  config: Config;
  discovery: PluginEndpointDiscovery;
  logger: Logger;
  entityFilter?:
    | Record<string, string | symbol | (string | symbol)[]>[]
    | Record<string, string | symbol | (string | symbol)[]>;
};

/**
 * FactRetriever interface
 *
 * @public
 */
export interface FactRetriever {
  /**
   * A unique identifier of the retriever.
   * Used to identify and store individual facts returned from this retriever
   * and schemas defined by this retriever.
   */
  id: string;

  /**
   * Semver string indicating the version of this fact retriever
   * This version is used to determine if the schema this fact retriever matches the data this fact retriever provides.
   *
   * Should be incremented on changes to returned data from the handler or if the schema changes.
   */
  version: string;

  /**
   * Handler function that needs to be implemented to retrieve fact values for entities.
   *
   * @param ctx - FactRetrieverContext which can be used to retrieve config and contact integrations
   * @returns - A collection of TechInsightFacts grouped by entities.
   */
  handler: (ctx: FactRetrieverContext) => Promise<TechInsightFact[]>;

  /**
   * A fact schema defining the shape of data returned from the handler method for each entity
   */
  schema: FactSchema;

  /**
   * An optional object/array of objects of entity filters to indicate if this fact retriever is valid for an entity type.
   * If omitted, the retriever should apply to all entities.
   *
   * Should be defined for example:
   *   \{ field: 'kind', values: \['component'\] \}
   *   \{ field: 'metadata.name', values: \['component-1', 'component-2'\] \}
   */
  entityFilter?:
    | Record<string, string | symbol | (string | symbol)[]>[]
    | Record<string, string | symbol | (string | symbol)[]>;
}

/**
 * A Luxon duration like object for time to live value
 *
 * @public
 * @example
 * \{ timeToLive: 1209600000 \}
 * \{ timeToLive: \{ weeks: 4 \} \}
 *
 **/
export type TTL = { timeToLive: DurationLike };

/**
 * A maximum number for items to be kept in the database for each fact retriever/entity pair
 *
 * @public
 * @example
 * \{ maxItems: 10 \}
 *
 **/
export type MaxItems = { maxItems: number };

/**
 * A fact lifecycle definition. Determines which strategy to use to purge expired facts from the database.
 *
 * @public
 */
export type FactLifecycle = TTL | MaxItems;

/**
 * A flat serializable structure for Facts.
 * Containing information about fact schema, version, id, and entity filters
 *
 * @public
 */
export type FactSchemaDefinition = Omit<FactRetriever, 'handler'>;

/**
 * Registration of a fact retriever
 * Used to add and schedule individual fact retrievers to the fact retriever engine.
 *
 * @public
 */
export type FactRetrieverRegistration = {
  /**
   * Actual FactRetriever implementation
   */
  factRetriever: FactRetriever;

  /**
   * Cron expression to indicate when the retriever should be triggered.
   * Defaults to a random point in time every 24h
   *
   */
  cadence?: string;

  /**
   * Fact lifecycle definition
   *
   * If defined this value will be used to determine expired items which will deleted when this fact retriever is run
   */
  lifecycle?: FactLifecycle;
};
