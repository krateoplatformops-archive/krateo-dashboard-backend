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

import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { humanizeEntityRef } from './components/EntityRefLink';
import { EntityFilter, UserListFilterKind } from './types';
import { getEntityRelations } from './utils';

/**
 * Filter entities based on Kind.
 * @public
 */
export class EntityKindFilter implements EntityFilter {
  constructor(readonly value: string) {}

  getCatalogFilters(): Record<string, string | string[]> {
    return { kind: this.value };
  }

  toQueryValue(): string {
    return this.value;
  }
}

/**
 * Filters entities based on type
 * @public
 */
export class EntityTypeFilter implements EntityFilter {
  constructor(readonly value: string | string[]) {}

  // Simplify `string | string[]` for consumers, always returns an array
  getTypes(): string[] {
    return Array.isArray(this.value) ? this.value : [this.value];
  }

  getCatalogFilters(): Record<string, string | string[]> {
    return { 'spec.type': this.getTypes() };
  }

  toQueryValue(): string[] {
    return this.getTypes();
  }
}

/**
 * Filters entities based on tag.
 * @public
 */
export class EntityTagFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    return this.values.every(v => (entity.metadata.tags ?? []).includes(v));
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Filters entities where the text matches spec, title or tags.
 * @public
 */
export class EntityTextFilter implements EntityFilter {
  constructor(readonly value: string) {}

  filterEntity(entity: Entity): boolean {
    const upperCaseValue = this.value.toLocaleUpperCase('en-US');

    return (
      entity.metadata.name
        .toLocaleUpperCase('en-US')
        .includes(upperCaseValue) ||
      `${entity.metadata.title}`
        .toLocaleUpperCase('en-US')
        .includes(upperCaseValue) ||
      entity.metadata.tags
        ?.join('')
        .toLocaleUpperCase('en-US')
        .indexOf(upperCaseValue) !== -1
    );
  }
}

/**
 * Filter matching entities that are owned by group.
 * @public
 */
export class EntityOwnerFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    return this.values.some(v =>
      getEntityRelations(entity, RELATION_OWNED_BY).some(
        o => humanizeEntityRef(o, { defaultKind: 'group' }) === v,
      ),
    );
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Filters entities on lifecycle.
 * @public
 */
export class EntityLifecycleFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    return this.values.some(v => entity.spec?.lifecycle === v);
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Filters entities based on whatever the user has starred or owns them.
 * @public
 */
export class UserListFilter implements EntityFilter {
  constructor(
    readonly value: UserListFilterKind,
    readonly isOwnedEntity: (entity: Entity) => boolean,
    readonly isStarredEntity: (entity: Entity) => boolean,
  ) {}

  filterEntity(entity: Entity): boolean {
    switch (this.value) {
      case 'owned':
        return this.isOwnedEntity(entity);
      case 'starred':
        return this.isStarredEntity(entity);
      default:
        return true;
    }
  }

  toQueryValue(): string {
    return this.value;
  }
}
