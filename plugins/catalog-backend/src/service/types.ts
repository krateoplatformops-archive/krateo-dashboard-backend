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

import { Entity, LocationSpec, Location } from '@backstage/catalog-model';

export interface LocationService {
  createLocation(
    spec: LocationSpec,
    dryRun: boolean,
  ): Promise<{ location: Location; entities: Entity[]; exists?: boolean }>;
  listLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location>;
  deleteLocation(id: string): Promise<void>;
}

/**
 * Options for requesting a refresh of entities in the catalog.
 *
 * @public
 */
export type RefreshOptions = {
  /** The reference to a single entity that should be refreshed */
  entityRef: string;
};

/**
 * A service that manages refreshes of entities in the catalog.
 *
 * @public
 */
export interface RefreshService {
  /**
   * Request a refresh of entities in the catalog.
   */
  refresh(options: RefreshOptions): Promise<void>;
}

export interface LocationStore {
  createLocation(spec: LocationSpec): Promise<Location>;
  listLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location>;
  deleteLocation(id: string): Promise<void>;
}
