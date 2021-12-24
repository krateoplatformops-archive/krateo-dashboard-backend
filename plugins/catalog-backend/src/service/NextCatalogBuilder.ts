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

import { PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import {
  DefaultNamespaceEntityPolicy,
  EntityPolicies,
  EntityPolicy,
  FieldFormatEntityPolicy,
  makeValidator,
  NoForeignRootFieldsEntityPolicy,
  SchemaValidEntityPolicy,
  Validators,
} from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import { createHash } from 'crypto';
import { Router } from 'express';
import lodash from 'lodash';
import { EntitiesCatalog } from '../catalog';
import {
  DatabaseLocationsCatalog,
  LocationsCatalog,
  CommonDatabase,
} from '../legacy';

import {
  AnnotateLocationEntityProcessor,
  BitbucketDiscoveryProcessor,
  BuiltinKindsEntityProcessor,
  CatalogProcessor,
  CatalogProcessorParser,
  CodeOwnersProcessor,
  FileReaderProcessor,
  AzureDevOpsDiscoveryProcessor,
  GithubDiscoveryProcessor,
  GithubOrgReaderProcessor,
  GitLabDiscoveryProcessor,
  PlaceholderProcessor,
  PlaceholderResolver,
  UrlReaderProcessor,
} from '../ingestion';
import { RepoLocationAnalyzer } from '../ingestion/LocationAnalyzer';
import {
  jsonPlaceholderResolver,
  textPlaceholderResolver,
  yamlPlaceholderResolver,
} from '../ingestion/processors/PlaceholderProcessor';
import { defaultEntityDataParser } from '../ingestion/processors/util/parse';
import { LocationAnalyzer } from '../ingestion/types';
import { EntityProvider } from '../providers/types';
import { CatalogProcessingEngine } from '../processing/types';
import { ConfigLocationEntityProvider } from '../providers/ConfigLocationEntityProvider';
import { DefaultProcessingDatabase } from '../database/DefaultProcessingDatabase';
import { applyDatabaseMigrations } from '../database/migrations';
import { DefaultCatalogProcessingEngine } from '../processing/DefaultCatalogProcessingEngine';
import { DefaultLocationService } from './DefaultLocationService';
import { DefaultLocationStore } from '../providers/DefaultLocationStore';
import { NextEntitiesCatalog } from './NextEntitiesCatalog';
import { DefaultCatalogProcessingOrchestrator } from '../processing/DefaultCatalogProcessingOrchestrator';
import { Stitcher } from '../stitching/Stitcher';
import {
  createRandomRefreshInterval,
  RefreshIntervalFunction,
} from '../processing/refresh';
import { createNextRouter } from './NextRouter';
import { DefaultRefreshService } from './DefaultRefreshService';
import { DefaultCatalogRulesEnforcer } from '../ingestion/CatalogRules';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { LocationService } from './types';
import { connectEntityProviders } from '../processing/connectEntityProviders';

export type CatalogEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
  reader: UrlReader;
};

/**
 * A builder that helps wire up all of the component parts of the catalog.
 *
 * The touch points where you can replace or extend behavior are as follows:
 *
 * - Entity policies can be added or replaced. These are automatically run
 *   after the processors' pre-processing steps. All policies are given the
 *   chance to inspect the entity, and all of them have to pass in order for
 *   the entity to be considered valid from an overall point of view.
 * - Placeholder resolvers can be replaced or added. These run on the raw
 *   structured data between the parsing and pre-processing steps, to replace
 *   dollar-prefixed entries with their actual values (like $file).
 * - Field format validators can be replaced. These check the format of
 *   individual core fields such as metadata.name, to ensure that they adhere
 *   to certain rules.
 * - Processors can be added or replaced. These implement the functionality of
 *   reading, parsing, validating, and processing the entity data before it is
 *   persisted in the catalog.
 */
export class NextCatalogBuilder {
  private readonly env: CatalogEnvironment;
  private entityPolicies: EntityPolicy[];
  private entityPoliciesReplace: boolean;
  private placeholderResolvers: Record<string, PlaceholderResolver>;
  private fieldFormatValidators: Partial<Validators>;
  private entityProviders: EntityProvider[];
  private processors: CatalogProcessor[];
  private processorsReplace: boolean;
  private parser: CatalogProcessorParser | undefined;
  private refreshInterval: RefreshIntervalFunction =
    createRandomRefreshInterval({
      minSeconds: 100,
      maxSeconds: 150,
    });
  private locationAnalyzer: LocationAnalyzer | undefined = undefined;

  constructor(env: CatalogEnvironment) {
    this.env = env;
    this.entityPolicies = [];
    this.entityPoliciesReplace = false;
    this.placeholderResolvers = {};
    this.fieldFormatValidators = {};
    this.entityProviders = [];
    this.processors = [];
    this.processorsReplace = false;
    this.parser = undefined;
  }

  /**
   * Adds policies that are used to validate entities between the pre-
   * processing and post-processing stages. All such policies must pass for the
   * entity to be considered valid.
   *
   * If what you want to do is to replace the rules for what format is allowed
   * in various core entity fields (such as metadata.name), you may want to use
   * {@link NextCatalogBuilder#setFieldFormatValidators} instead.
   *
   * @param policies One or more policies
   */
  addEntityPolicy(...policies: EntityPolicy[]): NextCatalogBuilder {
    this.entityPolicies.push(...policies);
    return this;
  }

  /**
   * Refresh interval determines how often entities should be refreshed.
   * Seconds provided will be multiplied by 1.5
   * The default refresh duration is 100-150 seconds.
   * setting this too low will potentially deplete request quotas to upstream services.
   */
  setRefreshIntervalSeconds(seconds: number): NextCatalogBuilder {
    this.refreshInterval = createRandomRefreshInterval({
      minSeconds: seconds,
      maxSeconds: seconds * 1.5,
    });
    return this;
  }

  /**
   * Overwrites the default refresh interval function used to spread
   * entity updates in the catalog.
   */
  setRefreshInterval(
    refreshInterval: RefreshIntervalFunction,
  ): NextCatalogBuilder {
    this.refreshInterval = refreshInterval;
    return this;
  }

  /**
   * Overwrites the default location analyzer.
   */
  setLocationAnalyzer(locationAnalyzer: LocationAnalyzer): NextCatalogBuilder {
    this.locationAnalyzer = locationAnalyzer;
    return this;
  }

  /**
   * Sets what policies to use for validation of entities between the pre-
   * processing and post-processing stages. All such policies must pass for the
   * entity to be considered valid.
   *
   * If what you want to do is to replace the rules for what format is allowed
   * in various core entity fields (such as metadata.name), you may want to use
   * {@link NextCatalogBuilder#setFieldFormatValidators} instead.
   *
   * This function replaces the default set of policies; use with care.
   *
   * @param policies One or more policies
   */
  replaceEntityPolicies(policies: EntityPolicy[]): NextCatalogBuilder {
    this.entityPolicies = [...policies];
    this.entityPoliciesReplace = true;
    return this;
  }

  /**
   * Adds, or overwrites, a handler for placeholders (e.g. $file) in entity
   * definition files.
   *
   * @param key The key that identifies the placeholder, e.g. "file"
   * @param resolver The resolver that gets values for this placeholder
   */
  setPlaceholderResolver(
    key: string,
    resolver: PlaceholderResolver,
  ): NextCatalogBuilder {
    this.placeholderResolvers[key] = resolver;
    return this;
  }

  /**
   * Sets the validator function to use for one or more special fields of an
   * entity. This is useful if the default rules for formatting of fields are
   * not sufficient.
   *
   * This function has no effect if used together with
   * {@link NextCatalogBuilder#replaceEntityPolicies}.
   *
   * @param validators The (subset of) validators to set
   */
  setFieldFormatValidators(
    validators: Partial<Validators>,
  ): NextCatalogBuilder {
    lodash.merge(this.fieldFormatValidators, validators);
    return this;
  }

  /**
   * Adds or replaces entity providers. These are responsible for bootstrapping
   * the list of entities out of original data sources. For example, there is
   * one entity source for the config locations, and one for the database
   * stored locations. If you ingest entities out of a third party system, you
   * may want to implement that in terms of an entity provider as well.
   *
   * @param providers One or more entity providers
   */
  addEntityProvider(...providers: EntityProvider[]): NextCatalogBuilder {
    this.entityProviders.push(...providers);
    return this;
  }

  /**
   * Adds entity processors. These are responsible for reading, parsing, and
   * processing entities before they are persisted in the catalog.
   *
   * @param processors One or more processors
   */
  addProcessor(...processors: CatalogProcessor[]): NextCatalogBuilder {
    this.processors.push(...processors);
    return this;
  }

  /**
   * Sets what entity processors to use. These are responsible for reading,
   * parsing, and processing entities before they are persisted in the catalog.
   *
   * This function replaces the default set of processors, consider using with
   * {@link NextCatalogBuilder#getDefaultProcessors}; use with care.
   *
   * @param processors One or more processors
   */
  replaceProcessors(processors: CatalogProcessor[]): NextCatalogBuilder {
    this.processors = [...processors];
    this.processorsReplace = true;
    return this;
  }

  /**
   * Returns the default list of entity processors. These are responsible for reading,
   * parsing, and processing entities before they are persisted in the catalog. Changing
   * the order of processing can give more control to custom processors.
   *
   * Consider using with {@link NextCatalogBuilder#replaceProcessors}
   *
   */
  getDefaultProcessors(): CatalogProcessor[] {
    const { config, logger, reader } = this.env;
    const integrations = ScmIntegrations.fromConfig(config);

    return [
      new FileReaderProcessor(),
      BitbucketDiscoveryProcessor.fromConfig(config, { logger }),
      AzureDevOpsDiscoveryProcessor.fromConfig(config, { logger }),
      GithubDiscoveryProcessor.fromConfig(config, { logger }),
      GithubOrgReaderProcessor.fromConfig(config, { logger }),
      GitLabDiscoveryProcessor.fromConfig(config, { logger }),
      new UrlReaderProcessor({ reader, logger }),
      CodeOwnersProcessor.fromConfig(config, { logger, reader }),
      new AnnotateLocationEntityProcessor({ integrations }),
    ];
  }

  /**
   * Sets up the catalog to use a custom parser for entity data.
   *
   * This is the function that gets called immediately after some raw entity
   * specification data has been read from a remote source, and needs to be
   * parsed and emitted as structured data.
   *
   * @param parser The custom parser
   */
  setEntityDataParser(parser: CatalogProcessorParser): NextCatalogBuilder {
    this.parser = parser;
    return this;
  }

  /**
   * Wires up and returns all of the component parts of the catalog
   */
  async build(): Promise<{
    entitiesCatalog: EntitiesCatalog;
    /** @deprecated This will be removed */
    locationsCatalog: LocationsCatalog;
    locationAnalyzer: LocationAnalyzer;
    processingEngine: CatalogProcessingEngine;
    locationService: LocationService;
    router: Router;
  }> {
    const { config, database, logger } = this.env;

    const policy = this.buildEntityPolicy();
    const processors = this.buildProcessors();
    const parser = this.parser || defaultEntityDataParser;

    const dbClient = await database.getClient();
    if (!database.migrations?.skip) {
      logger.info('Performing database migration');
      await applyDatabaseMigrations(dbClient);
    }

    const db = new CommonDatabase(dbClient, logger);

    const processingDatabase = new DefaultProcessingDatabase({
      database: dbClient,
      logger,
      refreshInterval: this.refreshInterval,
    });
    const integrations = ScmIntegrations.fromConfig(config);
    const rulesEnforcer = DefaultCatalogRulesEnforcer.fromConfig(config);
    const orchestrator = new DefaultCatalogProcessingOrchestrator({
      processors,
      integrations,
      rulesEnforcer,
      logger,
      parser,
      policy,
    });
    const entitiesCatalog = new NextEntitiesCatalog(dbClient);
    const stitcher = new Stitcher(dbClient, logger);

    const locationStore = new DefaultLocationStore(dbClient);
    const configLocationProvider = new ConfigLocationEntityProvider(config);
    const entityProviders = lodash.uniqBy(
      [...this.entityProviders, locationStore, configLocationProvider],
      provider => provider.getProviderName(),
    );

    const processingEngine = new DefaultCatalogProcessingEngine(
      logger,
      processingDatabase,
      orchestrator,
      stitcher,
      () => createHash('sha1'),
    );

    const locationsCatalog = new DatabaseLocationsCatalog(db);
    const locationAnalyzer =
      this.locationAnalyzer ?? new RepoLocationAnalyzer(logger, integrations);
    const locationService = new DefaultLocationService(
      locationStore,
      orchestrator,
    );
    const refreshService = new DefaultRefreshService({
      database: processingDatabase,
    });
    const router = await createNextRouter({
      entitiesCatalog,
      locationAnalyzer,
      locationService,
      refreshService,
      logger,
      config,
    });

    await connectEntityProviders(processingDatabase, entityProviders);

    return {
      entitiesCatalog,
      locationsCatalog,
      locationAnalyzer,
      processingEngine,
      locationService,
      router,
    };
  }

  private buildEntityPolicy(): EntityPolicy {
    const entityPolicies: EntityPolicy[] = this.entityPoliciesReplace
      ? [new SchemaValidEntityPolicy(), ...this.entityPolicies]
      : [
          new SchemaValidEntityPolicy(),
          new DefaultNamespaceEntityPolicy(),
          new NoForeignRootFieldsEntityPolicy(),
          new FieldFormatEntityPolicy(
            makeValidator(this.fieldFormatValidators),
          ),
          ...this.entityPolicies,
        ];

    return EntityPolicies.allOf(entityPolicies);
  }

  private buildProcessors(): CatalogProcessor[] {
    const { config, reader } = this.env;
    const integrations = ScmIntegrations.fromConfig(config);

    this.checkDeprecatedReaderProcessors();

    const placeholderResolvers: Record<string, PlaceholderResolver> = {
      json: jsonPlaceholderResolver,
      yaml: yamlPlaceholderResolver,
      text: textPlaceholderResolver,
      ...this.placeholderResolvers,
    };

    // These are always there no matter what
    const processors: CatalogProcessor[] = [
      new PlaceholderProcessor({
        resolvers: placeholderResolvers,
        reader,
        integrations,
      }),
      new BuiltinKindsEntityProcessor(),
    ];

    // These are only added unless the user replaced them all
    if (!this.processorsReplace) {
      processors.push(...this.getDefaultProcessors());
    }

    // Add the ones (if any) that the user added
    processors.push(...this.processors);

    return processors;
  }

  // TODO(Rugvip): These old processors are removed, for a while we'll be throwing
  //               errors here to make sure people know where to move the config
  private checkDeprecatedReaderProcessors() {
    const pc = this.env.config.getOptionalConfig('catalog.processors');
    if (pc?.has('github')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.github, move to using integrations.github instead`,
      );
    }
    if (pc?.has('gitlabApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.gitlabApi, move to using integrations.gitlab instead`,
      );
    }
    if (pc?.has('bitbucketApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.bitbucketApi, move to using integrations.bitbucket instead`,
      );
    }
    if (pc?.has('azureApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.azureApi, move to using integrations.azure instead`,
      );
    }
  }
}
