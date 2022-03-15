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
  DocumentCollatorFactory,
  DocumentDecoratorFactory,
  SearchEngine,
} from '@backstage/plugin-search-common';
import { Logger } from 'winston';

/**
 * @beta
 */
export type IndexBuilderOptions = {
  searchEngine: SearchEngine;
  logger: Logger;
};

/**
 * Parameters required to register a collator.
 * @beta
 */
export interface RegisterCollatorParameters {
  /**
   * The default interval (in seconds) that the provided collator will be called (can be overridden in config).
   */
  defaultRefreshIntervalSeconds: number;

  /**
   * The class responsible for returning the document collator of the given type.
   */
  factory: DocumentCollatorFactory;
}

/**
 * Parameters required to register a decorator
 * @beta
 */
export interface RegisterDecoratorParameters {
  /**
   * The class responsible for returning the decorator which appends, modifies, or filters documents.
   */
  factory: DocumentDecoratorFactory;
}
