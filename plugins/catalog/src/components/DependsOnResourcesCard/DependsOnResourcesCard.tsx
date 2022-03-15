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

import { RELATION_DEPENDS_ON } from '@backstage/catalog-model';
import React from 'react';
import {
  asResourceEntities,
  componentEntityHelpLink,
  RelatedEntitiesCard,
  resourceEntityColumns,
} from '../RelatedEntitiesCard';

/** @public */
export interface DependsOnResourcesCardProps {
  variant?: 'gridItem';
}

export function DependsOnResourcesCard(props: DependsOnResourcesCardProps) {
  const { variant = 'gridItem' } = props;
  return (
    <RelatedEntitiesCard
      variant={variant}
      title="Depends on resources"
      entityKind="Resource"
      relationType={RELATION_DEPENDS_ON}
      columns={resourceEntityColumns}
      emptyMessage="No resource is a dependency of this component"
      emptyHelpLink={componentEntityHelpLink}
      asRenderableEntities={asResourceEntities}
    />
  );
}
