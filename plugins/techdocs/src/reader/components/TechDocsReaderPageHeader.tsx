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

import React, { PropsWithChildren } from 'react';
import CodeIcon from '@material-ui/icons/Code';

import { useRouteRef } from '@backstage/core-plugin-api';
import { Header, HeaderLabel } from '@backstage/core-components';
import { CompoundEntityRef, RELATION_OWNED_BY } from '@backstage/catalog-model';
import {
  EntityRefLink,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';

import { rootRouteRef } from '../../routes';
import { TechDocsEntityMetadata, TechDocsMetadata } from '../../types';

/**
 * Props for {@link TechDocsReaderPageHeader}
 *
 * @public
 */
export type TechDocsReaderPageHeaderProps = PropsWithChildren<{
  entityRef: CompoundEntityRef;
  entityMetadata?: TechDocsEntityMetadata;
  techDocsMetadata?: TechDocsMetadata;
}>;

/**
 * Component responsible for rendering a Header with metadata on TechDocs reader page.
 *
 * @public
 */
export const TechDocsReaderPageHeader = (
  props: TechDocsReaderPageHeaderProps,
) => {
  const { entityRef, entityMetadata, techDocsMetadata, children } = props;
  const { name } = entityRef;

  const { site_name: siteName, site_description: siteDescription } =
    techDocsMetadata || {};

  const { locationMetadata, spec } = entityMetadata || {};
  const lifecycle = spec?.lifecycle;

  const ownedByRelations = entityMetadata
    ? getEntityRelations(entityMetadata, RELATION_OWNED_BY)
    : [];

  const docsRootLink = useRouteRef(rootRouteRef)();

  const labels = (
    <>
      <HeaderLabel
        label="Component"
        value={
          <EntityRefLink
            color="inherit"
            entityRef={entityRef}
            defaultKind="Component"
          />
        }
      />
      {ownedByRelations.length > 0 && (
        <HeaderLabel
          label="Owner"
          value={
            <EntityRefLinks
              color="inherit"
              entityRefs={ownedByRelations}
              defaultKind="group"
            />
          }
        />
      )}
      {lifecycle ? <HeaderLabel label="Lifecycle" value={lifecycle} /> : null}
      {locationMetadata &&
      locationMetadata.type !== 'dir' &&
      locationMetadata.type !== 'file' ? (
        <HeaderLabel
          label=""
          value={
            <a
              href={locationMetadata.target}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CodeIcon style={{ marginTop: '-25px', fill: '#fff' }} />
            </a>
          }
        />
      ) : null}
    </>
  );

  return (
    <Header
      title={siteName ? siteName : '.'}
      pageTitleOverride={siteName || name}
      subtitle={
        siteDescription && siteDescription !== 'None' ? siteDescription : ''
      }
      type="Docs"
      typeLink={docsRootLink}
    >
      {labels}
      {children}
    </Header>
  );
};

/**
 * @public
 * @deprecated use {@link TechDocsReaderPageHeader} instead
 */
export const TechDocsPageHeader = TechDocsReaderPageHeader;

/**
 * @public
 * @deprecated use {@link TechDocsReaderPageHeader} instead
 */

export type TechDocsPageHeaderProps = TechDocsReaderPageHeaderProps;
