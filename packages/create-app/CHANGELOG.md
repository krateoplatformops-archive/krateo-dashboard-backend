# @backstage/create-app

## 0.4.23

### Patch Changes

- f9c7bdd899: Builtin support for cookiecutter based templates has been removed from `@backstage/plugin-scaffolder-backend`. Due to this, the `containerRunner` argument to its `createRouter` has also been removed.

  If you do not use cookiecutter templates and are fine with removing support from it in your own installation, update your `packages/backend/src/plugins/scaffolder.ts` file as follows:

  ```diff
  -import { DockerContainerRunner } from '@backstage/backend-common';
   import { CatalogClient } from '@backstage/catalog-client';
   import { createRouter } from '@backstage/plugin-scaffolder-backend';
  -import Docker from 'dockerode';
   import { Router } from 'express';
   import type { PluginEnvironment } from '../types';

   export default async function createPlugin({
     reader,
     discovery,
   }: PluginEnvironment): Promise<Router> {
  -  const dockerClient = new Docker();
  -  const containerRunner = new DockerContainerRunner({ dockerClient });
  -
     const catalogClient = new CatalogClient({ discoveryApi: discovery });
  -
     return await createRouter({
  -    containerRunner,
       logger,
       config,
    // ...
  ```

  If you want to retain cookiecutter support, please use the `@backstage/plugin-scaffolder-backend-module-cookiecutter` package explicitly (see [its README](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-cookiecutter) for installation instructions).

- 8a57b6595b: Removed the `cookiecutter-golang` template from the default `create-app` install as we no longer provide `cookiecutter` action out of the box.

  You can remove the template by removing the following lines from your `app-config.yaml` under `catalog.locations`:

  ```diff
  -    - type: url
  -      target: https://github.com/spotify/cookiecutter-golang/blob/master/template.yaml
  -      rules:
  -        - allow: [Template]
  ```

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 1201383b60: Updated the template to write the Backstage release version to `backstage.json`, rather than the version of `@backstage/create-app`. This change is applied automatically when running `backstage-cli versions:bump` in the latest version of the Backstage CLI.
- c543fe3ff2: Postgres-based search is now installed when PG is chosen as the desired database for Backstage.

  There is no need to make this change in an existing Backstage backend. See [supported search engines](https://backstage.io/docs/features/search/search-engines) for details about production-ready search engines.

- 55150919ed: - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)
- bde30664c4: Updated template to use package roles. To apply this change to an existing app, check out the [migration guide](https://backstage.io/docs/tutorials/package-role-migration).

  Specifically the following scripts in the root `package.json` have also been updated:

  ```diff
  -    "build": "lerna run build",
  +    "build": "backstage-cli repo build --all",

  ...

  -    "lint": "lerna run lint --since origin/master --",
  -    "lint:all": "lerna run lint --",
  +    "lint": "backstage-cli repo lint --since origin/master",
  +    "lint:all": "backstage-cli repo lint",
  ```

## 0.4.23-next.0

### Patch Changes

- f9c7bdd899: Builtin support for cookiecutter based templates has been removed from `@backstage/plugin-scaffolder-backend`. Due to this, the `containerRunner` argument to its `createRouter` has also been removed.

  If you do not use cookiecutter templates and are fine with removing support from it in your own installation, update your `packages/backend/src/plugins/scaffolder.ts` file as follows:

  ```diff
  -import { DockerContainerRunner } from '@backstage/backend-common';
   import { CatalogClient } from '@backstage/catalog-client';
   import { createRouter } from '@backstage/plugin-scaffolder-backend';
  -import Docker from 'dockerode';
   import { Router } from 'express';
   import type { PluginEnvironment } from '../types';

   export default async function createPlugin({
     reader,
     discovery,
   }: PluginEnvironment): Promise<Router> {
  -  const dockerClient = new Docker();
  -  const containerRunner = new DockerContainerRunner({ dockerClient });
  -
     const catalogClient = new CatalogClient({ discoveryApi: discovery });
  -
     return await createRouter({
  -    containerRunner,
       logger,
       config,
    // ...
  ```

  If you want to retain cookiecutter support, please use the `@backstage/plugin-scaffolder-backend-module-cookiecutter` package explicitly (see [its README](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-cookiecutter) for installation instructions).

- 8a57b6595b: Removed the `cookiecutter-golang` template from the default `create-app` install as we no longer provide `cookiecutter` action out of the box.

  You can remove the template by removing the following lines from your `app-config.yaml` under `catalog.locations`:

  ```diff
  -    - type: url
  -      target: https://github.com/spotify/cookiecutter-golang/blob/master/template.yaml
  -      rules:
  -        - allow: [Template]
  ```

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 1201383b60: Updated the template to write the Backstage release version to `backstage.json`, rather than the version of `@backstage/create-app`. This change is applied automatically when running `backstage-cli versions:bump` in the latest version of the Backstage CLI.
- c543fe3ff2: Postgres-based search is now installed when PG is chosen as the desired database for Backstage.

  There is no need to make this change in an existing Backstage backend. See [supported search engines](https://backstage.io/docs/features/search/search-engines) for details about production-ready search engines.

- 55150919ed: - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)
- bde30664c4: Updated template to use package roles. To apply this change to an existing app, check out the [migration guide](https://backstage.io/docs/tutorials/package-role-migration).

  Specifically the following scripts in the root `package.json` have also been updated:

  ```diff
  -    "build": "lerna run build",
  +    "build": "backstage-cli repo build --all",

  ...

  -    "lint": "lerna run lint --since origin/master --",
  -    "lint:all": "lerna run lint --",
  +    "lint": "backstage-cli repo lint --since origin/master",
  +    "lint:all": "backstage-cli repo lint",
  ```

## 0.4.22

### Patch Changes

- ee3d6c6f10: Update the template to reflect the renaming of `DocsResultListItem` to `TechDocsSearchResultListItem` from `@backstage/plugin-techdocs`.

  To apply this change to an existing app, make the following change to `packages/app/src/components/search/SearchPage.tsx`:

  ```diff
  -import { DocsResultListItem } from '@backstage/plugin-techdocs';
  +import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
  ```

  ```diff
     case 'techdocs':
       return (
  -      <DocsResultListItem
  +      <TechDocsSearchResultListItem
           key={document.location}
           result={document}
         />
  ```

  The `TechDocsIndexPage` now uses `DefaultTechDocsHome` as fall back if no children is provided as `LegacyTechDocsHome` is marked as deprecated. If you do not use a custom techdocs homepage, you can therefore update your app to the following:

  ```diff
  -  <Route path="/docs" element={<TechDocsIndexPage />}>
  -    <DefaultTechDocsHome />
  -  </Route>
  +  <Route path="/docs" element={<TechDocsIndexPage />} />
  ```

- 617a132871: Update import location of catalogEntityCreatePermission.

  To apply this change to an existing app, make the following change to `packages/app/src/App.tsx`:

  ```diff
  -import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';
  +import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
  ```

- 022507c860: The Backstage Search Platform's indexing process has been rewritten as a stream
  pipeline in order to improve efficiency and performance on large document sets.

  To take advantage of this, upgrade to the latest version of
  `@backstage/plugin-search-backend-node`, as well as any backend plugins whose
  collators you are using. Then, make the following changes to your
  `/packages/backend/src/plugins/search.ts` file:

  ```diff
  -import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';
  -import { DefaultTechDocsCollator } from '@backstage/plugin-techdocs-backend';
  +import { DefaultCatalogCollatorFactory } from '@backstage/plugin-catalog-backend';
  +import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-techdocs-backend';

  // ...

    const indexBuilder = new IndexBuilder({ logger, searchEngine });

    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
  -    collator: DefaultCatalogCollator.fromConfig(config, { discovery }),
  +    factory: DefaultCatalogCollatorFactory.fromConfig(config, { discovery }),
    });

    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
  -    collator: DefaultTechDocsCollator.fromConfig(config, {
  +    factory: DefaultTechDocsCollatorFactory.fromConfig(config, {
        discovery,
        logger,
      }),
    });
  ```

  If you've written custom collators, decorators, or search engines in your
  Backstage backend instance, you will need to re-implement them as readable,
  transform, and writable streams respectively (including factory classes for
  instantiating them). [A how-to guide for refactoring](https://backstage.io/docs/features/search/how-to-guides#rewriting-alpha-style-collators-for-beta)
  existing implementations is available.

## 0.4.21

### Patch Changes

- a686702dbe: Update the template to reflect the renaming of `CatalogResultListItem` to `CatalogSearchResultListItem` from `@backstage/plugin-catalog`.

  To apply this change to an existing app, make the following change to `packages/app/src/components/search/SearchPage.tsx`:

  ```diff
  -import { CatalogResultListItem } from '@backstage/plugin-catalog';
  +import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
  ```

  ```diff
     case 'software-catalog':
       return (
  -      <CatalogResultListItem
  +      <CatalogSearchResultListItem
           key={document.location}
           result={document}
         />
  ```

- f39c1e6036: To reflect the updated `knex` and `@vscode/sqlite3` dependencies introduced with [v0.4.19](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md#0419), we update our example `Dockerfile`, adding `@vscode/sqlite3` build dependencies to the image. Further on, we updated it to the `node:16-bullseye-slim` base image.

  To apply this update to an existing app, make the following change to `packages/backend/Dockerfile`:

  ```diff
  -FROM node:14-buster-slim
  +FROM node:16-bullseye-slim
  ```

  and, _only if you are using sqlite3 in your app_:

  ```diff
  RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz
  +
  +# install sqlite3 dependencies
  +RUN apt-get update && \
  +   apt-get install -y libsqlite3-dev python3 cmake g++ && \
  +   rm -rf /var/lib/apt/lists/* && \
  +   yarn config set python /usr/bin/python3

  RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"
  ```

  If you are using a multi-stage Docker build for your app, please refer to the [updated examples](https://github.com/backstage/backstage/blob/master/docs/deployment/docker.md#multi-stage-build) in the documentation.

## 0.4.20

### Patch Changes

- e725bb812f: Remove SearchContextProvider from `<Root />`

  The `SidebarSearchModal` exported from `plugin-search` internally renders `SearchContextProvider`, so it can be removed from `Root.tsx`:

  ```diff
  -import {
  -  SidebarSearchModal,
  -  SearchContextProvider,
  -} from '@backstage/plugin-search';
  +import { SidebarSearchModal } from '@backstage/plugin-search';

  ... omitted ...

         <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
  -        <SearchContextProvider>
  -          <SidebarSearchModal />
  -        </SearchContextProvider>
  +        <SidebarSearchModal />
         </SidebarGroup>
  ```

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/cli-common@0.1.7

## 0.4.19

### Patch Changes

- 22f4ecb0e6: Switched the `file:` dependency for a `link:` dependency in the `backend` package. This makes sure that the `app` package is linked in rather than copied.

  To apply this update to an existing app, make the following change to `packages/backend/package.json`:

  ```diff
     "dependencies": {
  -    "app": "file:../app",
  +    "app": "link:../app",
       "@backstage/backend-common": "^{{version '@backstage/backend-common'}}",
  ```

- 1dd5a02e91: **BREAKING:** Updated `knex` to major version 1, which also implies changing out
  the underlying `sqlite` implementation.

  The old `sqlite3` NPM library has been abandoned by its maintainers, which has
  led to unhandled security reports and other issues. Therefore, in the `knex` 1.x
  release line they have instead switched over to the [`@vscode/sqlite3`
  library](https://github.com/microsoft/vscode-node-sqlite3) by default, which is
  actively maintained by Microsoft.

  This means that as you update to this version of Backstage, there are two
  breaking changes that you will have to address in your own repository:

  ## Bumping `knex` itself

  All `package.json` files of your repo that used to depend on a 0.x version of
  `knex`, should now be updated to depend on the 1.x release line. This applies in
  particular to `packages/backend`, but may also occur in backend plugins or
  libraries.

  ```diff
  -    "knex": "^0.95.1",
  +    "knex": "^1.0.2",
  ```

  Almost all existing database code will continue to function without modification
  after this bump. The only significant difference that we discovered in the main
  repo, is that the `alter()` function had a slightly different signature in
  migration files. It now accepts an object with `alterType` and `alterNullable`
  fields that clarify a previous grey area such that the intent of the alteration
  is made explicit. This is caught by `tsc` and your editor if you are using the
  `@ts-check` and `@param` syntax in your migration files
  ([example](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/migrations/20220116144621_remove_legacy.js#L17)),
  which we strongly recommend.

  See the [`knex` documentation](https://knexjs.org/#Schema-alter) for more
  information about the `alter` syntax.

  Also see the [`knex` changelog](https://knexjs.org/#changelog) for information
  about breaking changes in the 1.x line; if you are using `RETURNING` you may
  want to make some additional modifications in your code.

  ## Switching out `sqlite3`

  All `package.json` files of your repo that used to depend on `sqlite3`, should
  now be updated to depend on `@vscode/sqlite3`. This applies in particular to
  `packages/backend`, but may also occur in backend plugins or libraries.

  ```diff
  -    "sqlite3": "^5.0.1",
  +    "@vscode/sqlite3": "^5.0.7",
  ```

  These should be functionally equivalent, except that the new library will have
  addressed some long standing problems with old transitive dependencies etc.

## 0.4.19-next.0

### Patch Changes

- 22f4ecb0e6: Switched the `file:` dependency for a `link:` dependency in the `backend` package. This makes sure that the `app` package is linked in rather than copied.

  To apply this update to an existing app, make the following change to `packages/backend/package.json`:

  ```diff
     "dependencies": {
  -    "app": "file:../app",
  +    "app": "link:../app",
       "@backstage/backend-common": "^{{version '@backstage/backend-common'}}",
  ```

- 1dd5a02e91: **BREAKING:** Updated `knex` to major version 1, which also implies changing out
  the underlying `sqlite` implementation.

  The old `sqlite3` NPM library has been abandoned by its maintainers, which has
  led to unhandled security reports and other issues. Therefore, in the `knex` 1.x
  release line they have instead switched over to the [`@vscode/sqlite3`
  library](https://github.com/microsoft/vscode-node-sqlite3) by default, which is
  actively maintained by Microsoft.

  This means that as you update to this version of Backstage, there are two
  breaking changes that you will have to address in your own repository:

  ## Bumping `knex` itself

  All `package.json` files of your repo that used to depend on a 0.x version of
  `knex`, should now be updated to depend on the 1.x release line. This applies in
  particular to `packages/backend`, but may also occur in backend plugins or
  libraries.

  ```diff
  -    "knex": "^0.95.1",
  +    "knex": "^1.0.2",
  ```

  Almost all existing database code will continue to function without modification
  after this bump. The only significant difference that we discovered in the main
  repo, is that the `alter()` function had a slightly different signature in
  migration files. It now accepts an object with `alterType` and `alterNullable`
  fields that clarify a previous grey area such that the intent of the alteration
  is made explicit. This is caught by `tsc` and your editor if you are using the
  `@ts-check` and `@param` syntax in your migration files
  ([example](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/migrations/20220116144621_remove_legacy.js#L17)),
  which we strongly recommend.

  See the [`knex` documentation](https://knexjs.org/#Schema-alter) for more
  information about the `alter` syntax.

  Also see the [`knex` changelog](https://knexjs.org/#changelog) for information
  about breaking changes in the 1.x line; if you are using `RETURNING` you may
  want to make some additional modifications in your code.

  ## Switching out `sqlite3`

  All `package.json` files of your repo that used to depend on `sqlite3`, should
  now be updated to depend on `@vscode/sqlite3`. This applies in particular to
  `packages/backend`, but may also occur in backend plugins or libraries.

  ```diff
  -    "sqlite3": "^5.0.1",
  +    "@vscode/sqlite3": "^5.0.7",
  ```

  These should be functionally equivalent, except that the new library will have
  addressed some long standing problems with old transitive dependencies etc.

## 0.4.18

### Patch Changes

- 5bd0ce9e62: chore(deps): bump `inquirer` from 7.3.3 to 8.2.0
- f27f5197e2: Apply the fix from `0.4.16`, which is part of the `v0.65.1` release of Backstage.
- 2687029a67: Update backend-to-backend auth link in configuration file comment
- 24ef62048c: Adds missing `/catalog-graph` route to `<CatalogGraphPage/>`.

  To fix this problem for a recently created app please update your `app/src/App.tsx`

  ```diff
  + import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';

   ... omitted ...

    </Route>
      <Route path="/settings" element={<UserSettingsPage />} />
  +   <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    </FlatRoutes>
  ```

- ba59832aed: Permission the `catalog-import` route

  The following changes are **required** if you intend to add permissions to your existing app.

  Use the `PermissionedRoute` for `CatalogImportPage` instead of the normal `Route`:

  ```diff
  // packages/app/src/App.tsx
  ...
  + import { PermissionedRoute } from '@backstage/plugin-permission-react';
  + import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';

  ...

  - <Route path="/catalog-import" element={<CatalogImportPage />} />
  + <PermissionedRoute
  +   path="/catalog-import"
  +   permission={catalogEntityCreatePermission}
  +   element={<CatalogImportPage />}
  + />
  ```

- cef64b1561: Added `tokenManager` as a required property for the auth-backend `createRouter` function. This dependency is used to issue server tokens that are used by the `CatalogIdentityClient` when looking up users and their group membership during authentication.

  These changes are **required** to `packages/backend/src/plugins/auth.ts`:

  ```diff
  export default async function createPlugin({
    logger,
    database,
    config,
    discovery,
  + tokenManager,
  }: PluginEnvironment): Promise<Router> {
    return await createRouter({
      logger,
      config,
      database,
      discovery,
  +   tokenManager,
    });
  }
  ```

- e39d88bd84: Switched the `app` dependency in the backend to use a file target rather than version.

  To apply this change to an existing app, make the following change to `packages/backend/package.json`:

  ```diff
     "dependencies": {
  -    "app": "0.0.0",
  +    "app": "file:../app",
  ```

## 0.4.18-next.1

### Patch Changes

- 5bd0ce9e62: chore(deps): bump `inquirer` from 7.3.3 to 8.2.0
- ba59832aed: Permission the `catalog-import` route

  The following changes are **required** if you intend to add permissions to your existing app.

  Use the `PermissionedRoute` for `CatalogImportPage` instead of the normal `Route`:

  ```diff
  // packages/app/src/App.tsx
  ...
  + import { PermissionedRoute } from '@backstage/plugin-permission-react';
  + import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';

  ...

  - <Route path="/catalog-import" element={<CatalogImportPage />} />
  + <PermissionedRoute
  +   path="/catalog-import"
  +   permission={catalogEntityCreatePermission}
  +   element={<CatalogImportPage />}
  + />
  ```

## 0.4.18-next.0

### Patch Changes

- f27f5197e2: Apply the fix from `0.4.16`, which is part of the `v0.65.1` release of Backstage.
- 2687029a67: Update backend-to-backend auth link in configuration file comment
- 24ef62048c: Adds missing `/catalog-graph` route to `<CatalogGraphPage/>`.

  To fix this problem for a recently created app please update your `app/src/App.tsx`

  ```diff
  + import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';

   ... omitted ...

    </Route>
      <Route path="/settings" element={<UserSettingsPage />} />
  +   <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    </FlatRoutes>
  ```

- cef64b1561: Added `tokenManager` as a required property for the auth-backend `createRouter` function. This dependency is used to issue server tokens that are used by the `CatalogIdentityClient` when looking up users and their group membership during authentication.

  These changes are **required** to `packages/backend/src/plugins/auth.ts`:

  ```diff
  export default async function createPlugin({
    logger,
    database,
    config,
    discovery,
  + tokenManager,
  }: PluginEnvironment): Promise<Router> {
    return await createRouter({
      logger,
      config,
      database,
      discovery,
  +   tokenManager,
    });
  }
  ```

- e39d88bd84: Switched the `app` dependency in the backend to use a file target rather than version.

  To apply this change to an existing app, make the following change to `packages/backend/package.json`:

  ```diff
     "dependencies": {
  -    "app": "0.0.0",
  +    "app": "file:../app",
  ```

## 0.4.16

### Patch Changes

- c945cd9f7e: Adds missing `/catalog-graph` route to `<CatalogGraphPage/>`.

  To fix this problem for a recently created app please update your `app/src/App.tsx`

  ```diff
  + import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';

   ... omitted ...

    </Route>
      <Route path="/settings" element={<UserSettingsPage />} />
  +   <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    </FlatRoutes>
  ```

## 0.4.15

### Patch Changes

- 01b27d547c: Added three additional required properties to the search-backend `createRouter` function to support filtering search results based on permissions. To make this change to an existing app, add the required parameters to the `createRouter` call in `packages/backend/src/plugins/search.ts`:

  ```diff
  export default async function createPlugin({
    logger,
  +  permissions,
    discovery,
    config,
    tokenManager,
  }: PluginEnvironment) {
    /* ... */

    return await createRouter({
      engine: indexBuilder.getSearchEngine(),
  +    types: indexBuilder.getDocumentTypes(),
  +    permissions,
  +    config,
      logger,
    });
  }
  ```

The `.fromConfig` of the `DefaultCatalogCollator` also now takes a `tokenManager` as a parameter.

```diff
-   collator: DefaultCatalogCollator.fromConfig(config, { discovery }),
+   collator: DefaultCatalogCollator.fromConfig(config, { discovery, tokenManager }),
```

- a0d446c8ec: Replaced EntitySystemDiagramCard with EntityCatalogGraphCard

  To make this change to an existing app:

  Add `@backstage/plugin-catalog-graph` as a `dependency` in `packages/app/package.json` or `cd packages/app && yarn add @backstage/plugin-catalog-graph`.

  Apply the following changes to the `packages/app/src/components/catalog/EntityPage.tsx` file:

  ```diff
  + import {
  +  Direction,
  +  EntityCatalogGraphCard,
  + } from '@backstage/plugin-catalog-graph';
  + import {
  +  RELATION_API_CONSUMED_BY,
  +  RELATION_API_PROVIDED_BY,
  +  RELATION_CONSUMES_API,
  +  RELATION_DEPENDENCY_OF,
  +  RELATION_DEPENDS_ON,
  +  RELATION_HAS_PART,
  +  RELATION_PART_OF,
  +  RELATION_PROVIDES_API,
  + } from '@backstage/catalog-model';
  ```

  ```diff
      <EntityLayout.Route path="/diagram" title="Diagram">
  -      <EntitySystemDiagramCard />
  +      <EntityCatalogGraphCard
  +        variant="gridItem"
  +        direction={Direction.TOP_BOTTOM}
  +        title="System Diagram"
  +        height={700}
  +        relations={[
  +          RELATION_PART_OF,
  +          RELATION_HAS_PART,
  +          RELATION_API_CONSUMED_BY,
  +          RELATION_API_PROVIDED_BY,
  +          RELATION_CONSUMES_API,
  +          RELATION_PROVIDES_API,
  +          RELATION_DEPENDENCY_OF,
  +          RELATION_DEPENDS_ON,
  +        ]}
  +        unidirectional={false}
  +      />
      </EntityLayout.Route>
  ```

  ```diff
  const cicdContent = (
      <Grid item md={6}>
        <EntityAboutCard variant="gridItem" />
      </Grid>
  +    <Grid item md={6} xs={12}>
  +      <EntityCatalogGraphCard variant="gridItem" height={400} />
  +    </Grid>
  ```

  Add the above component in `overviewContent`, `apiPage` , `systemPage` and domainPage` as well.

- 4aca2a5307: An example instance of a `<SearchFilter.Select />` with asynchronously loaded values was added to the composed `SearchPage.tsx`, allowing searches bound to the `techdocs` type to be filtered by entity name.

  This is an entirely optional change; if you wish to adopt it, you can make the following (or similar) changes to your search page layout:

  ```diff
  --- a/packages/app/src/components/search/SearchPage.tsx
  +++ b/packages/app/src/components/search/SearchPage.tsx
  @@ -2,6 +2,10 @@ import React from 'react';
   import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';

   import { CatalogResultListItem } from '@backstage/plugin-catalog';
  +import {
  +  catalogApiRef,
  +  CATALOG_FILTER_EXISTS,
  +} from '@backstage/plugin-catalog-react';
   import { DocsResultListItem } from '@backstage/plugin-techdocs';

   import {
  @@ -10,6 +14,7 @@ import {
     SearchResult,
     SearchType,
     DefaultResultListItem,
  +  useSearch,
   } from '@backstage/plugin-search';
   import {
     CatalogIcon,
  @@ -18,6 +23,7 @@ import {
     Header,
     Page,
   } from '@backstage/core-components';
  +import { useApi } from '@backstage/core-plugin-api';

   const useStyles = makeStyles((theme: Theme) => ({
     bar: {
  @@ -36,6 +42,8 @@ const useStyles = makeStyles((theme: Theme) => ({

   const SearchPage = () => {
     const classes = useStyles();
  +  const { types } = useSearch();
  +  const catalogApi = useApi(catalogApiRef);

     return (
       <Page themeId="home">
  @@ -65,6 +73,27 @@ const SearchPage = () => {
                 ]}
               />
               <Paper className={classes.filters}>
  +              {types.includes('techdocs') && (
  +                <SearchFilter.Select
  +                  className={classes.filter}
  +                  label="Entity"
  +                  name="name"
  +                  values={async () => {
  +                    // Return a list of entities which are documented.
  +                    const { items } = await catalogApi.getEntities({
  +                      fields: ['metadata.name'],
  +                      filter: {
  +                        'metadata.annotations.backstage.io/techdocs-ref':
  +                          CATALOG_FILTER_EXISTS,
  +                      },
  +                    });
  +
  +                    const names = items.map(entity => entity.metadata.name);
  +                    names.sort();
  +                    return names;
  +                  }}
  +                />
  +              )}
                 <SearchFilter.Select
                   className={classes.filter}
                   name="kind"
  ```

- 1dbe63ec39: A `label` prop was added to `<SearchFilter.* />` components in order to allow
  user-friendly label strings (as well as the option to omit a label). In order
  to maintain labels on your existing filters, add a `label` prop to them in your
  `SearchPage.tsx`.

  ```diff
  --- a/packages/app/src/components/search/SearchPage.tsx
  +++ b/packages/app/src/components/search/SearchPage.tsx
  @@ -96,11 +96,13 @@ const SearchPage = () => {
                 )}
                 <SearchFilter.Select
                   className={classes.filter}
  +                label="Kind"
                   name="kind"
                   values={['Component', 'Template']}
                 />
                 <SearchFilter.Checkbox
                   className={classes.filter}
  +                label="Lifecycle"
                   name="lifecycle"
                   values={['experimental', 'production']}
                 />
  ```

## 0.4.14

### Patch Changes

- d4941024bc: Rebind external route for catalog import plugin from `scaffolderPlugin.routes.root` to `catalogImportPlugin.routes.importPage`.

  To make this change to an existing app, make the following change to `packages/app/src/App.tsx`

  ```diff
  const App = createApp({
    ...
    bindRoutes({ bind }) {
      ...
      bind(apiDocsPlugin.externalRoutes, {
  -     createComponent: scaffolderPlugin.routes.root,
  +     registerApi: catalogImportPlugin.routes.importPage,
      });
      ...
    },
  });
  ```

- b5402d6d72: Migrated the app template to React 17.

  To apply this change to an existing app, make sure you have updated to the latest version of `@backstage/cli`, and make the following change to `packages/app/package.json`:

  ```diff
       "history": "^5.0.0",
  -    "react": "^16.13.1",
  -    "react-dom": "^16.13.1",
  +    "react": "^17.0.2",
  +    "react-dom": "^17.0.2",
       "react-router": "6.0.0-beta.0",
  ```

  Since we have recently moved over all `react` and `react-dom` dependencies to `peerDependencies` of all packages, and included React 17 in the version range, this should be all you need to do. If you end up with duplicate React installations, first make sure that all of your plugins are up-to-date, including ones for example from `@roadiehq`. If that doesn't work, you may need to fall back to adding [Yarn resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) in the `package.json` of your project root:

  ```diff
  +  "resolutions": {
  +    "react": "^17.0.2",
  +    "react-dom": "^17.0.2"
  +  },
  ```

- 5e8d278f8e: Added an external route binding from the `org` plugin to the catalog index page.

  This change is needed because `@backstage/plugin-org` now has a required external route that needs to be bound for the app to start.

  To apply this change to an existing app, make the following change to `packages/app/src/App.tsx`:

  ```diff
   import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
  +import { orgPlugin } from '@backstage/plugin-org';
   import { SearchPage } from '@backstage/plugin-search';
  ```

  And further down within the `createApp` call:

  ```diff
       bind(scaffolderPlugin.externalRoutes, {
         registerComponent: catalogImportPlugin.routes.importPage,
       });
  +    bind(orgPlugin.externalRoutes, {
  +      catalogIndex: catalogPlugin.routes.catalogIndex,
  +    });
     },
  ```

- fb08e2f285: Updated the configuration of the `app-backend` plugin to enable the static asset store by passing on `database` from the plugin environment to `createRouter`.

  To apply this change to an existing app, make the following change to `packages/backend/src/plugins/app.ts`:

  ```diff
   export default async function createPlugin({
     logger,
     config,
  +  database,
   }: PluginEnvironment): Promise<Router> {
     return await createRouter({
       logger,
       config,
  +    database,
       appPackageName: 'app',
     });
   }
  ```

- 7ba416be78: You can now add `SidebarGroup`s to the current `Sidebar`. This will not affect how the current sidebar is displayed, but allows a customization on how the `MobileSidebar` on smaller screens will look like. A `SidebarGroup` will be displayed with the given icon in the `MobileSidebar`.

  A `SidebarGroup` can either link to an existing page (e.g. `/search` or `/settings`) or wrap components, which will be displayed in a full-screen overlay menu (e.g. `Menu`).

  ```diff
  <Sidebar>
      <SidebarLogo />
  +   <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
          <SidebarSearchModal />
  +   </SidebarGroup>
      <SidebarDivider />
  +   <SidebarGroup label="Menu" icon={<MenuIcon />}>
          <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
          <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
          <SidebarDivider />
          <SidebarScrollWrapper>
              <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
          </SidebarScrollWrapper>
  +   </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
  +   <SidebarGroup
  +       label="Settings"
  +       icon={<UserSettingsSignInAvatar />}
  +       to="/settings"
  +   >
          <SidebarSettings />
  +   </SidebarGroup>
  </Sidebar>
  ```

  Additionally, you can order the groups differently in the `MobileSidebar` than in the usual `Sidebar` simply by giving a group a priority. The groups will be displayed in descending order from left to right.

  ```diff
  <SidebarGroup
      label="Settings"
      icon={<UserSettingsSignInAvatar />}
      to="/settings"
  +   priority={1}
  >
      <SidebarSettings />
  </SidebarGroup>
  ```

  If you decide against adding `SidebarGroup`s to your `Sidebar` the `MobileSidebar` will contain one default menu item, which will open a full-screen overlay menu displaying all the content of the current `Sidebar`.

  More information on the `SidebarGroup` & the `MobileSidebar` component can be found in the changeset for the `core-components`.

- 08fa6a604a: The app template has been updated to add an explicit dependency on `typescript` in the root `package.json`. This is because it was removed as a dependency of `@backstage/cli` in order to decouple the TypeScript versioning in Backstage projects.

  To apply this change in an existing app, add a `typescript` dependency to your `package.json` in the project root:

  ```json
    "dependencies": {
      ...
      "typescript": "~4.5.4",
    }
  ```

  We recommend using a `~` version range since TypeScript releases do not adhere to semver.

  It may be the case that you end up with errors if you upgrade the TypeScript version. This is because there was a change to TypeScript not long ago that defaulted the type of errors caught in `catch` blocks to `unknown`. You can work around this by adding `"useUnknownInCatchVariables": false` to the `"compilerOptions"` in your `tsconfig.json`:

  ```json
    "compilerOptions": {
      ...
      "useUnknownInCatchVariables": false
    }
  ```

  Another option is to use the utilities from `@backstage/errors` to assert the type of errors caught in `catch` blocks:

  ```ts
  import { assertError, isError } from '@backstage/errors';

  try {
    ...
  } catch (error) {
    assertError(error);
    ...
    // OR
    if (isError(error)) {
      ...
    }
  }
  ```

  Yet another issue you might run into when upgrading TypeScript is incompatibilities in the types from `react-use`. The error you would run into looks something like this:

  ```plain
  node_modules/react-use/lib/usePermission.d.ts:1:54 - error TS2304: Cannot find name 'DevicePermissionDescriptor'.

  1 declare type PermissionDesc = PermissionDescriptor | DevicePermissionDescriptor | MidiPermissionDescriptor | PushPermissionDescriptor;
  ```

  If you encounter this error, the simplest fix is to replace full imports of `react-use` with more specific ones. For example, the following:

  ```ts
  import { useAsync } from 'react-use';
  ```

  Would be converted into this:

  ```ts
  import useAsync from 'react-use/lib/useAsync';
  ```

## 0.4.13

### Patch Changes

- fb08e2f285: Updated the configuration of the `app-backend` plugin to enable the static asset store by passing on `database` from the plugin environment to `createRouter`.

  To apply this change to an existing app, make the following change to `packages/backend/src/plugins/app.ts`:

  ```diff
   export default async function createPlugin({
     logger,
     config,
  +  database,
   }: PluginEnvironment): Promise<Router> {
     return await createRouter({
       logger,
       config,
  +    database,
       appPackageName: 'app',
     });
   }
  ```

- 7ba416be78: You can now add `SidebarGroup`s to the current `Sidebar`. This will not affect how the current sidebar is displayed, but allows a customization on how the `MobileSidebar` on smaller screens will look like. A `SidebarGroup` will be displayed with the given icon in the `MobileSidebar`.

  A `SidebarGroup` can either link to an existing page (e.g. `/search` or `/settings`) or wrap components, which will be displayed in a full-screen overlay menu (e.g. `Menu`).

  ```diff
  <Sidebar>
      <SidebarLogo />
  +   <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
          <SidebarSearchModal />
  +   </SidebarGroup>
      <SidebarDivider />
  +   <SidebarGroup label="Menu" icon={<MenuIcon />}>
          <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
          <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
          <SidebarDivider />
          <SidebarScrollWrapper>
              <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
          </SidebarScrollWrapper>
  +   </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
  +   <SidebarGroup
  +       label="Settings"
  +       icon={<UserSettingsSignInAvatar />}
  +       to="/settings"
  +   >
          <SidebarSettings />
  +   </SidebarGroup>
  </Sidebar>
  ```

  Additionally, you can order the groups differently in the `MobileSidebar` than in the usual `Sidebar` simply by giving a group a priority. The groups will be displayed in descending order from left to right.

  ```diff
  <SidebarGroup
      label="Settings"
      icon={<UserSettingsSignInAvatar />}
      to="/settings"
  +   priority={1}
  >
      <SidebarSettings />
  </SidebarGroup>
  ```

  If you decide against adding `SidebarGroup`s to your `Sidebar` the `MobileSidebar` will contain one default menu item, which will open a full-screen overlay menu displaying all the content of the current `Sidebar`.

  More information on the `SidebarGroup` & the `MobileSidebar` component can be found in the changeset for the `core-components`.

- 08fa6a604a: The app template has been updated to add an explicit dependency on `typescript` in the root `package.json`. This is because it was removed as a dependency of `@backstage/cli` in order to decouple the TypeScript versioning in Backstage projects.

  To apply this change in an existing app, add a `typescript` dependency to your `package.json` in the project root:

  ```json
    "dependencies": {
      ...
      "typescript": "~4.5.4",
    }
  ```

  We recommend using a `~` version range since TypeScript releases do not adhere to semver.

  It may be the case that you end up with errors if you upgrade the TypeScript version. This is because there was a change to TypeScript not long ago that defaulted the type of errors caught in `catch` blocks to `unknown`. You can work around this by adding `"useUnknownInCatchVariables": false` to the `"compilerOptions"` in your `tsconfig.json`:

  ```json
    "compilerOptions": {
      ...
      "useUnknownInCatchVariables": false
    }
  ```

  Another option is to use the utilities from `@backstage/errors` to assert the type of errors caught in `catch` blocks:

  ```ts
  import { assertError, isError } from '@backstage/errors';

  try {
    ...
  } catch (error) {
    assertError(error);
    ...
    // OR
    if (isError(error)) {
      ...
    }
  }
  ```

- Updated dependencies
  - @backstage/plugin-tech-radar@0.5.3-next.0
  - @backstage/plugin-auth-backend@0.7.0-next.0
  - @backstage/core-components@0.8.5-next.0
  - @backstage/plugin-api-docs@0.6.23-next.0
  - @backstage/plugin-catalog-backend@0.21.0-next.0
  - @backstage/plugin-permission-common@0.4.0-next.0
  - @backstage/cli@0.12.0-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/plugin-catalog@0.7.9-next.0
  - @backstage/plugin-user-settings@0.3.17-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-app-backend@0.3.22-next.0
  - @backstage/core-app-api@0.5.0-next.0
  - @backstage/plugin-catalog-import@0.7.10-next.0
  - @backstage/plugin-scaffolder@0.11.19-next.0
  - @backstage/plugin-search@0.5.6-next.0
  - @backstage/plugin-techdocs@0.12.15-next.0
  - @backstage/plugin-permission-node@0.4.0-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/integration-react@0.1.19-next.0
  - @backstage/plugin-explore@0.3.26-next.0
  - @backstage/plugin-github-actions@0.4.32-next.0
  - @backstage/plugin-lighthouse@0.2.35-next.0
  - @backstage/plugin-scaffolder-backend@0.15.21-next.0
  - @backstage/backend-tasks@0.1.4-next.0
  - @backstage/catalog-client@0.5.5-next.0
  - @backstage/test-utils@0.2.3-next.0
  - @backstage/plugin-proxy-backend@0.2.16-next.0
  - @backstage/plugin-rollbar-backend@0.1.19-next.0
  - @backstage/plugin-search-backend@0.3.1-next.0
  - @backstage/plugin-techdocs-backend@0.12.4-next.0

## 0.4.12

### Patch Changes

- 5333451def: Cleaned up API exports
- cd529c4094: Add permissions to create-app's PluginEnvironment

  `CatalogEnvironment` now has a `permissions` field, which means that a permission client must now be provided as part of `PluginEnvironment`. To apply these changes to an existing app, add the following to the `makeCreateEnv` function in `packages/backend/src/index.ts`:

  ```diff
    // packages/backend/src/index.ts

  + import { ServerPermissionClient } from '@backstage/plugin-permission-node';

    function makeCreateEnv(config: Config) {
      ...
  +   const permissions = ServerPermissionClient.fromConfig(config, {
  +     discovery,
  +     tokenManager,
  +   });

      root.info(`Created UrlReader ${reader}`);

      return (plugin: string): PluginEnvironment => {
        ...
        return {
          logger,
          cache,
          database,
          config,
          reader,
          discovery,
          tokenManager,
          scheduler,
  +       permissions,
        };
      }
    }
  ```

  And add a permissions field to the `PluginEnvironment` type in `packages/backend/src/types.ts`:

  ```diff
    // packages/backend/src/types.ts

  + import { PermissionAuthorizer } from '@backstage/plugin-permission-common';

    export type PluginEnvironment = {
      ...
  +   permissions: PermissionAuthorizer;
    };
  ```

  [`@backstage/plugin-permission-common`](https://www.npmjs.com/package/@backstage/plugin-permission-common) and [`@backstage/plugin-permission-node`](https://www.npmjs.com/package/@backstage/plugin-permission-node) will need to be installed as dependencies:

  ```diff
    // packages/backend/package.json

  +   "@backstage/plugin-permission-common": "...",
  +   "@backstage/plugin-permission-node": "...",
  ```

## 0.4.11

## 0.4.10

### Patch Changes

- 79b342bd36: removed inline and internal CSS from index.html

  To make this change to an existing app, apply the following changes to the `packages/app/public/index.html` file:

  Remove internal style

  ```diff
  - <style>
  -  #root {
  -    min-height: 100%;
  -  }
  - </style>
  ```

  Remove inline style from the body tag

  ```diff
  - <body style="margin: 0">
  + <body>
  ```

- d33b65dc52: Removed unused templating asset.
- 613ad12960: Add a comment to the default backend about the fallback 404 handler.
- 20af5a701f: The `<SearchType />` filter in the composed `SearchPage.tsx` was replaced with the `<SearchType.Accordion />` variant.

  This is an entirely optional change; if you wish to display a control surface for search `types` as a single-select accordion (as opposed to the current multi-select of checkboxes), you can make the following (or similar) changes to your search page layout:

  ```diff
  --- a/packages/app/src/components/search/SearchPage.tsx
  +++ b/packages/app/src/components/search/SearchPage.tsx
  @@ -11,7 +11,7 @@ import {
     SearchType,
     DefaultResultListItem,
   } from '@backstage/plugin-search';
  -import { Content, Header, Page } from '@backstage/core-components';
  +import { CatalogIcon, Content, DocsIcon, Header, Page } from '@backstage/core-components';

   const useStyles = makeStyles((theme: Theme) => ({
     bar: {
  @@ -19,6 +19,7 @@ const useStyles = makeStyles((theme: Theme) => ({
     },
     filters: {
       padding: theme.spacing(2),
  +    marginTop: theme.spacing(2),
     },
     filter: {
       '& + &': {
  @@ -41,12 +42,23 @@ const SearchPage = () => {
               </Paper>
             </Grid>
             <Grid item xs={3}>
  +            <SearchType.Accordion
  +              name="Result Type"
  +              defaultValue="software-catalog"
  +              types={[
  +                {
  +                  value: 'software-catalog',
  +                  name: 'Software Catalog',
  +                  icon: <CatalogIcon />,
  +                },
  +                {
  +                  value: 'techdocs',
  +                  name: 'Documentation',
  +                  icon: <DocsIcon />,
  +                },
  +              ]}
  +            />
               <Paper className={classes.filters}>
  -              <SearchType
  -                values={['techdocs', 'software-catalog']}
  -                name="type"
  -                defaultValue="software-catalog"
  -              />
                 <SearchFilter.Select
                   className={classes.filter}
                   name="kind"
  ```

- 0dcd1dd64f: Add a `scheduler` to the plugin environment, which can schedule collaborative tasks across backends. To apply the same change in your backend, follow the steps below.

  First install the package:

  ```shell
  # From the Backstage repository root
  cd packages/backend
  yarn add @backstage/backend-tasks
  ```

  Add the scheduler to your plugin environment type:

  ```diff
   // In packages/backend/src/types.ts
  +import { PluginTaskScheduler } from '@backstage/backend-tasks';

   export type PluginEnvironment = {
  +  scheduler: PluginTaskScheduler;
  ```

  And finally make sure to add such an instance to each plugin's environment:

  ```diff
   // In packages/backend/src/index.ts
  +import { TaskScheduler } from '@backstage/backend-tasks';

   function makeCreateEnv(config: Config) {
     // ...
  +  const taskScheduler = TaskScheduler.fromConfig(config);

     return (plugin: string): PluginEnvironment => {
       // ...
  +    const scheduler = taskScheduler.forPlugin(plugin);
       return {
  +      scheduler,
         // ...
  ```

## 0.4.9

### Patch Changes

- 49a696d720: debounceTime prop is removed from the SearchBar component in the SearchPage as the default is set to 200. The prop is safe to remove and makes it easier to stay up to date with any changes in the future.
- 5fdc8df0e8: The `index.html` template of the app has been updated to use the new `config` global provided by the Backstage CLI.

  To apply this change to an existing app, make the following changes to `packages/app/public/index.html`:

  ```diff
  -    <title><%= app.title %></title>
  +    <title><%= config.getString('app.title') %></title>
  ```

  ```diff
  -    <% if (app.googleAnalyticsTrackingId && typeof app.googleAnalyticsTrackingId === 'string') { %>
  +    <% if (config.has('app.googleAnalyticsTrackingId')) { %>
       <script
         async
  -      src="https://www.googletagmanager.com/gtag/js?id=<%= app.googleAnalyticsTrackingId %>"
  +      src="https://www.googletagmanager.com/gtag/js?id=<%= config.getString('app.googleAnalyticsTrackingId') %>"
       ></script>
  ```

  ```diff
  -      gtag('config', '<%= app.googleAnalyticsTrackingId %>');
  +      gtag(
  +        'config',
  +        '<%= config.getString("app.googleAnalyticsTrackingId") %>',
  +      );
  ```

## 0.4.8

### Patch Changes

- 25dfc2d483: Updated the root `package.json` to include files with `.cjs` and `.mjs` extensions in the `"lint-staged"` configuration.

  To make this change to an existing app, apply the following changes to the `package.json` file:

  ```diff
   "lint-staged": {
  -    "*.{js,jsx,ts,tsx}": [
  +    "*.{js,jsx,ts,tsx,mjs,cjs}": [
  ```

## 0.4.7

### Patch Changes

- 9603827bb5: Addressed some peer dependency warnings
- 1bada775a9: TechDocs Backend may now (optionally) leverage a cache store to improve
  performance when reading content from a cloud storage provider.

  To apply this change to an existing app, pass the cache manager from the plugin
  environment to the `createRouter` function in your backend:

  ```diff
  // packages/backend/src/plugins/techdocs.ts

  export default async function createPlugin({
    logger,
    config,
    discovery,
    reader,
  +  cache,
  }: PluginEnvironment): Promise<Router> {

    // ...

    return await createRouter({
      preparers,
      generators,
      publisher,
      logger,
      config,
      discovery,
  +    cache,
    });
  ```

  If your `PluginEnvironment` does not include a cache manager, be sure you've
  applied [the cache management change][cm-change] to your backend as well.

  [Additional configuration][td-rec-arch] is required if you wish to enable
  caching in TechDocs.

  [cm-change]: https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md#patch-changes-6
  [td-rec-arch]: https://backstage.io/docs/features/techdocs/architecture#recommended-deployment

- 4862fbc64f: Bump @spotify/prettier-config
- 36bb4fb2e9: Removed the `scaffolder.github.visibility` configuration that is no longer used from the default app template.

## 0.4.6

### Patch Changes

- 24d2ce03f3: Search Modal now relies on the Search Context to access state and state setter. If you use the SidebarSearchModal as described in the [getting started documentation](https://backstage.io/docs/features/search/getting-started#using-the-search-modal), make sure to update your code with the SearchContextProvider.

  ```diff
  export const Root = ({ children }: PropsWithChildren<{}>) => (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
  -     <SidebarSearchModal />
  +     <SearchContextProvider>
  +       <SidebarSearchModal />
  +     </SearchContextProvider>
        <SidebarDivider />
      ...
  ```

- 905dd952ac: Incorporate usage of the tokenManager into the backend created using `create-app`.

  In existing backends, update the `PluginEnvironment` to include a `tokenManager`:

  ```diff
  // packages/backend/src/types.ts

  ...
  import {
    ...
  + TokenManager,
  } from '@backstage/backend-common';

  export type PluginEnvironment = {
    ...
  + tokenManager: TokenManager;
  };
  ```

  Then, create a `ServerTokenManager`. This can either be a `noop` that requires no secret and validates all requests by default, or one that uses a secret from your `app-config.yaml` to generate and validate tokens.

  ```diff
  // packages/backend/src/index.ts

  ...
  import {
    ...
  + ServerTokenManager,
  } from '@backstage/backend-common';
  ...

  function makeCreateEnv(config: Config) {
    ...
    // CHOOSE ONE
    // TokenManager not requiring a secret
  + const tokenManager = ServerTokenManager.noop();
    // OR TokenManager requiring a secret
  + const tokenManager = ServerTokenManager.fromConfig(config);

    ...
    return (plugin: string): PluginEnvironment => {
      ...
  -   return { logger, cache, database, config, reader, discovery };
  +   return { logger, cache, database, config, reader, discovery, tokenManager };
    };
  }
  ```

## 0.4.5

### Patch Changes

- dcaeaac174: Cleaned out the `peerDependencies` in the published version of the package, making it much quicker to run `npx @backstage/create-app` as it no longer needs to install a long list of unnecessary.
- a5a5d7e1f1: DefaultTechDocsCollator is now included in the search backend, and the Search Page updated with the SearchType component that includes the techdocs type
- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- 42ebbc18c0: Bump gitbeaker to the latest version

## 0.4.4

### Patch Changes

- 4ebc9fd277: Create backstage.json file

  `@backstage/create-app` will create a new `backstage.json` file. At this point, the file will contain a `version` property, representing the version of `@backstage/create-app` used for creating the application. If the backstage's application has been bootstrapped using an older version of `@backstage/create-app`, the `backstage.json` file can be created and kept in sync, together with all the changes of the latest version of backstage, by running the following script:

  ```bash
  yarn backstage-cli versions:bump
  ```

- e21e3c6102: Bumping minimum requirements for `dockerode` and `testcontainers`
- 014cbf8cb9: Migrated the app template use the new `@backstage/app-defaults` for the `createApp` import, since the `createApp` exported by `@backstage/app-core-api` will be removed in the future.

  To migrate an existing application, add the latest version of `@backstage/app-defaults` as a dependency in `packages/app/package.json`, and make the following change to `packages/app/src/App.tsx`:

  ```diff
  -import { createApp, FlatRoutes } from '@backstage/core-app-api';
  +import { createApp } from '@backstage/app-defaults';
  +import { FlatRoutes } from '@backstage/core-app-api';
  ```

- 2163e83fa2: Refactor and add regression tests for create-app tasks
- Updated dependencies
  - @backstage/cli-common@0.1.6

## 0.4.3

### Patch Changes

- 5dcea2586c: Integrated `SidebarSearchModal` component into default-app to use the `SearchModal`.

  The `SidebarSearchModal` component can also be used in other generated apps:

  ```diff
  import {
  -  SidebarSearch,
  +  SidebarSearchModal
  } from '@backstage/plugin-search';
  ...
   <SidebarPage>
      <Sidebar>
        <SidebarLogo />
  -     <SidebarSearch />
  +     <SidebarSearchModal />
        <SidebarDivider />
  ...
  ```

  If you only want to use the `SearchModal` you can import it from `'@backstage/plugin-search'`:

  ```js
  import { SearchModal } from '@backstage/plugin-search';
  ```

- 5725f87e4c: Updated the app template to no longer include the `--no-private` flag for the `create-plugin` command.

  To apply this change to an existing application, remove the `--no-private` flag from the `create-plugin` command in the root `package.json`:

  ```diff
     "prettier:check": "prettier --check .",
  -  "create-plugin": "backstage-cli create-plugin --scope internal --no-private",
  +  "create-plugin": "backstage-cli create-plugin --scope internal",
     "remove-plugin": "backstage-cli remove-plugin"
  ```

- 1921f70aa7: Removed the version pinning of the packages `graphql-language-service-interface` and `graphql-language-service-parser`. This should no longer be necessary.

  You can apply the same change in your repository by ensuring that the following does _NOT_ appear in your root `package.json`.

  ```json
  "resolutions": {
    "graphql-language-service-interface": "2.8.2",
    "graphql-language-service-parser": "1.9.0"
    },
  ```

## 0.4.2

## 0.4.1

### Patch Changes

- 4f1c30c176: Support optional path argument when generating a project using `create-app`
- Updated dependencies
  - @backstage/cli-common@0.1.5

## 0.4.0

### Minor Changes

- 5914668655: Removed `@backstage/plugin-welcome`, no new updates to the packages will be
  published in the future.

  The welcome plugin was used by early alpha versions of Backstage, but today only
  contained a simple page with welcome instructions. It was superseded by
  `@backstage/plugin-home` which can be used to build a homepage customized to the
  needs of your organization.

  If it's still used in your app, remove the dependency from your `package.json`
  as well as left over code.

### Patch Changes

- b486adb8c6: Removed the included `jest` configuration from the root `package.json` as the `transformModules` option no longer exists.

  To apply this change to an existing app, make the follow change to the root `package.json`:

  ```diff
  -  "jest": {
  -    "transformModules": [
  -      "@asyncapi/react-component"
  -    ]
  -  }
  ```

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.

## 0.3.45

### Patch Changes

- eaca0f53fb: The scaffolder plugin has just released the beta 3 version of software templates, which replaces the handlebars templating syntax. As part of this change, the template entity schema is no longer included in the core catalog-model as with previous versions. The decoupling of the template entities version will allow us to more easily make updates in the future.

  In order to use the new beta 3 templates, the following changes are **required** for any existing installation, inside `packages/backend/src/plugins/catalog.ts`:

  ```diff
  +import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';

  ...

     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(new ScaffolderEntitiesProcessor());
     const { processingEngine, router } = await builder.build();
  ```

  If you're interested in learning more about creating custom kinds, please check out the [extending the model](https://backstage.io/docs/features/software-catalog/extending-the-model) documentation.

## 0.3.44

### Patch Changes

- e254368371: Switched the default `test` script in the package root to use `backstage-cli test` rather than `lerna run test`. This is thanks to the `@backstage/cli` now supporting running the test command from the project root.

  To apply this change to an existing project, apply the following change to your root `package.json`:

  ```diff
  -    "test": "lerna run test --since origin/master -- --coverage",
  +    "test": "backstage-cli test",
  ```

- Updated dependencies
  - @backstage/cli-common@0.1.4

## 0.3.43

### Patch Changes

- 9325075eea: Added the default `ScmAuth` implementation to the app.

  To apply this change to an existing app, head to `packages/app/apis.ts`, import `ScmAuth` from `@backstage/integration-react`, and add a `ScmAuth.createDefaultApiFactory()` to your list of APIs:

  ```diff
   import {
     ScmIntegrationsApi,
     scmIntegrationsApiRef,
  +   ScmAuth,
   } from '@backstage/integration-react';

   export const apis: AnyApiFactory[] = [
  ...
  +  ScmAuth.createDefaultApiFactory(),
  ...
   ];
  ```

  If you have integrations towards SCM providers other than the default ones (github.com, gitlab.com, etc.), you will want to create a custom `ScmAuth` factory instead, for example like this:

  ```ts
  createApiFactory({
    api: scmAuthApiRef,
    deps: {
      gheAuthApi: gheAuthApiRef,
      githubAuthApi: githubAuthApiRef,
    },
    factory: ({ githubAuthApi, gheAuthApi }) =>
      ScmAuth.merge(
        ScmAuth.forGithub(githubAuthApi),
        ScmAuth.forGithub(gheAuthApi, {
          host: 'ghe.example.com',
        }),
      ),
  });
  ```

## 0.3.42

### Patch Changes

- 89fd81a1ab: This change adds an API endpoint for requesting a catalog refresh at `/refresh`, which is activated if a `RefreshService` is passed to `createRouter`.
  The creation of the router has been abstracted behind the `CatalogBuilder` to simplify usage and future changes. The following **changes are required** to your `catalog.ts` for the refresh endpoint to function.

  ```diff
  -  import {
  -    CatalogBuilder,
  -    createRouter,
  -  } from '@backstage/plugin-catalog-backend';
  +  import { CatalogBuilder } from '@backstage/plugin-catalog-backend';

    export default async function createPlugin(
      env: PluginEnvironment,
    ): Promise<Router> {
      const builder = await CatalogBuilder.create(env);
  -    const {
  -      entitiesCatalog,
  -      locationAnalyzer,
  -      processingEngine,
  -      locationService,
  -    } = await builder.build();
  +   const { processingEngine, router } = await builder.build();
      await processingEngine.start();

  -   return await createRouter({
  -     entitiesCatalog,
  -     locationAnalyzer,
  -     locationService,
  -     logger: env.logger,
  -     config: env.config,
  -   });
  +   return router;
    }
  ```

- d0a47c8605: Switched required engine from Node.js 12 or 14, to 14 or 16.

  To apply these changes to an existing app, switch out the following in the root `package.json`:

  ```diff
     "engines": {
  -    "node": "12 || 14"
  +    "node": "14 || 16"
     },
  ```

  Also get rid of the entire `engines` object in `packages/backend/package.json`, as it is redundant:

  ```diff
  -  "engines": {
  -    "node": "12 || 14"
  -  },
  ```

- df95665e4b: Bumped the default `@spotify/prettier-config` dependency to `^11.0.0`.

  This is an optional upgrade, but you may be interested in doing the same, to get the most modern lint rules out there.

## 0.3.41

## 0.3.40

### Patch Changes

- a5013957e: Updated the search configuration class to use the static `fromConfig`-based constructor for the `DefaultCatalogCollator`.

  To apply this change to an existing app, replace the following line in `search.ts`:

  ```diff
  -collator: new DefaultCatalogCollator({ discovery })
  +collator: DefaultCatalogCollator.fromConfig(config, { discovery })
  ```

  The `config` parameter was not needed before, so make sure you also add that in the signature of `createPlugin`
  in `search.ts`:

  ```diff
  export default async function createPlugin({
    logger,
    discovery,
  +  config,
  }: PluginEnvironment) {
  ```

- Updated dependencies
  - @backstage/cli-common@0.1.3

## 0.3.39

### Patch Changes

- 25924638b: Minor tweaks to the create-app template to match earlier documented changes

## 0.3.38

### Patch Changes

- 787bc0826: Wire up TechDocs, which now relies on the composability API for routing.

  First, ensure you've mounted `<TechDocsReaderPage />`. If you already updated
  to use the composable `<TechDocsIndexPage />` (see below), no action is
  necessary. Otherwise, update your `App.tsx` so that `<TechDocsReaderPage />` is
  mounted:

  ```diff
       <Route path="/docs" element={<TechdocsPage />} />
  +    <Route
  +      path="/docs/:namespace/:kind/:name/*"
  +      element={<TechDocsReaderPage />}
  +    />
  ```

  Next, ensure links from the Catalog Entity Page to its TechDocs site are bound:

  ```diff
    bindRoutes({ bind }) {
      bind(catalogPlugin.externalRoutes, {
        createComponent: scaffolderPlugin.routes.root,
  +     viewTechDoc: techdocsPlugin.routes.docRoot,
      });
  ```

- d02768171: Updated the default create-app `EntityPage` to include orphan and processing error alerts for all entity types. Previously these were only shown for entities with the `Component` kind. This also adds the `EntityLinkCard` for API entities.

  As an example, you might add this to your `packages/app/src/components/catalog/EntityPage.tsx`:

  ```tsx
  const entityWarningContent = (
    <>
      <EntitySwitch>
        <EntitySwitch.Case if={isOrphan}>
          <Grid item xs={12}>
            <EntityOrphanWarning />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
      <EntitySwitch>
        <EntitySwitch.Case if={hasCatalogProcessingErrors}>
          <Grid item xs={12}>
            <EntityProcessingErrorsPanel />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
    </>
  );
  ```

  and then add that at the top of your various content pages:

  ```diff
   const overviewContent = (
     <Grid container spacing={3} alignItems="stretch">
  +    {entityWarningContent}
       <Grid item md={6}>
         <EntityAboutCard variant="gridItem" />
       </Grid>
  ```

  or in actual page wrappers:

  ```diff
   const apiPage = (
     <EntityLayout>
       <EntityLayout.Route path="/" title="Overview">
         <Grid container spacing={3}>
  +        {entityWarningContent}
           <Grid item md={6}>
             <EntityAboutCard />
           </Grid>
  ```

  Note that there may be many such `*Page` pages in that file, and you probably want that warning at the top of them all.

  You can also add the links card to your API page if you do not already have it:

  ```diff
  const apiPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        <Grid container spacing={3}>
  +       {entityWarningContent}
           <Grid item md={6}>
             <EntityAboutCard />
           </Grid>
  +        <Grid item md={4} xs={12}>
  +          <EntityLinksCard />
  +        </Grid>
  ```

## 0.3.37

## 0.3.36

## 0.3.35

### Patch Changes

- 362ea5a72: Updated the index page redirect to work with apps served on a different base path than `/`.

  To apply this change to an existing app, remove the `/` prefix from the target route in the `Navigate` element in `packages/app/src/App.tsx`:

  ```diff
  -<Navigate key="/" to="/catalog" />
  +<Navigate key="/" to="catalog" />
  ```

- 80582cbec: Use new composable `TechDocsIndexPage` and `DefaultTechDocsHome`

  Make the following changes to your `App.tsx` to migrate existing apps:

  ```diff
  -    <Route path="/docs" element={<TechdocsPage />} />
  +    <Route path="/docs" element={<TechDocsIndexPage />}>
  +      <DefaultTechDocsHome />
  +    </Route>
  +    <Route
  +      path="/docs/:namespace/:kind/:name/*"
  +      element={<TechDocsReaderPage />}
  +    />
  ```

- c4ef9181a: Migrate to using `webpack@5` 🎉
- 56c773909: Add a complete prettier setup to the created project. Prettier used to only be added as a dependency to create apps, but there wasn't a complete setup included that makes it easy to run prettier. That has now changed, and the new `prettier:check` command can be used to check the formatting of the files in your created project.

  To apply this change to an existing app, a couple of changes need to be made.

  Create a `.prettierignore` file at the root of your repository with the following contents:

  ```
  dist
  dist-types
  coverage
  .vscode
  ```

  Next update the root `package.json` by bumping the prettier version and adding the new `prettier:check` command:

  ```diff
     "scripts": {
       ...
  +    "prettier:check": "prettier --check .",
       ...
     },
     ...
     "dependencies": {
       ...
  -    "prettier": "^1.19.1"
  +    "prettier": "^2.3.2"
     }
  ```

  Finally run `yarn prettier --write .` on your project to update the existing formatting.

- 9f8f8dd6b: Removed the `/` prefix in the catalog `SidebarItem` element, as it is no longer needed.

  To apply this change to an existing app, remove the `/` prefix from the catalog and any other sidebar items in `packages/app/src/components/Root/Root.ts`:

  ```diff
  -<SidebarItem icon={HomeIcon} to="/catalog" text="Home" />
  +<SidebarItem icon={HomeIcon} to="catalog" text="Home" />
  ```

- 56c773909: Switched `@types/react-dom` dependency to of the app package to request `*` rather than a specific version.

  To apply this change to an existing app, change the following in `packages/app/package.json`:

  ```diff
  -    "@types/react-dom": "^16.9.8",
  +    "@types/react-dom": "*",
  ```

## 0.3.34

### Patch Changes

- c189c5da5: fix typo in the comments of EntityPage component
- 48ea3d25b: The recommended value for a `backstage.io/techdocs-ref` annotation is now
  `dir:.`, indicating "documentation source files are located in the same
  directory relative to the catalog entity." Note that `url:<location>` values
  are still supported.
- 98dda80b4: Update `techdocs.generators` with the latest `techdocs.generator` config in `app-config.yaml`. See
  https://backstage.io/docs/features/techdocs/configuration for reference and relevant PR
  https://github.com/backstage/backstage/pull/6071/files for the changes.

## 0.3.33

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- d50c9e7c0: Update the `software-templates` to point to `main` branch instead of `master`
- 224e54484: Added an `EntityProcessingErrorsPanel` component to show any errors that occurred when refreshing an entity from its source location.

  If upgrading, this should be added to your `EntityPage` in your Backstage application:

  ```diff
  // packages/app/src/components/catalog/EntityPage.tsx

  const overviewContent = (
  ...
            <EntityOrphanWarning />
          </Grid>
         </EntitySwitch.Case>
      </EntitySwitch>
  +   <EntitySwitch>
  +     <EntitySwitch.Case if={hasCatalogProcessingErrors}>
  +       <Grid item xs={12}>
  +         <EntityProcessingErrorsPanel />
  +       </Grid>
  +     </EntitySwitch.Case>
  +   </EntitySwitch>

  ```

  Additionally, `WarningPanel` now changes color based on the provided severity.

## 0.3.32

### Patch Changes

- 03bf17e9b: Improve the responsiveness of the EntityPage UI. With this the Header component should scale with the screen size & wrapping should not cause overflowing/blocking of links. Additionally enforce the Pages using the Grid Layout to use it across all screen sizes & to wrap as intended.

  To benefit from the improved responsive layout, the `EntityPage` in existing Backstage applications should be updated to set the `xs` column size on each grid item in the page, as this does not default. For example:

  ```diff
  -  <Grid item md={6}>
  +  <Grid item xs={12} md={6}>
  ```

- eb740ee24: Moved sample software templates to the [backstage/software-templates](https://github.com/backstage/software-templates) repository. If you previously referenced the sample templates straight from `scaffolder-backend` plugin in the main [backstage/backstage](https://github.com/backstage/backstage) repository in your `app-config.yaml`, these references will need to be updated.

  See https://github.com/backstage/software-templates

## 0.3.31

### Patch Changes

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.

## 0.3.30

### Patch Changes

- 60e830222: Support for `Template` kinds with version `backstage.io/v1alpha1` has now been removed. This means that the old method of running templates with `Preparers`, `Templaters` and `Publishers` has also been removed. If you had any logic in these abstractions, they should now be moved to `actions` instead, and you can find out more about those in the [documentation](https://backstage.io/docs/features/software-templates/writing-custom-actions)

  If you need any help migrating existing templates, there's a [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2). Reach out to us on Discord in the #support channel if you're having problems.

  The `scaffolder-backend` now no longer requires these `Preparers`, `Templaters`, and `Publishers` to be passed in, now all it needs is the `containerRunner`.

  Please update your `packages/backend/src/plugins/scaffolder.ts` like the following

  ```diff
  - import {
  -  DockerContainerRunner,
  -  SingleHostDiscovery,
  - } from '@backstage/backend-common';
  + import { DockerContainerRunner } from '@backstage/backend-common';
    import { CatalogClient } from '@backstage/catalog-client';
  - import {
  -   CookieCutter,
  -   CreateReactAppTemplater,
  -   createRouter,
  -   Preparers,
  -   Publishers,
  -   Templaters,
  - } from '@backstage/plugin-scaffolder-backend';
  + import { createRouter } from '@backstage/plugin-scaffolder-backend';
    import Docker from 'dockerode';
    import { Router } from 'express';
    import type { PluginEnvironment } from '../types';

    export default async function createPlugin({
      config,
      database,
      reader,
  +   discovery,
    }: PluginEnvironment): Promise<Router> {
      const dockerClient = new Docker();
      const containerRunner = new DockerContainerRunner({ dockerClient });

  -   const cookiecutterTemplater = new CookieCutter({ containerRunner });
  -   const craTemplater = new CreateReactAppTemplater({ containerRunner });
  -   const templaters = new Templaters();

  -   templaters.register('cookiecutter', cookiecutterTemplater);
  -   templaters.register('cra', craTemplater);
  -
  -   const preparers = await Preparers.fromConfig(config, { logger });
  -   const publishers = await Publishers.fromConfig(config, { logger });

  -   const discovery = SingleHostDiscovery.fromConfig(config);
      const catalogClient = new CatalogClient({ discoveryApi: discovery });

      return await createRouter({
  -     preparers,
  -     templaters,
  -     publishers,
  +     containerRunner,
        logger,
        config,
        database,

  ```

- f7134c368: bump sqlite3 to 5.0.1
- e4244f94b: Use SidebarScrollWrapper to improve responsiveness of the current sidebar. Change: Wrap a section of SidebarItems with this component to enable scroll for smaller screens. It can also be used in sidebar plugins (see shortcuts plugin for an example).

## 0.3.29

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.2

## 0.3.28

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.

## 0.3.27

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.12.2

## 0.3.26

### Patch Changes

- 5db7445b4: Adding .DS_Store pattern to .gitignore in Scaffolded Backstage App. To migrate an existing app that pattern should be added manually.

  ```diff
  +# macOS
  +.DS_Store
  ```

- b45e29410: This release enables the new catalog processing engine which is a major milestone for the catalog!

  This update makes processing more scalable across multiple instances, adds support for deletions and ui flagging of entities that are no longer referenced by a location.

  **Changes Required** to `catalog.ts`

  ```diff
  -import { useHotCleanup } from '@backstage/backend-common';
   import {
     CatalogBuilder,
  -  createRouter,
  -  runPeriodically
  +  createRouter
   } from '@backstage/plugin-catalog-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
  -  const builder = new CatalogBuilder(env);
  +  const builder = await CatalogBuilder.create(env);
     const {
       entitiesCatalog,
       locationsCatalog,
  -    higherOrderOperation,
  +    locationService,
  +    processingEngine,
       locationAnalyzer,
     } = await builder.build();

  -  useHotCleanup(
  -    module,
  -    runPeriodically(() => higherOrderOperation.refreshAllLocations(), 100000),
  -  );
  +  await processingEngine.start();

     return await createRouter({
       entitiesCatalog,
       locationsCatalog,
  -    higherOrderOperation,
  +    locationService,
       locationAnalyzer,
       logger: env.logger,
       config: env.config,
  ```

  As this is a major internal change we have taken some precaution by still allowing the old catalog to be enabled by keeping your `catalog.ts` in it's current state.
  If you encounter any issues and have to revert to the previous catalog engine make sure to raise an issue immediately as the old catalog engine is deprecated and will be removed in a future release.

- 772dbdb51: Deprecates `SingleConnectionDatabaseManager` and provides an API compatible database
  connection manager, `DatabaseManager`, which allows developers to configure database
  connections on a per plugin basis.

  The `backend.database` config path allows you to set `prefix` to use an
  alternate prefix for automatically generated database names, the default is
  `backstage_plugin_`. Use `backend.database.plugin.<pluginId>` to set plugin
  specific database connection configuration, e.g.

  ```yaml
  backend:
    database:
      client: 'pg',
      prefix: 'custom_prefix_'
      connection:
        host: 'localhost'
        user: 'foo'
        password: 'bar'
      plugin:
        catalog:
          connection:
            database: 'database_name_overriden'
        scaffolder:
          client: 'sqlite3'
          connection: ':memory:'
  ```

  Migrate existing backstage installations by swapping out the database manager in the
  `packages/backend/src/index.ts` file as shown below:

  ```diff
  import {
  -  SingleConnectionDatabaseManager,
  +  DatabaseManager,
  } from '@backstage/backend-common';

  // ...

  function makeCreateEnv(config: Config) {
    // ...
  -  const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
  +  const databaseManager = DatabaseManager.fromConfig(config);
    // ...
  }
  ```

- Updated dependencies
  - @backstage/plugin-catalog@0.6.3
  - @backstage/plugin-search-backend-node@0.2.1
  - @backstage/plugin-catalog-backend@0.10.3
  - @backstage/backend-common@0.8.3
  - @backstage/cli@0.7.1
  - @backstage/plugin-api-docs@0.5.0
  - @backstage/plugin-scaffolder-backend@0.12.1
  - @backstage/plugin-techdocs@0.9.6
  - @backstage/plugin-techdocs-backend@0.8.3
  - @backstage/plugin-catalog-import@0.5.10
  - @backstage/plugin-app-backend@0.3.14
  - @backstage/plugin-proxy-backend@0.2.10
  - @backstage/plugin-rollbar-backend@0.1.12
  - @backstage/plugin-search-backend@0.2.1
  - @backstage/plugin-user-settings@0.2.11
  - @backstage/catalog-model@0.8.3
  - @backstage/plugin-auth-backend@0.3.13
  - @backstage/core@0.7.13

## 0.3.25

### Patch Changes

- 4f8cf50fe: Updated the `@gitbeaker/node` dependency past the broken one without a `dist` folder.

  See [this issue](https://github.com/jdalrymple/gitbeaker/issues/1861) for more details.

  If you get build errors that look like the following in your Backstage instance, you may want to also bump all of your `@gitbeaker/*` dependencies to at least `^30.2.0`.

  ```
  node:internal/modules/cjs/loader:356
        throw err;
        ^

  Error: Cannot find module '/path/to/project/node_modules/@gitbeaker/node/dist/index.js'. Please verify that the package.json has a valid "main" entry
      at tryPackage (node:internal/modules/cjs/loader:348:19)
      at Function.Module._findPath (node:internal/modules/cjs/loader:561:18)
      at Function.Module._resolveFilename (node:internal/modules/cjs/loader:926:27)
      at Function.Module._load (node:internal/modules/cjs/loader:773:27)
      at Module.require (node:internal/modules/cjs/loader:1012:19)
      at require (node:internal/modules/cjs/helpers:93:18)
      at Object.<anonymous> (/path/to/project/test.js:4:18)
      at Module._compile (node:internal/modules/cjs/loader:1108:14)
      at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)
      at Module.load (node:internal/modules/cjs/loader:988:32) {
    code: 'MODULE_NOT_FOUND',
    path: '/path/to/project/node_modules/@gitbeaker/node/package.json',
    requestPath: '@gitbeaker/node'
  }
  ```

  you could also consider pinning the version to an older one in your `package.json` either root or `packages/backend/package.json`, before the breakage occurred.

  ```json
  "resolutions": {
      "**/@gitbeaker/node": "29.2.4",
      "**/@gitbeaker/core": "29.2.4",
      "**/@gitbeaker/requester-utils": "29.2.4"
  }
  ```

  Be aware that this is only required short term until we can release our updated versions of `@backstage/plugin-scaffolder-backend`.

- 55a253de2: Migrating old `backstage.io/v1alpha1` templates to `backstage.io/v1beta2`

  Deprecating the `create-react-app` Template. We're planning on removing the `create-react-app` templater, as it's been a little tricky to support and takes 15mins to run in a container. We've currently cached a copy of the output for `create-react-app` and ship that under our sample templates folder. If you want to continue using it, we suggest copying the template out of there and putting it in your own repository as it will be removed in upcoming releases.

  We also recommend removing this entry from your `app-config.yaml` if it exists:

  ```diff
  -    - type: url
  -      target: https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/sample-templates/create-react-app/template.yaml
  -      rules:
  -        - allow: [Template]
  ```

- 509b5638c: Added "out-of-the-box" alpha-milestone search features to scaffolded Backstage apps.

  To apply this change to an existing app, do the following...

  First, navigate to your backend package and install the two new search backend
  packages:

  ```sh
  cd packages/backend
  yarn add @backstage/plugin-search-backend @backstage/plugin-search-backend-node
  ```

  Wire up these new packages into your app backend by first creating a new
  `search.ts` file at `src/plugins/search.ts` with contents like the following:

  ```typescript
  import { useHotCleanup } from '@backstage/backend-common';
  import { createRouter } from '@backstage/plugin-search-backend';
  import {
    IndexBuilder,
    LunrSearchEngine,
  } from '@backstage/plugin-search-backend-node';
  import { PluginEnvironment } from '../types';
  import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';

  export default async function createPlugin({
    logger,
    discovery,
  }: PluginEnvironment) {
    // Initialize a connection to a search engine.
    const searchEngine = new LunrSearchEngine({ logger });
    const indexBuilder = new IndexBuilder({ logger, searchEngine });

    // Collators are responsible for gathering documents known to plugins. This
    // particular collator gathers entities from the software catalog.
    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
      collator: new DefaultCatalogCollator({ discovery }),
    });

    // The scheduler controls when documents are gathered from collators and sent
    // to the search engine for indexing.
    const { scheduler } = await indexBuilder.build();

    // A 3 second delay gives the backend server a chance to initialize before
    // any collators are executed, which may attempt requests against the API.
    setTimeout(() => scheduler.start(), 3000);
    useHotCleanup(module, () => scheduler.stop());

    return await createRouter({
      engine: indexBuilder.getSearchEngine(),
      logger,
    });
  }
  ```

  Then, ensure the search plugin you configured above is initialized by modifying
  your backend's `index.ts` file in the following ways:

  ```diff
  +import search from './plugins/search';
  // ...
  +const searchEnv = useHotMemoize(module, () => createEnv('search'));
  // ...
  +apiRouter.use('/search', await search(searchEnv));
  // ...
  ```

  In your frontend app package, create a new `searchPage` component at, for
  example, `packages/app/src/components/search/SearchPage.tsx` with contents like
  the following:

  ```tsx
  import React from 'react';
  import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';

  import { Content, Header, Lifecycle, Page } from '@backstage/core';
  import { CatalogResultListItem } from '@backstage/plugin-catalog';
  import {
    SearchBar,
    SearchFilter,
    SearchResult,
    DefaultResultListItem,
  } from '@backstage/plugin-search';

  const useStyles = makeStyles((theme: Theme) => ({
    bar: {
      padding: theme.spacing(1, 0),
    },
    filters: {
      padding: theme.spacing(2),
    },
    filter: {
      '& + &': {
        marginTop: theme.spacing(2.5),
      },
    },
  }));

  const SearchPage = () => {
    const classes = useStyles();

    return (
      <Page themeId="home">
        <Header title="Search" subtitle={<Lifecycle alpha />} />
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Paper className={classes.bar}>
                <SearchBar debounceTime={100} />
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.filters}>
                <SearchFilter.Select
                  className={classes.filter}
                  name="kind"
                  values={['Component', 'Template']}
                />
                <SearchFilter.Checkbox
                  className={classes.filter}
                  name="lifecycle"
                  values={['experimental', 'production']}
                />
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <SearchResult>
                {({ results }) => (
                  <List>
                    {results.map(({ type, document }) => {
                      switch (type) {
                        case 'software-catalog':
                          return (
                            <CatalogResultListItem
                              key={document.location}
                              result={document}
                            />
                          );
                        default:
                          return (
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          );
                      }
                    })}
                  </List>
                )}
              </SearchResult>
            </Grid>
          </Grid>
        </Content>
      </Page>
    );
  };

  export const searchPage = <SearchPage />;
  ```

  Then in `App.tsx`, import this new `searchPage` component, and set it as a
  child of the existing `<SearchPage />` route so that it looks like this:

  ```diff
  +import { searchPage } from './components/search/SearchPage';
  // ...
  -<Route path="/search" element={<SearchPage />} />
  +<Route path="/search" element={<SearchPage />}>
  +  {searchPage}
  +</Route>
  ```

- Updated dependencies [9cd3c533c]
- Updated dependencies [db1c8f93b]
- Updated dependencies [9c63be545]
- Updated dependencies [9bdd2cca8]
- Updated dependencies [92963779b]
- Updated dependencies [27a9b503a]
- Updated dependencies [f4e3ac5ce]
- Updated dependencies [66c6bfebd]
- Updated dependencies [9b4010965]
- Updated dependencies [7f7443308]
- Updated dependencies [55a253de2]
- Updated dependencies [7028ee1ca]
- Updated dependencies [70bc30c5b]
- Updated dependencies [db1c8f93b]
- Updated dependencies [5aff84759]
- Updated dependencies [5aff84759]
- Updated dependencies [f26e6008f]
- Updated dependencies [21e8ebef5]
- Updated dependencies [4fbb00707]
- Updated dependencies [eda9dbd5f]
- Updated dependencies [4f8cf50fe]
- Updated dependencies [d5ad47bbb]
- Updated dependencies [875809a59]
  - @backstage/cli@0.7.0
  - @backstage/plugin-catalog@0.6.2
  - @backstage/plugin-catalog-backend@0.10.2
  - @backstage/plugin-github-actions@0.4.9
  - @backstage/backend-common@0.8.2
  - @backstage/catalog-model@0.8.2
  - @backstage/plugin-scaffolder@0.9.8
  - @backstage/plugin-scaffolder-backend@0.12.0
  - @backstage/integration-react@0.1.3
  - @backstage/catalog-client@0.3.13
  - @backstage/plugin-catalog-import@0.5.9
  - @backstage/plugin-search-backend-node@0.2.0
  - @backstage/plugin-search@0.4.0
  - @backstage/plugin-search-backend@0.2.0
  - @backstage/plugin-proxy-backend@0.2.9
  - @backstage/core@0.7.12
  - @backstage/errors@0.1.1
  - @backstage/test-utils@0.1.13
  - @backstage/theme@0.2.8
  - @backstage/plugin-api-docs@0.4.15
  - @backstage/plugin-app-backend@0.3.13
  - @backstage/plugin-auth-backend@0.3.12
  - @backstage/plugin-explore@0.3.6
  - @backstage/plugin-lighthouse@0.2.17
  - @backstage/plugin-rollbar-backend@0.1.11
  - @backstage/plugin-tech-radar@0.4.0
  - @backstage/plugin-techdocs@0.9.5
  - @backstage/plugin-techdocs-backend@0.8.2
  - @backstage/plugin-user-settings@0.2.10

## 0.3.24

### Patch Changes

- 1ddf551f4: Add CLI output and README how to start app after create-app CLI
- Updated dependencies [7af9cef07]
- Updated dependencies [497f4ce18]
- Updated dependencies [ee4eb5b40]
- Updated dependencies [84160313e]
- Updated dependencies [3772de8ba]
- Updated dependencies [7e7c71417]
- Updated dependencies [f430b6c6f]
- Updated dependencies [2a942cc9e]
- Updated dependencies [e7c5e4b30]
- Updated dependencies [ebe802bc4]
- Updated dependencies [1cf1d351f]
- Updated dependencies [90a505a77]
- Updated dependencies [76f99a1a0]
- Updated dependencies [1157fa307]
- Updated dependencies [6fe1567a7]
- Updated dependencies [e7a5a3474]
- Updated dependencies [2305ab8fc]
- Updated dependencies [054bcd029]
- Updated dependencies [aad98c544]
- Updated dependencies [63a432e9c]
- Updated dependencies [f46a9e82d]
  - @backstage/test-utils@0.1.13
  - @backstage/plugin-scaffolder@0.9.7
  - @backstage/cli@0.6.14
  - @backstage/plugin-catalog@0.6.1
  - @backstage/theme@0.2.8
  - @backstage/catalog-model@0.8.1
  - @backstage/core@0.7.12
  - @backstage/plugin-tech-radar@0.4.0
  - @backstage/plugin-scaffolder-backend@0.11.5
  - @backstage/plugin-catalog-backend@0.10.1
  - @backstage/plugin-techdocs@0.9.5

## 0.3.23

### Patch Changes

- 6c4bd674c: Cache management has been added to the Backstage backend.

  To apply this change to an existing app, make the following changes:

  ```diff
  // packages/backend/src/types.ts

  import { Logger } from 'winston';
  import { Config } from '@backstage/config';
  import {
  +  PluginCacheManager,
    PluginDatabaseManager,
    PluginEndpointDiscovery,
    UrlReader,
  } from '@backstage/backend-common';

  export type PluginEnvironment = {
    logger: Logger;
    database: PluginDatabaseManager;
  +  cache: PluginCacheManager;
    config: Config;
    reader: UrlReader
    discovery: PluginEndpointDiscovery;
  };
  ```

  ```diff
  // packages/backend/src/index.ts

  import Router from 'express-promise-router';
  import {
    createServiceBuilder,
    loadBackendConfig,
    getRootLogger,
    useHotMemoize,
    notFoundHandler,
  +  CacheManager,
    SingleConnectionDatabaseManager,
    SingleHostDiscovery,
    UrlReaders,
  } from '@backstage/backend-common';
  import { Config } from '@backstage/config';

  function makeCreateEnv(config: Config) {
    const root = getRootLogger();
    const reader = UrlReaders.default({ logger: root, config });
    const discovery = SingleHostDiscovery.fromConfig(config);

    root.info(`Created UrlReader ${reader}`);

    const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
  +  const cacheManager = CacheManager.fromConfig(config);

    return (plugin: string): PluginEnvironment => {
      const logger = root.child({ type: 'plugin', plugin });
      const database = databaseManager.forPlugin(plugin);
  -    return { logger, database, config, reader, discovery };
  +    const cache = cacheManager.forPlugin(plugin);
  +    return { logger, database, cache, config, reader, discovery };
    };
  }
  ```

  To configure a cache store, add a `backend.cache` key to your app-config.yaml.

  ```diff
  // app-config.yaml

  backend:
    baseUrl: http://localhost:7000
    listen:
      port: 7000
    database:
      client: sqlite3
      connection: ':memory:'
  +  cache:
  +    store: memory
  ```

- f86ab6d49: Added newer entity relationship cards to the default `@backstage/create-app` template:

  - `EntityDependsOnComponentsCard`
  - `EntityDependsOnResourcesCard`
  - `EntityHasResourcesCard`
  - `EntityHasSubcomponentsCard`

  The `EntityLinksCard` was also added to the overview page. To apply these to your Backstage application, compare against the updated [EntityPage.tsx](https://github.com/backstage/backstage/blob/371760ca2493c8f63e9b44ecc57cc8488131ba5b/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx)

- 260aaa684: Bumped the `@gitbeaker` dependencies to `29.x`.

  To apply this change to an existing app, update all `@gitbeaker/*` dependencies in your `package.json`s to point to `^29.2.0`. Then run `yarn install` at the root of your project.

- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [1cd0cacd9]
- Updated dependencies [4ea9df9d3]
- Updated dependencies [7a7da5146]
- Updated dependencies [bf805b467]
- Updated dependencies [203ce6f6f]
- Updated dependencies [7ab5bfe68]
- Updated dependencies [260aaa684]
- Updated dependencies [704875e26]
- Updated dependencies [3a181cff1]
  - @backstage/plugin-catalog-backend@0.10.0
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog@0.6.0
  - @backstage/cli@0.6.13
  - @backstage/plugin-techdocs@0.9.4
  - @backstage/plugin-scaffolder-backend@0.11.4
  - @backstage/plugin-api-docs@0.4.15
  - @backstage/plugin-auth-backend@0.3.12
  - @backstage/plugin-catalog-import@0.5.8
  - @backstage/plugin-explore@0.3.6
  - @backstage/plugin-github-actions@0.4.8
  - @backstage/plugin-lighthouse@0.2.17
  - @backstage/plugin-scaffolder@0.9.6
  - @backstage/plugin-search@0.3.7
  - @backstage/plugin-techdocs-backend@0.8.2

## 0.3.22

### Patch Changes

- 3be844496: chore: bump `ts-node` versions to 9.1.1
- Updated dependencies [062bbf90f]
- Updated dependencies [2cd70e164]
- Updated dependencies [0b033d07b]
- Updated dependencies [3be844496]
- Updated dependencies [5542de095]
- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [82ca1ac22]
- Updated dependencies [81ef1d57b]
- Updated dependencies [f9fb4a205]
- Updated dependencies [e3fc89df6]
- Updated dependencies [9a207f052]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [fd39d4662]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/integration-react@0.1.2
  - @backstage/test-utils@0.1.11
  - @backstage/plugin-api-docs@0.4.13
  - @backstage/plugin-catalog@0.5.7
  - @backstage/plugin-catalog-import@0.5.6
  - @backstage/plugin-explore@0.3.5
  - @backstage/plugin-github-actions@0.4.6
  - @backstage/plugin-lighthouse@0.2.16
  - @backstage/plugin-scaffolder@0.9.4
  - @backstage/plugin-scaffolder-backend@0.11.1
  - @backstage/plugin-search@0.3.6
  - @backstage/plugin-tech-radar@0.3.11
  - @backstage/plugin-techdocs@0.9.2
  - @backstage/plugin-user-settings@0.2.10
  - @backstage/cli@0.6.11
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9
  - @backstage/plugin-catalog-backend@0.9.0
  - @backstage/plugin-app-backend@0.3.13
  - @backstage/plugin-auth-backend@0.3.10
  - @backstage/plugin-proxy-backend@0.2.8
  - @backstage/plugin-rollbar-backend@0.1.11
  - @backstage/plugin-techdocs-backend@0.8.1

## 0.3.21

### Patch Changes

- 38ca05168: The default `@octokit/rest` dependency was bumped to `"^18.5.3"`.
- e0bfd3d44: The `scaffolder-backend` and `techdocs-backend` plugins have been updated.
  In order to update, you need to apply the following changes to your existing backend application:

  `@backstage/plugin-techdocs-backend`:

  ```diff
  // packages/backend/src/plugin/techdocs.ts

  + import { DockerContainerRunner } from '@backstage/backend-common';

    export default async function createPlugin({
      logger,
      config,
      discovery,
      reader,
    }: PluginEnvironment): Promise<Router> {
      // Preparers are responsible for fetching source files for documentation.
      const preparers = await Preparers.fromConfig(config, {
        logger,
        reader,
      });

  +   // Docker client (conditionally) used by the generators, based on techdocs.generators config.
  +   const dockerClient = new Docker();
  +   const containerRunner = new DockerContainerRunner({ dockerClient });

      // Generators are used for generating documentation sites.
      const generators = await Generators.fromConfig(config, {
        logger,
  +     containerRunner,
      });

      // Publisher is used for
      // 1. Publishing generated files to storage
      // 2. Fetching files from storage and passing them to TechDocs frontend.
      const publisher = await Publisher.fromConfig(config, {
        logger,
        discovery,
      });

      // checks if the publisher is working and logs the result
      await publisher.getReadiness();

  -   // Docker client (conditionally) used by the generators, based on techdocs.generators config.
  -   const dockerClient = new Docker();

      return await createRouter({
        preparers,
        generators,
        publisher,
  -     dockerClient,
        logger,
        config,
        discovery,
      });
    }
  ```

  `@backstage/plugin-scaffolder-backend`:

  ```diff
  // packages/backend/src/plugin/scaffolder.ts

  - import { SingleHostDiscovery } from '@backstage/backend-common';
  + import {
  +   DockerContainerRunner,
  +   SingleHostDiscovery,
  + } from '@backstage/backend-common';

    export default async function createPlugin({
      logger,
      config,
      database,
      reader,
    }: PluginEnvironment): Promise<Router> {
  +   const dockerClient = new Docker();
  +   const containerRunner = new DockerContainerRunner({ dockerClient });

  +   const cookiecutterTemplater = new CookieCutter({ containerRunner });
  -   const cookiecutterTemplater = new CookieCutter();
  +   const craTemplater = new CreateReactAppTemplater({ containerRunner });
  -   const craTemplater = new CreateReactAppTemplater();
      const templaters = new Templaters();

      templaters.register('cookiecutter', cookiecutterTemplater);
      templaters.register('cra', craTemplater);

      const preparers = await Preparers.fromConfig(config, { logger });
      const publishers = await Publishers.fromConfig(config, { logger });

  -   const dockerClient = new Docker();

      const discovery = SingleHostDiscovery.fromConfig(config);
      const catalogClient = new CatalogClient({ discoveryApi: discovery });

      return await createRouter({
        preparers,
        templaters,
        publishers,
        logger,
        config,
  -     dockerClient,
        database,
        catalogClient,
        reader,
      });
    }
  ```

- Updated dependencies [e0bfd3d44]
- Updated dependencies [e0bfd3d44]
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [f65adcde7]
- Updated dependencies [80888659b]
- Updated dependencies [b219821a0]
- Updated dependencies [7b8272fb7]
- Updated dependencies [8aedbb4af]
- Updated dependencies [fc79a6dd3]
- Updated dependencies [69eefb5ae]
- Updated dependencies [75c8cec39]
- Updated dependencies [b2e2ec753]
- Updated dependencies [227439a72]
- Updated dependencies [9314a8592]
- Updated dependencies [2e05277e0]
- Updated dependencies [4075c6367]
- Updated dependencies [cdb3426e5]
- Updated dependencies [d8b81fd28]
- Updated dependencies [d1b1306d9]
  - @backstage/plugin-scaffolder-backend@0.11.0
  - @backstage/backend-common@0.7.0
  - @backstage/plugin-techdocs-backend@0.8.0
  - @backstage/plugin-catalog-import@0.5.5
  - @backstage/plugin-github-actions@0.4.5
  - @backstage/cli@0.6.10
  - @backstage/core@0.7.8
  - @backstage/plugin-catalog-backend@0.8.2
  - @backstage/theme@0.2.7
  - @backstage/plugin-tech-radar@0.3.10
  - @backstage/plugin-scaffolder@0.9.3
  - @backstage/plugin-techdocs@0.9.1
  - @backstage/plugin-proxy-backend@0.2.7
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5
  - @backstage/catalog-client@0.3.11
  - @backstage/plugin-app-backend@0.3.12
  - @backstage/plugin-auth-backend@0.3.9
  - @backstage/plugin-rollbar-backend@0.1.10

## 0.3.20

### Patch Changes

- 73f3f5d78: Updates the end to end test in the app to match the new catalog index page title. To apply this change to an existing app, update `packages/app/cypress/integration/app.js` to search for `"My Company Catalog"` instead of `"My Company Service Catalog"`.
- Updated dependencies [1ce80ff02]
- Updated dependencies [4c42ecca2]
- Updated dependencies [c614ede9a]
- Updated dependencies [9afcac5af]
- Updated dependencies [07a7806c3]
- Updated dependencies [f6efa71ee]
- Updated dependencies [19a4dd710]
- Updated dependencies [a99e0bc42]
- Updated dependencies [dcd54c7cd]
- Updated dependencies [da546ce00]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6fbd7beca]
- Updated dependencies [15cbe6815]
- Updated dependencies [39bdaa004]
- Updated dependencies [cb8c848a3]
- Updated dependencies [21fddf452]
- Updated dependencies [17915e29b]
- Updated dependencies [a1783f306]
- Updated dependencies [6eaecbd81]
- Updated dependencies [23769512a]
- Updated dependencies [1a142ae8a]
  - @backstage/plugin-api-docs@0.4.12
  - @backstage/plugin-github-actions@0.4.4
  - @backstage/plugin-catalog-import@0.5.4
  - @backstage/plugin-explore@0.3.4
  - @backstage/plugin-lighthouse@0.2.15
  - @backstage/core@0.7.7
  - @backstage/plugin-scaffolder@0.9.2
  - @backstage/plugin-catalog@0.5.6
  - @backstage/plugin-catalog-backend@0.8.1
  - @backstage/plugin-search@0.3.5
  - @backstage/plugin-techdocs@0.9.0
  - @backstage/plugin-scaffolder-backend@0.10.1

## 0.3.19

### Patch Changes

- ee22773e9: Removed `plugins.ts` from the app, as plugins are now discovered through the react tree.

  To apply this change to an existing app, simply delete `packages/app/src/plugins.ts` along with the import and usage in `packages/app/src/App.tsx`.

  Note that there are a few plugins that require explicit registration, in which case you would need to keep them in `plugins.ts`. The set of plugins that need explicit registration is any plugin that doesn't have a component extension that gets rendered as part of the app element tree. An example of such a plugin in the main Backstage repo is `@backstage/plugin-badges`. In the case of the badges plugin this is because there is not yet a component-based API for adding context menu items to the entity layout.

  If you have plugins that still rely on route registration through the `register` method of `createPlugin`, these need to be kept in `plugins.ts` as well. However, it is recommended to migrate these to export an extensions component instead.

- 670acd88e: Fix system diagram card to be on the system page

  To apply the same fix to an existing application, in `EntityPage.tsx` simply move the `<EntityLayout.route>` for the `/diagram` path from the `groupPage` down into the `systemPage` element.

- Updated dependencies [94da20976]
- Updated dependencies [84c54474d]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [4e5c94249]
- Updated dependencies [99fbef232]
- Updated dependencies [cb0206b2b]
- Updated dependencies [1373f4f12]
- Updated dependencies [29a7e4be8]
- Updated dependencies [ab07d77f6]
- Updated dependencies [49574a8a3]
- Updated dependencies [d367f63b5]
- Updated dependencies [96728a2af]
- Updated dependencies [5fe62f124]
- Updated dependencies [931b21a12]
- Updated dependencies [937ed39ce]
- Updated dependencies [87c4f59de]
- Updated dependencies [09b5fcf2e]
- Updated dependencies [b42531cfe]
- Updated dependencies [c2306f898]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
- Updated dependencies [ac6025f63]
- Updated dependencies [e292e393f]
- Updated dependencies [479b29124]
  - @backstage/core@0.7.6
  - @backstage/plugin-scaffolder-backend@0.10.0
  - @backstage/cli@0.6.9
  - @backstage/plugin-scaffolder@0.9.1
  - @backstage/plugin-catalog-import@0.5.3
  - @backstage/plugin-rollbar-backend@0.1.9
  - @backstage/backend-common@0.6.3
  - @backstage/plugin-catalog@0.5.5
  - @backstage/plugin-catalog-backend@0.8.0
  - @backstage/theme@0.2.6
  - @backstage/plugin-techdocs@0.8.0

## 0.3.18

### Patch Changes

- b49a525ab: Fixing dependency resolution for problematic library `graphql-language-service-interface`.

  This change might not have to be applied to your local installation, however if you run into this error:

  ```
  Error: Failed to compile.
  /tmp/backstage-e2e-uMeycm/test-app/node_modules/graphql-language-service-interface/esm/GraphQLLanguageService.js 100:23
  Module parse failed: Unexpected token (100:23)
  You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
  |         }
  |         let customRules = null;
  >         if (extensions?.customValidationRules &&
  |             typeof extensions.customValidationRules === 'function') {
  |             customRules = extensions.customValidationRules(this._graphQLConfig);
  ```

  You can fix it by adding the following to the root `package.json`.

  ```json
  ...
  "resolutions": {
    "graphql-language-service-interface": "2.8.2",
    "graphql-language-service-parser": "1.9.0"
   },
  ...
  ```

- a360f9478: Expose the catalog-import route as an external route from the scaffolder.

  This will make it possible to hide the "Register Existing Component" button
  when you for example are running backstage with `catalog.readonly=true`.

  As a consequence of this change you need add a new binding to your createApp call to
  keep the button visible. However, if you instead want to hide the button you can safely
  ignore the following example.

  To bind the external route from the catalog-import plugin to the scaffolder template
  index page, make sure you have the appropriate imports and add the following
  to the createApp call:

  ```typescript
  import { catalogImportPlugin } from '@backstage/plugin-catalog-import';

  const app = createApp({
    // ...
    bindRoutes({ bind }) {
      // ...
      bind(scaffolderPlugin.externalRoutes, {
        registerComponent: catalogImportPlugin.routes.importPage,
      });
    },
  });
  ```

- f1952337c: Due to a change in the techdocs publishers, they don't check if they are able to reach e.g. the configured S3 bucket anymore.
  This can be added again by the following change. Note that the backend process will no longer exit when it is not reachable but will only emit an error log message.
  You should include the check when your backend to get early feedback about a potential misconfiguration:

  ```diff
    // packages/backend/src/plugins/techdocs.ts

    export default async function createPlugin({
      logger,
      config,
      discovery,
      reader,
    }: PluginEnvironment): Promise<Router> {
      // ...

      const publisher = await Publisher.fromConfig(config, {
        logger,
        discovery,
      })

  +   // checks if the publisher is working and logs the result
  +   await publisher.getReadiness();

      // Docker client (conditionally) used by the generators, based on techdocs.generators config.
      const dockerClient = new Docker();

      // ...
  }
  ```

- Updated dependencies [d8ffec739]
- Updated dependencies [7abec4dbc]
- Updated dependencies [017192ee8]
- Updated dependencies [a360f9478]
- Updated dependencies [bb5055aee]
- Updated dependencies [d840d30bc]
- Updated dependencies [d0d1c2f7b]
- Updated dependencies [5d0740563]
- Updated dependencies [b25846562]
- Updated dependencies [12390778e]
- Updated dependencies [cba5944fc]
- Updated dependencies [a376e3ee8]
- Updated dependencies [fef852ecd]
- Updated dependencies [18f7345a6]
- Updated dependencies [5cafcf452]
- Updated dependencies [423a514c3]
- Updated dependencies [86a95ba67]
- Updated dependencies [442f34b87]
- Updated dependencies [e27cb6c45]
- Updated dependencies [184b02bef]
- Updated dependencies [0b7fd7a9d]
- Updated dependencies [60ce64aa2]
  - @backstage/plugin-scaffolder-backend@0.9.6
  - @backstage/plugin-catalog-backend@0.7.1
  - @backstage/plugin-scaffolder@0.9.0
  - @backstage/catalog-model@0.7.7
  - @backstage/core@0.7.5
  - @backstage/plugin-catalog@0.5.4
  - @backstage/plugin-api-docs@0.4.11
  - @backstage/plugin-techdocs-backend@0.7.1
  - @backstage/plugin-techdocs@0.7.2
  - @backstage/catalog-client@0.3.10
  - @backstage/plugin-tech-radar@0.3.9
  - @backstage/cli@0.6.8

## 0.3.17

### Patch Changes

- 3e7de08af: **Fully migrated the template to the new composability API**

  The `create-app` template is now fully migrated to the new composability API, see [Composability System Migration Documentation](https://backstage.io/docs/plugins/composability) for explanations and more details. The final change which is now done was to migrate the `EntityPage` from being a component built on top of the `EntityPageLayout` and several more custom components, to an element tree built with `EntitySwitch` and `EntityLayout`.

  To apply this change to an existing plugin, it is important that all plugins that you are using have already been migrated. In this case the most crucial piece is that no entity page cards of contents may require the `entity` prop, and they must instead consume the entity from context using `useEntity`.

  Since this change is large with a lot of repeated changes, we'll describe a couple of common cases rather than the entire change. If your entity pages are unchanged from the `create-app` template, you can also just bring in the latest version directly from the [template itself](https://github.com/backstage/backstage/blob/master/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx).

  The first step of the change is to change the `packages/app/src/components/catalog/EntityPage.tsx` export to `entityPage` rather than `EntityPage`. This will require an update to `App.tsx`, which is the only change we need to do outside of `EntityPage.tsx`:

  ```diff
  -import { EntityPage } from './components/catalog/EntityPage';
  +import { entityPage } from './components/catalog/EntityPage';

   <Route
     path="/catalog/:namespace/:kind/:name"
     element={<CatalogEntityPage />}
   >
  -  <EntityPage />
  +  {entityPage}
   </Route>
  ```

  The rest of the changes happen within `EntityPage.tsx`, and can be split into two broad categories, updating page components, and updating switch components.

  #### Migrating Page Components

  Let's start with an example of migrating a user page component. The following is the old code in the template:

  ```tsx
  const UserOverviewContent = ({ entity }: { entity: UserEntity }) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <UserProfileCard entity={entity} variant="gridItem" />
      </Grid>
      <Grid item xs={12} md={6}>
        <OwnershipCard entity={entity} variant="gridItem" />
      </Grid>
    </Grid>
  );

  const UserEntityPage = ({ entity }: { entity: Entity }) => (
    <EntityPageLayout>
      <EntityPageLayout.Content
        path="/*"
        title="Overview"
        element={<UserOverviewContent entity={entity as UserEntity} />}
      />
    </EntityPageLayout>
  );
  ```

  There's the main `UserEntityPage` component, and the `UserOverviewContent` component. Let's start with migrating the page contents, which we do by rendering an element rather than creating a component, as well as replace the cards with their new composability compatible variants. The new cards and content components can be identified by the `Entity` prefix.

  ```tsx
  const userOverviewContent = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <EntityUserProfileCard variant="gridItem" />
      </Grid>
      <Grid item xs={12} md={6}>
        <EntityOwnershipCard variant="gridItem" />
      </Grid>
    </Grid>
  );
  ```

  Now let's migrate the page component, again by converting it into a rendered element instead of a component, as well as replacing the use of `EntityPageLayout` with `EntityLayout`.

  ```tsx
  const userPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        {userOverviewContent}
      </EntityLayout.Route>
    </EntityLayout>
  );
  ```

  At this point the `userPage` is quite small, so throughout this migration we have inlined the page contents for all pages. This is an optional step, but may help reduce noise. The final page now looks like this:

  ```tsx
  const userPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <EntityUserProfileCard variant="gridItem" />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityOwnershipCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>
    </EntityLayout>
  );
  ```

  #### Migrating Switch Components

  Switch components were used to select what entity page components or cards to render, based on for example the kind of entity. For this example we'll focus on the root `EntityPage` switch component, but the process is the same for example for the CI/CD switcher.

  The old `EntityPage` looked like this:

  ```tsx
  export const EntityPage = () => {
    const { entity } = useEntity();

    switch (entity?.kind?.toLocaleLowerCase('en-US')) {
      case 'component':
        return <ComponentEntityPage entity={entity} />;
      case 'api':
        return <ApiEntityPage entity={entity} />;
      case 'group':
        return <GroupEntityPage entity={entity} />;
      case 'user':
        return <UserEntityPage entity={entity} />;
      case 'system':
        return <SystemEntityPage entity={entity} />;
      case 'domain':
        return <DomainEntityPage entity={entity} />;
      case 'location':
      case 'resource':
      case 'template':
      default:
        return <DefaultEntityPage entity={entity} />;
    }
  };
  ```

  In order to migrate to the composability API, we need to make this an element instead of a component, which means we're unable to keep the switch statement as is. To help with this, the catalog plugin provides an `EntitySwitch` component, which functions similar to a regular `switch` statement, which the first match being the one that is rendered. The catalog plugin also provides a number of built-in filter functions to use, such as `isKind` and `isComponentType`.

  To migrate the `EntityPage`, we convert the `switch` statement into an `EntitySwitch` element, and each `case` statement into an `EntitySwitch.Case` element. We also move over to use our new element version of the page components, with the result looking like this:

  ```tsx
  export const entityPage = (
    <EntitySwitch>
      <EntitySwitch.Case if={isKind('component')} children={componentPage} />
      <EntitySwitch.Case if={isKind('api')} children={apiPage} />
      <EntitySwitch.Case if={isKind('group')} children={groupPage} />
      <EntitySwitch.Case if={isKind('user')} children={userPage} />
      <EntitySwitch.Case if={isKind('system')} children={systemPage} />
      <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

      <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
    </EntitySwitch>
  );
  ```

  Another example is the `ComponentEntityPage`, which is migrated from this:

  ```tsx
  export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
    switch (entity?.spec?.type) {
      case 'service':
        return <ServiceEntityPage entity={entity} />;
      case 'website':
        return <WebsiteEntityPage entity={entity} />;
      default:
        return <DefaultEntityPage entity={entity} />;
    }
  };
  ```

  To this:

  ```tsx
  const componentPage = (
    <EntitySwitch>
      <EntitySwitch.Case if={isComponentType('service')}>
        {serviceEntityPage}
      </EntitySwitch.Case>

      <EntitySwitch.Case if={isComponentType('website')}>
        {websiteEntityPage}
      </EntitySwitch.Case>

      <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
    </EntitySwitch>
  );
  ```

  Note that if you want to conditionally render some piece of content, you can omit the default `EntitySwitch.Case`. If no case is matched in an `EntitySwitch`, nothing will be rendered.

- Updated dependencies [802b41b65]
- Updated dependencies [2b2b31186]
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [97b60de98]
- Updated dependencies [3f96a9d5a]
- Updated dependencies [b051e770c]
- Updated dependencies [f9c75f7a9]
- Updated dependencies [ae6250ce3]
- Updated dependencies [98dd5da71]
- Updated dependencies [b779b5fee]
  - @backstage/plugin-scaffolder-backend@0.9.5
  - @backstage/plugin-auth-backend@0.3.8
  - @backstage/core@0.7.4
  - @backstage/catalog-model@0.7.6
  - @backstage/plugin-scaffolder@0.8.2
  - @backstage/plugin-catalog-import@0.5.2
  - @backstage/test-utils@0.1.10
  - @backstage/plugin-catalog@0.5.3
  - @backstage/backend-common@0.6.2
  - @backstage/cli@0.6.7
  - @backstage/plugin-app-backend@0.3.11

## 0.3.16

### Patch Changes

- Updated dependencies [676ede643]
- Updated dependencies [2ab6f3ff0]
- Updated dependencies [0d55dcc74]
- Updated dependencies [ee5529268]
- Updated dependencies [2c29611a0]
- Updated dependencies [29e1789e1]
- Updated dependencies [aa58c01e2]
- Updated dependencies [60bddefce]
- Updated dependencies [bebd1c4fe]
- Updated dependencies [f1b2c1d2c]
- Updated dependencies [676ede643]
- Updated dependencies [9f48b548c]
- Updated dependencies [8bee6a131]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
- Updated dependencies [6b2d54fd6]
- Updated dependencies [44590510d]
- Updated dependencies [dd7fa21e2]
- Updated dependencies [164cc4c53]
- Updated dependencies [676ede643]
  - @backstage/plugin-catalog-backend@0.7.0
  - @backstage/plugin-scaffolder@0.8.1
  - @backstage/plugin-scaffolder-backend@0.9.4
  - @backstage/plugin-auth-backend@0.3.7
  - @backstage/plugin-api-docs@0.4.10
  - @backstage/plugin-github-actions@0.4.3
  - @backstage/plugin-catalog@0.5.2
  - @backstage/plugin-techdocs@0.7.1
  - @backstage/catalog-client@0.3.9
  - @backstage/plugin-catalog-import@0.5.1
  - @backstage/plugin-explore@0.3.3
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1
  - @backstage/plugin-user-settings@0.2.9

## 0.3.15

### Patch Changes

- 2c525f85e: (fix) Adds locationAnalyzer to default-app template

  The locationAnalyzer was missing from the default-app template.
  This resulted in 404 errors in newly bootstrapped backstage applications,
  when adding components without configuration.

  To fix this in an existing backstage application, the locationAnalyzer needs
  to be carried from the builder to the router in the
  `packages/backend/src/plugins/catalog.ts` file.

  ```diff
     const builder = new CatalogBuilder(env);
     const {
       entitiesCatalog,
       locationsCatalog,
       higherOrderOperation,
  +    locationAnalyzer,
     } = await builder.build();
     // ...
     return await createRouter({
       entitiesCatalog,
       locationsCatalog,
       higherOrderOperation,
  +    locationAnalyzer,
       logger: env.logger,
     });
  ```

- f88fe9dd9: Adds plugin-org and more capability to the default EntityPage to display Users, Groups and Systems.

  To update an existing application, add the org plugin:

  ```shell
  cd packages/app
  yarn add @backstage/plugin-org
  ```

  Then add the example systems locations to your `app-config.yaml`:

  ```diff
  catalog:
    rules:
  -    - allow: [Component, API, Group, User, Template, Location]
  +    - allow: [Component, System, API, Group, User, Template, Location]
    locations:
      # Backstage example components
      - type: url
        target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-components.yaml

  +    # Backstage example systems
  +    - type: url
  +      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-systems.yaml
  +
      # Backstage example APIs
  ```

  Additionally, the default app sidebar was updated to parity with the Backstage
  repo. You can see these changes in the template
  [App.tsx](https://github.com/backstage/backstage/blob/8817a87cdd5c881fbe8a43557ba7f9df0f9e3258/packages/create-app/templates/default-app/packages/app/src/App.tsx#L70)
  referencing a new `Root` component.

  Finally, compare your `packages/app/src/components/catalog/EntityPage.tsx` to
  [EntityPage](https://github.com/backstage/backstage/blob/8817a87cdd5c881fbe8a43557ba7f9df0f9e3258/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx)
  from the `@backstage/create-app` default template to pick up additional
  changes there.

- 4d248725e: Update the create-app template to use the correct latest version of `express-promise-router`.

  To apply the same change in your own repository, update all of your repo's dependencies on `express-promise-router` to `"^4.1.0"`.

- Updated dependencies [9f2e51e89]
- Updated dependencies [01ccef4c7]
- Updated dependencies [4d248725e]
- Updated dependencies [aaeb7ecf3]
- Updated dependencies [449776cd6]
- Updated dependencies [91e87c055]
- Updated dependencies [ea9d977e7]
- Updated dependencies [fcc3ada24]
- Updated dependencies [687f066e1]
- Updated dependencies [2aab54319]
- Updated dependencies [113d3d59e]
- Updated dependencies [f47e11427]
- Updated dependencies [4618774ff]
- Updated dependencies [3139f83af]
- Updated dependencies [598f5bcfb]
- Updated dependencies [c862b3f36]
- Updated dependencies [4d248725e]
- Updated dependencies [df59930b3]
  - @backstage/plugin-scaffolder-backend@0.9.3
  - @backstage/plugin-github-actions@0.4.2
  - @backstage/plugin-catalog@0.5.1
  - @backstage/plugin-techdocs@0.7.0
  - @backstage/plugin-techdocs-backend@0.7.0
  - @backstage/plugin-auth-backend@0.3.6
  - @backstage/core@0.7.3
  - @backstage/plugin-catalog-backend@0.6.7
  - @backstage/theme@0.2.5
  - @backstage/cli@0.6.6

## 0.3.14

### Patch Changes

- 3385b374b: Supply a `scmIntegrationsApiRef` from the new `@backstage/integration-react`.

  This is a new facility that plugins will start to use. You will have to add it to your local `packages/app` as described below. If this is not done, runtime errors will be seen in the frontend, on the form `No API factory available for dependency apiRef{integration.scmintegrations}`.

  In `packages/app/package.json`:

  ```diff
     "dependencies": {
  +    "@backstage/integration-react": "^0.1.1",
  ```

  In `packages/app/src/apis.ts`:

  ```diff
  +import {
  +  scmIntegrationsApiRef,
  +  ScmIntegrationsApi,
  +} from '@backstage/integration-react';

   export const apis: AnyApiFactory[] = [
  +  createApiFactory({
  +    api: scmIntegrationsApiRef,
  +    deps: { configApi: configApiRef },
  +    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  +  }),
  ```

- 9ca0e4009: use local version of lowerCase and upperCase methods
- 028339210: Adds example groups and users to the default app template.

  To apply this change in an existing application, change the following in `app-config.yaml`:

  ```diff
       - type: url
         target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-apis.yaml

  +    # Backstage example organization groups
  +    - type: url
  +      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/acme/org.yaml
  +      rules:
  +        - allow: [Group, User]
  +
       # Backstage example templates
       - type: url
         target: https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/sample-templates/react-ssr-template/template.yaml
  ```

- Updated dependencies [010aed784]
- Updated dependencies [633a31fec]
- Updated dependencies [8686eb38c]
- Updated dependencies [34e6bb409]
- Updated dependencies [b56815b40]
- Updated dependencies [147b4c5b1]
- Updated dependencies [83bfc98a3]
- Updated dependencies [7d8c4c97c]
- Updated dependencies [e7baa0d2e]
- Updated dependencies [8b4f7e42a]
- Updated dependencies [8686eb38c]
- Updated dependencies [84972540b]
- Updated dependencies [3385b374b]
- Updated dependencies [0434853a5]
- Updated dependencies [a0dacc184]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [4bc98a5b9]
- Updated dependencies [34ff49b0f]
- Updated dependencies [d2f4efc5d]
- Updated dependencies [8686eb38c]
- Updated dependencies [424742dc1]
- Updated dependencies [c8b54c370]
- Updated dependencies [4e0b5055a]
- Updated dependencies [8b5e59750]
- Updated dependencies [8686eb38c]
  - @backstage/plugin-catalog-backend@0.6.6
  - @backstage/plugin-catalog@0.5.0
  - @backstage/catalog-client@0.3.8
  - @backstage/plugin-tech-radar@0.3.8
  - @backstage/plugin-user-settings@0.2.8
  - @backstage/plugin-techdocs@0.6.2
  - @backstage/plugin-catalog-import@0.5.0
  - @backstage/plugin-techdocs-backend@0.6.5
  - @backstage/plugin-scaffolder-backend@0.9.2
  - @backstage/backend-common@0.6.0
  - @backstage/cli@0.6.5
  - @backstage/plugin-scaffolder@0.8.0
  - @backstage/config@0.1.4
  - @backstage/core@0.7.2
  - @backstage/plugin-api-docs@0.4.9
  - @backstage/plugin-explore@0.3.2
  - @backstage/plugin-github-actions@0.4.1
  - @backstage/plugin-lighthouse@0.2.14
  - @backstage/plugin-search@0.3.4
  - @backstage/plugin-auth-backend@0.3.5
  - @backstage/test-utils@0.1.9
  - @backstage/plugin-app-backend@0.3.10
  - @backstage/plugin-proxy-backend@0.2.6
  - @backstage/plugin-rollbar-backend@0.1.8

## 0.3.13

### Patch Changes

- b03fba0dc: Adds "yarn dev" command to simplify local development.

  To add the command to an existing application, first add it to the `scripts`
  section of your monorepo root `package.json` like so:

  ```diff
   "scripts": {
  +    "dev": "concurrently \"yarn start\" \"yarn start-backend\"",
       "start": "yarn workspace app start",
       "start-backend": "yarn workspace backend start",
  ```

  And then add the `concurrently` package to your monorepo, like so:

  ```sh
  yarn add concurrently@6.0.0 --dev -W
  ```

  Notes:

  - This needs to be done to the monorepo root, not your frontend or backend package.
  - The `--dev -W` will add it only to `devDependencies`, and force it to the monorepo main root.

  You can then run `yarn dev` which will start both the Backstage frontend and backend in a single window.

- Updated dependencies [13fb84244]
- Updated dependencies [9ef5a126d]
- Updated dependencies [4f3d0dce0]
- Updated dependencies [d7245b733]
- Updated dependencies [393b623ae]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [2ef5bc7ea]
- Updated dependencies [ff4d666ab]
- Updated dependencies [c532c1682]
- Updated dependencies [761698831]
- Updated dependencies [aa095e469]
- Updated dependencies [761698831]
- Updated dependencies [f98f212e4]
- Updated dependencies [9f7dc10fb]
- Updated dependencies [eabe89d38]
- Updated dependencies [93c62c755]
- Updated dependencies [2089de76b]
- Updated dependencies [c9b5c1eca]
- Updated dependencies [dc1fc92c8]
- Updated dependencies [2089de76b]
- Updated dependencies [868e4cdf2]
- Updated dependencies [02d78290a]
- Updated dependencies [a501128db]
- Updated dependencies [ca4a904f6]
- Updated dependencies [5f1b7ea35]
- Updated dependencies [5ab5864f6]
- Updated dependencies [4202807bb]
- Updated dependencies [2e57922de]
  - @backstage/plugin-github-actions@0.4.0
  - @backstage/plugin-catalog-backend@0.6.5
  - @backstage/plugin-catalog@0.4.2
  - @backstage/backend-common@0.5.6
  - @backstage/plugin-app-backend@0.3.9
  - @backstage/plugin-scaffolder-backend@0.9.1
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7
  - @backstage/core@0.7.1
  - @backstage/plugin-techdocs-backend@0.6.4
  - @backstage/plugin-techdocs@0.6.1
  - @backstage/plugin-auth-backend@0.3.4
  - @backstage/plugin-scaffolder@0.7.1
  - @backstage/theme@0.2.4
  - @backstage/plugin-explore@0.3.1
  - @backstage/cli@0.6.4

## 0.3.12

### Patch Changes

- f71589800: The api-docs plugin has been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page.

  If you want to have a button that links to the scaffolder plugin from the API explorer, apply the following changes to `packages/app/src/App.tsx`:

  ```diff
  + import { apiDocsPlugin } from '@backstage/plugin-api-docs';
    import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

    const app = createApp({
      // ...
      bindRoutes({ bind }) {
  +     bind(apiDocsPlugin.externalRoutes, {
  +       createComponent: scaffolderPlugin.routes.root,
  +     });
      },
    });
  ```

  If you choose to not bind the routes, the button to create new APIs is not displayed.

- 7a1b2ba0e: Migrated away from using deprecated routes and router components at top-level in the app, and instead use routable extension pages.

  To apply this change to an existing app, make the following changes to `packages/app/src/App.tsx`:

  Update imports and remove the usage of the deprecated `app.getRoutes()`.

```diff
- import { Router as DocsRouter } from '@backstage/plugin-techdocs';
+ import { TechdocsPage } from '@backstage/plugin-techdocs';
  import { CatalogImportPage } from '@backstage/plugin-catalog-import';
- import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';
- import { SearchPage as SearchRouter } from '@backstage/plugin-search';
- import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
+ import { TechRadarPage } from '@backstage/plugin-tech-radar';
+ import { SearchPage } from '@backstage/plugin-search';
+ import { UserSettingsPage } from '@backstage/plugin-user-settings';
+ import { ApiExplorerPage } from '@backstage/plugin-api-docs';
  import { EntityPage } from './components/catalog/EntityPage';
  import { scaffolderPlugin, ScaffolderPage } from '@backstage/plugin-scaffolder';


  const AppProvider = app.getProvider();
  const AppRouter = app.getRouter();
- const deprecatedAppRoutes = app.getRoutes();
```

As well as update or add the following routes:

```diff
   <Route path="/create" element={<ScaffolderPage />} />
-  <Route path="/docs" element={<DocsRouter />} />
+  <Route path="/docs" element={<TechdocsPage />} />
+  <Route path="/api-docs" element={<ApiExplorerPage />} />
   <Route
     path="/tech-radar"
-    element={<TechRadarRouter width={1500} height={800} />}
+    element={<TechRadarPage width={1500} height={800} />}
   />
   <Route path="/catalog-import" element={<CatalogImportPage />} />
-  <Route
-    path="/search"
-    element={<SearchRouter/>}
-  />
-  <Route path="/settings" element={<SettingsRouter />} />
-  {deprecatedAppRoutes}
+  <Route path="/search" element={<SearchPage />} />
+  <Route path="/settings" element={<UserSettingsPage />} />
```

If you have added additional plugins with registered routes or are using `Router` components from other plugins, these should be migrated to use the `*Page` components as well. See [this commit](https://github.com/backstage/backstage/commit/abd655e42d4ed416b70848ffdb1c4b99d189f13b) for more examples of how to migrate.

For more information and the background to this change, see the [composability system migration docs](https://backstage.io/docs/plugins/composability).

- 415a3a42d: Updated the default `App` test to work better on Windows.

  To apply this change to an existing app, replace the `process.env.APP_CONFIG` definition in `packages/app/src/App.test.tsx` with the following:

  ```ts
  process.env = {
    NODE_ENV: 'test',
    APP_CONFIG: [
      {
        data: {
          app: { title: 'Test' },
          backend: { baseUrl: 'http://localhost:7000' },
          techdocs: {
            storageUrl: 'http://localhost:7000/api/techdocs/static/docs',
          },
        },
        context: 'test',
      },
    ] as any,
  };
  ```

- Updated dependencies [b2a5320a4]
- Updated dependencies [12d8f27a6]
- Updated dependencies [507513fed]
- Updated dependencies [52b5bc3e2]
- Updated dependencies [ecdd407b1]
- Updated dependencies [32a003973]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [1987c9341]
- Updated dependencies [f31b76b44]
- Updated dependencies [15eee03bc]
- Updated dependencies [f43192207]
- Updated dependencies [cfc83cac1]
- Updated dependencies [8adb48df4]
- Updated dependencies [bc327dc42]
- Updated dependencies [2386de1d3]
- Updated dependencies [9ce68b677]
- Updated dependencies [10362e9eb]
- Updated dependencies [e37d2de99]
- Updated dependencies [813c6a4f2]
- Updated dependencies [11c6208fe]
- Updated dependencies [8106c9528]
- Updated dependencies [05183f202]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [f71589800]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [d4f0a1406]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [d0ed25196]
- Updated dependencies [4c049a1a1]
- Updated dependencies [96ccc8f69]
- Updated dependencies [3af994c81]
- Updated dependencies [b33e553b2]
- Updated dependencies [04667f571]
- Updated dependencies [b93538acc]
- Updated dependencies [8871e7523]
- Updated dependencies [dbea11072]
  - @backstage/plugin-circleci@0.2.11
  - @backstage/plugin-github-actions@0.3.5
  - @backstage/plugin-scaffolder@0.7.0
  - @backstage/plugin-scaffolder-backend@0.9.0
  - @backstage/cli@0.6.3
  - @backstage/plugin-techdocs-backend@0.6.3
  - @backstage/plugin-catalog-backend@0.6.4
  - @backstage/plugin-api-docs@0.4.8
  - @backstage/plugin-catalog@0.4.1
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5
  - @backstage/plugin-proxy-backend@0.2.5
  - @backstage/plugin-auth-backend@0.3.3
  - @backstage/plugin-explore@0.3.0
  - @backstage/plugin-techdocs@0.6.0
  - @backstage/plugin-catalog-import@0.4.3
  - @backstage/core@0.7.0
  - @backstage/plugin-lighthouse@0.2.13
  - @backstage/plugin-search@0.3.3
  - @backstage/plugin-tech-radar@0.3.7
  - @backstage/plugin-user-settings@0.2.7

## 0.3.11

### Patch Changes

- 4594f7efc: Add the google analytics scripts in the `index.html` template for new applications.

  To apply this change to an existing application, change the following in `packages\app\public\index.html`:

  ```diff
      <title><%= app.title %></title>

  +    <% if (app.googleAnalyticsTrackingId && typeof app.googleAnalyticsTrackingId
  +    === 'string') { %>
  +    <script
  +      async
  +      src="https://www.googletagmanager.com/gtag/js?id=<%= app.googleAnalyticsTrackingId %>"
  +    ></script>
  +    <script>
  +      window.dataLayer = window.dataLayer || [];
  +      function gtag() {
  +        dataLayer.push(arguments);
  +      }
  +      gtag('js', new Date());
  +
  +      gtag('config', '<%= app.googleAnalyticsTrackingId %>');
  +    </script>
  +    <% } %>
    </head>
  ```

- 08fa2176a: **BREAKING CHANGE**

  The Scaffolder and Catalog plugins have been migrated to partially require use of the [new composability API](https://backstage.io/docs/plugins/composability). The Scaffolder used to register its pages using the deprecated route registration plugin API, but those registrations have been removed. This means you now need to add the Scaffolder plugin page to the app directly.

  The Catalog plugin has also been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the catalog plugin to use the new extension components, as well as bind the external route.

  Apply the following changes to `packages/app/src/App.tsx`:

  ```diff
  -import { Router as CatalogRouter } from '@backstage/plugin-catalog';
  +import {
  +  catalogPlugin,
  +  CatalogIndexPage,
  +  CatalogEntityPage,
  +} from '@backstage/plugin-catalog';
  +import { scaffolderPlugin, ScaffolderPage } from '@backstage/plugin-scaffolder';

  # The following addition to the app config allows the catalog plugin to link to the
  # component creation page, i.e. the scaffolder. You can chose a different target if you want to.
   const app = createApp({
     apis,
     plugins: Object.values(plugins),
  +  bindRoutes({ bind }) {
  +    bind(catalogPlugin.externalRoutes, {
  +      createComponent: scaffolderPlugin.routes.root,
  +    });
  +  }
   });

  # Apply these changes within FlatRoutes. It is important to have migrated to using FlatRoutes
  # for this to work, if you haven't done that yet, see the previous entries in this changelog.
  -  <Route
  -    path="/catalog"
  -    element={<CatalogRouter EntityPage={EntityPage} />}
  -  />
  +  <Route path="/catalog" element={<CatalogIndexPage />} />
  +  <Route
  +    path="/catalog/:namespace/:kind/:name"
  +    element={<CatalogEntityPage />}
  +  >
  +    <EntityPage />
  +  </Route>
     <Route path="/docs" element={<DocsRouter />} />
  +  <Route path="/create" element={<ScaffolderPage />} />
  ```

  The scaffolder has been redesigned to be horizontally scalable and to persistently store task state and execution logs in the database. Component registration has moved from the frontend into a separate registration step executed by the `TaskWorker`. This requires that a `CatalogClient` is passed to the scaffolder backend instead of the old `CatalogEntityClient`.

  The default catalog client comes from the `@backstage/catalog-client`, which you need to add as a dependency in `packages/backend/package.json`.

  Once the dependency has been added, apply the following changes to`packages/backend/src/plugins/scaffolder.ts`:

  ```diff
   import {
     CookieCutter,
     createRouter,
     Preparers,
     Publishers,
     CreateReactAppTemplater,
     Templaters,
  -  CatalogEntityClient,
   } from '@backstage/plugin-scaffolder-backend';
  +import { CatalogClient } from '@backstage/catalog-client';

   const discovery = SingleHostDiscovery.fromConfig(config);
  -const entityClient = new CatalogEntityClient({ discovery });
  +const catalogClient = new CatalogClient({ discoveryApi: discovery })

   return await createRouter({
     preparers,
     templaters,
     publishers,
     logger,
     config,
     dockerClient,
  -  entityClient,
     database,
  +  catalogClient,
   });
  ```

  See the `@backstage/scaffolder-backend` changelog for more information about this change.

- Updated dependencies [ec504e7b4]
- Updated dependencies [3a58084b6]
- Updated dependencies [a5f42cf66]
- Updated dependencies [e488f0502]
- Updated dependencies [e799e74d4]
- Updated dependencies [dc12852c9]
- Updated dependencies [a5f42cf66]
- Updated dependencies [a8953a9c9]
- Updated dependencies [f37992797]
- Updated dependencies [347137ccf]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [d6593abe6]
- Updated dependencies [bad21a085]
- Updated dependencies [e8e35fb5f]
- Updated dependencies [9615e68fb]
- Updated dependencies [e780e119c]
- Updated dependencies [437bac549]
- Updated dependencies [9f2b3a26e]
- Updated dependencies [49f9b7346]
- Updated dependencies [1c06cb312]
- Updated dependencies [968b588f7]
- Updated dependencies [3a58084b6]
- Updated dependencies [2499f6cde]
- Updated dependencies [5469a9761]
- Updated dependencies [a1f5e6545]
- Updated dependencies [60d1bc3e7]
- Updated dependencies [2c1f2a7c2]
- Updated dependencies [6266ddd11]
  - @backstage/plugin-auth-backend@0.3.2
  - @backstage/core@0.6.3
  - @backstage/plugin-scaffolder@0.6.0
  - @backstage/plugin-scaffolder-backend@0.8.0
  - @backstage/test-utils@0.1.8
  - @backstage/plugin-catalog@0.4.0
  - @backstage/plugin-catalog-import@0.4.2
  - @backstage/plugin-techdocs@0.5.8
  - @backstage/plugin-techdocs-backend@0.6.2
  - @backstage/plugin-explore@0.2.7
  - @backstage/plugin-api-docs@0.4.7
  - @backstage/catalog-model@0.7.2
  - @backstage/cli@0.6.2
  - @backstage/plugin-tech-radar@0.3.6
  - @backstage/plugin-app-backend@0.3.8
  - @backstage/plugin-catalog-backend@0.6.3
  - @backstage/config@0.1.3
  - @backstage/plugin-circleci@0.2.10
  - @backstage/plugin-github-actions@0.3.4
  - @backstage/plugin-lighthouse@0.2.12
  - @backstage/plugin-search@0.3.2

## 0.3.10

### Patch Changes

- d50e9b81e: Updated docker build to use `backstage-cli backend:bundle` instead of `backstage-cli backend:build-image`.

  To apply this change to an existing application, change the following in `packages/backend/package.json`:

  ```diff
  -  "build": "backstage-cli backend:build",
  -  "build-image": "backstage-cli backend:build-image --build --tag backstage",
  +  "build": "backstage-cli backend:bundle",
  +  "build-image": "docker build ../.. -f Dockerfile --tag backstage",
  ```

  Note that the backend build is switched to `backend:bundle`, and the `build-image` script simply calls `docker build`. This means the `build-image` script no longer builds all packages, so you have to run `yarn build` in the root first.

  In order to work with the new build method, the `Dockerfile` at `packages/backend/Dockerfile` has been updated with the following contents:

  ```dockerfile
  # This dockerfile builds an image for the backend package.
  # It should be executed with the root of the repo as docker context.
  #
  # Before building this image, be sure to have run the following commands in the repo root:
  #
  # yarn install
  # yarn tsc
  # yarn build
  #
  # Once the commands have been run, you can build the image using `yarn build-image`

  FROM node:14-buster-slim

  WORKDIR /app

  # Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
  # The skeleton contains the package.json of each package in the monorepo,
  # and along with yarn.lock and the root package.json, that's enough to run yarn install.
  ADD yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./

  RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

  # Then copy the rest of the backend bundle, along with any other files we might want.
  ADD packages/backend/dist/bundle.tar.gz app-config.yaml ./

  CMD ["node", "packages/backend", "--config", "app-config.yaml"]
  ```

  Note that the base image has been switched from `node:14-buster` to `node:14-buster-slim`, significantly reducing the image size. This is enabled by the removal of the `nodegit` dependency, so if you are still using this in your project you will have to stick with the `node:14-buster` base image.

  A `.dockerignore` file has been added to the root of the repo as well, in order to keep the docker context upload small. It lives in the root of the repo with the following contents:

  ```gitignore
  .git
  node_modules
  packages
  !packages/backend/dist
  plugins
  ```

- 532bc0ec0: Upgrading to lerna@4.0.0.
- Updated dependencies [16fb1d03a]
- Updated dependencies [92f01d75c]
- Updated dependencies [6c4a76c59]
- Updated dependencies [32a950409]
- Updated dependencies [491f3a0ec]
- Updated dependencies [f10950bd2]
- Updated dependencies [914c89b13]
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [257a753ff]
- Updated dependencies [d872f662d]
- Updated dependencies [edbc27bfd]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
- Updated dependencies [9337f509d]
- Updated dependencies [0ada34a0f]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [d9687c524]
- Updated dependencies [53b69236d]
- Updated dependencies [29c8bcc53]
- Updated dependencies [3600ac3b0]
- Updated dependencies [07e226872]
- Updated dependencies [b0a41c707]
- Updated dependencies [f62e7abe5]
- Updated dependencies [a341a8716]
- Updated dependencies [96f378d10]
- Updated dependencies [532bc0ec0]
- Updated dependencies [688b73110]
  - @backstage/backend-common@0.5.4
  - @backstage/plugin-auth-backend@0.3.1
  - @backstage/plugin-scaffolder@0.5.1
  - @backstage/plugin-catalog@0.3.2
  - @backstage/core@0.6.2
  - @backstage/cli@0.6.1
  - @backstage/plugin-user-settings@0.2.6
  - @backstage/plugin-scaffolder-backend@0.7.1
  - @backstage/plugin-api-docs@0.4.6
  - @backstage/plugin-catalog-import@0.4.1
  - @backstage/plugin-github-actions@0.3.3
  - @backstage/plugin-lighthouse@0.2.11
  - @backstage/plugin-techdocs-backend@0.6.1
  - @backstage/plugin-catalog-backend@0.6.2
  - @backstage/plugin-circleci@0.2.9
  - @backstage/plugin-explore@0.2.6
  - @backstage/plugin-search@0.3.1
  - @backstage/plugin-techdocs@0.5.7

## 0.3.9

### Patch Changes

- 615103a63: Pass on plugin database management instance that is now required by the scaffolder plugin.

  To apply this change to an existing application, add the following to `src/plugins/scaffolder.ts`:

  ```diff
  export default async function createPlugin({
    logger,
    config,
  +  database,
  }: PluginEnvironment) {

  // ...omitted...

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      entityClient,
  +    database,
    });
  }
  ```

- 30e200d12: `@backstage/plugin-catalog-import` has been refactored, so the `App.tsx` of the backstage apps need to be updated:

  ```diff
  // packages/app/src/App.tsx

       <Route
         path="/catalog-import"
  -      element={<CatalogImportPage catalogRouteRef={catalogRouteRef} />}
  +      element={<CatalogImportPage />}
       />
  ```

- f4b576d0e: TechDocs: Add comments about migrating away from basic setup in app-config.yaml
- Updated dependencies [753bb4c40]
- Updated dependencies [1deb31141]
- Updated dependencies [6ed2b47d6]
- Updated dependencies [77ad0003a]
- Updated dependencies [6b26c9f41]
- Updated dependencies [b3f0c3811]
- Updated dependencies [d2441aee3]
- Updated dependencies [727f0deec]
- Updated dependencies [fb53eb7cb]
- Updated dependencies [07bafa248]
- Updated dependencies [ca559171b]
- Updated dependencies [ffffea8e6]
- Updated dependencies [f5e564cd6]
- Updated dependencies [f3fbfb452]
- Updated dependencies [615103a63]
- Updated dependencies [68dd79d83]
- Updated dependencies [84364b35c]
- Updated dependencies [41af18227]
- Updated dependencies [82b2c11b6]
- Updated dependencies [1df75733e]
- Updated dependencies [965e200c6]
- Updated dependencies [b51ee6ece]
- Updated dependencies [e5da858d7]
- Updated dependencies [9230d07e7]
- Updated dependencies [f5f45744e]
- Updated dependencies [0fe8ff5be]
- Updated dependencies [5a5163519]
- Updated dependencies [82b2c11b6]
- Updated dependencies [8f3443427]
- Updated dependencies [08142b256]
- Updated dependencies [08142b256]
- Updated dependencies [b51ee6ece]
- Updated dependencies [804502a5c]
  - @backstage/plugin-catalog-import@0.4.0
  - @backstage/plugin-auth-backend@0.3.0
  - @backstage/plugin-catalog@0.3.1
  - @backstage/plugin-scaffolder@0.5.0
  - @backstage/plugin-scaffolder-backend@0.7.0
  - @backstage/plugin-catalog-backend@0.6.1
  - @backstage/plugin-circleci@0.2.8
  - @backstage/plugin-search@0.3.0
  - @backstage/plugin-app-backend@0.3.7
  - @backstage/backend-common@0.5.3
  - @backstage/plugin-api-docs@0.4.5
  - @backstage/plugin-lighthouse@0.2.10
  - @backstage/plugin-techdocs@0.5.6
  - @backstage/test-utils@0.1.7
  - @backstage/plugin-github-actions@0.3.2
  - @backstage/plugin-explore@0.2.5
  - @backstage/plugin-techdocs-backend@0.6.0
  - @backstage/core@0.6.1
  - @backstage/plugin-tech-radar@0.3.5

## 0.3.8

### Patch Changes

- 019fe39a0: **BREAKING CHANGE**: The `useEntity` hook has been moved from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
  To apply this change to an existing app, add `@backstage/plugin-catalog-react` to your dependencies in `packages/app/package.json`, and update
  the import inside `packages/app/src/components/catalog/EntityPage.tsx` as well as any other places you were using `useEntity` or any other functions that were moved to `@backstage/plugin-catalog-react`.
- 436ca3f62: Remove techdocs.requestUrl and techdocs.storageUrl from app-config.yaml
- Updated dependencies [ceef4dd89]
- Updated dependencies [720149854]
- Updated dependencies [c777df180]
- Updated dependencies [398e1f83e]
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [b712841d6]
- Updated dependencies [a5628df40]
- Updated dependencies [2430ee7c2]
- Updated dependencies [3149bfe63]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [bc5082a00]
- Updated dependencies [6e612ce25]
- Updated dependencies [e44925723]
- Updated dependencies [b37501a3d]
- Updated dependencies [a26668913]
- Updated dependencies [025e122c3]
- Updated dependencies [e9aab60c7]
- Updated dependencies [21e624ba9]
- Updated dependencies [19fe61c27]
- Updated dependencies [e9aab60c7]
- Updated dependencies [da9f53c60]
- Updated dependencies [a08c4b0b0]
- Updated dependencies [24e47ef1e]
- Updated dependencies [bc5082a00]
- Updated dependencies [b37501a3d]
- Updated dependencies [90c8f20b9]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [529d16d27]
- Updated dependencies [54c7d02f7]
- Updated dependencies [de98c32ed]
- Updated dependencies [806929fe2]
- Updated dependencies [019fe39a0]
- Updated dependencies [cdea0baf1]
- Updated dependencies [019fe39a0]
- Updated dependencies [11cb5ef94]
  - @backstage/plugin-catalog-import@0.3.7
  - @backstage/plugin-scaffolder@0.4.2
  - @backstage/plugin-techdocs-backend@0.5.5
  - @backstage/cli@0.6.0
  - @backstage/core@0.6.0
  - @backstage/plugin-api-docs@0.4.4
  - @backstage/plugin-catalog@0.3.0
  - @backstage/theme@0.2.3
  - @backstage/plugin-lighthouse@0.2.9
  - @backstage/backend-common@0.5.2
  - @backstage/plugin-catalog-backend@0.6.0
  - @backstage/plugin-techdocs@0.5.5
  - @backstage/plugin-user-settings@0.2.5
  - @backstage/catalog-model@0.7.1
  - @backstage/plugin-scaffolder-backend@0.6.0
  - @backstage/plugin-app-backend@0.3.6
  - @backstage/plugin-tech-radar@0.3.4
  - @backstage/plugin-explore@0.2.4
  - @backstage/plugin-circleci@0.2.7
  - @backstage/plugin-github-actions@0.3.1
  - @backstage/plugin-search@0.2.7
  - @backstage/test-utils@0.1.6
  - @backstage/plugin-auth-backend@0.2.12
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7

## 0.3.7

### Patch Changes

- Updated dependencies [26a3a6cf0]
- Updated dependencies [12a56cdfe]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
- Updated dependencies [ef7957be4]
- Updated dependencies [0b1182346]
- Updated dependencies [d7b1d317f]
- Updated dependencies [a91aa6bf2]
- Updated dependencies [39b05b9ae]
- Updated dependencies [4eaa06057]
  - @backstage/backend-common@0.5.1
  - @backstage/plugin-scaffolder-backend@0.5.2
  - @backstage/cli@0.5.0
  - @backstage/plugin-catalog@0.2.14
  - @backstage/plugin-catalog-backend@0.5.5
  - @backstage/plugin-catalog-import@0.3.6
  - @backstage/plugin-scaffolder@0.4.1
  - @backstage/plugin-auth-backend@0.2.12
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/test-utils@0.1.6
  - @backstage/theme@0.2.2
  - @backstage/plugin-api-docs@0.4.3
  - @backstage/plugin-app-backend@0.3.5
  - @backstage/plugin-circleci@0.2.6
  - @backstage/plugin-explore@0.2.3
  - @backstage/plugin-github-actions@0.3.0
  - @backstage/plugin-lighthouse@0.2.8
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7
  - @backstage/plugin-search@0.2.6
  - @backstage/plugin-tech-radar@0.3.3
  - @backstage/plugin-techdocs@0.5.4
  - @backstage/plugin-techdocs-backend@0.5.4
  - @backstage/plugin-user-settings@0.2.4

## 0.3.6

### Patch Changes

- d3947caf3: Fix accidental dependency on non-existent dependencies.
- Updated dependencies [a4e636c8f]
- Updated dependencies [099c5cf4f]
- Updated dependencies [0ea002378]
- Updated dependencies [a08db734c]
  - @backstage/plugin-catalog@0.2.13
  - @backstage/plugin-scaffolder-backend@0.5.1

## 0.3.6

### Minor Changes

- ed6baab66: - Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you receive deprecation warnings your config should change like the following:

  ```yaml
  scaffolder:
    github:
      token:
        $env: GITHUB_TOKEN
      visibility: public
  ```

  To something that looks like this:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
  scaffolder:
    github:
      visibility: public
  ```

  You can also configure multiple different hosts under the `integration` config like the following:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
      - host: ghe.mycompany.com
        token:
          $env: GITHUB_ENTERPRISE_TOKEN
  ```

  This of course is the case for all the providers respectively.

  - Adding support for cross provider scaffolding, you can now create repositories in for example Bitbucket using a template residing in GitHub.

  - Fix GitLab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

  - The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

  `backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was GitHub for example.

### Patch Changes

- a284f5bc1: Due to a package name change from `@kyma-project/asyncapi-react` to
  `@asyncapi/react-component` the jest configuration in the root `package.json`
  has to be updated:

  ```diff
     "jest": {
       "transformModules": [
  -      "@kyma-project/asyncapi-react
  +      "@asyncapi/react-component"
       ]
     }
  ```

- 89278acab: Migrate to using `FlatRoutes` from `@backstage/core` for the root app routes.

  This is the first step in migrating applications as mentioned here: https://backstage.io/docs/plugins/composability#porting-existing-apps.

  To apply this change to an existing app, switch out the `Routes` component from `react-router` to `FlatRoutes` from `@backstage/core`.
  This also allows you to remove any `/*` suffixes on the route paths. For example:

  ```diff
  import {
     OAuthRequestDialog,
     SidebarPage,
     createRouteRef,
  +  FlatRoutes,
   } from '@backstage/core';
   import { AppSidebar } from './sidebar';
  -import { Route, Routes, Navigate } from 'react-router';
  +import { Route, Navigate } from 'react-router';
   import { Router as CatalogRouter } from '@backstage/plugin-catalog';
  ...
           <AppSidebar />
  -        <Routes>
  +        <FlatRoutes>
  ...
             <Route
  -            path="/catalog/*"
  +            path="/catalog"
               element={<CatalogRouter EntityPage={EntityPage} />}
             />
  -          <Route path="/docs/*" element={<DocsRouter />} />
  +          <Route path="/docs" element={<DocsRouter />} />
  ...
             <Route path="/settings" element={<SettingsRouter />} />
  -        </Routes>
  +        </FlatRoutes>
         </SidebarPage>
  ```

- 26d3b24f3: fix routing and config for user-settings plugin

  To make the corresponding change in your local app, add the following in your App.tsx

  ```
  import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
  ...
  <Route path="/settings" element={<SettingsRouter />} />
  ```

  and the following to your plugins.ts:

  ```
  export { plugin as UserSettings } from '@backstage/plugin-user-settings';
  ```

- 92dbbcedd: Add `*-credentials.yaml` to gitignore to prevent accidental commits of sensitive credential information.

  To apply this change to an existing installation, add these lines to your `.gitignore`

  ```gitignore
  # Sensitive credentials
  *-credentials.yaml
  ```

- d176671d1: use `fromConfig` for all scaffolder helpers, and use the url protocol for app-config location entries.

  To apply this change to your local installation, replace the contents of your `packages/backend/src/plugins/scaffolder.ts` with the following contents:

  ```ts
  import {
    CookieCutter,
    createRouter,
    Preparers,
    Publishers,
    CreateReactAppTemplater,
    Templaters,
    CatalogEntityClient,
  } from '@backstage/plugin-scaffolder-backend';
  import { SingleHostDiscovery } from '@backstage/backend-common';
  import type { PluginEnvironment } from '../types';
  import Docker from 'dockerode';

  export default async function createPlugin({
    logger,
    config,
  }: PluginEnvironment) {
    const cookiecutterTemplater = new CookieCutter();
    const craTemplater = new CreateReactAppTemplater();
    const templaters = new Templaters();
    templaters.register('cookiecutter', cookiecutterTemplater);
    templaters.register('cra', craTemplater);

    const preparers = await Preparers.fromConfig(config, { logger });
    const publishers = await Publishers.fromConfig(config, { logger });

    const dockerClient = new Docker();

    const discovery = SingleHostDiscovery.fromConfig(config);
    const entityClient = new CatalogEntityClient({ discovery });

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      entityClient,
    });
  }
  ```

  This will ensure that the `scaffolder-backend` package can add handlers for the `url` protocol which is becoming the standard when registering entities in the `catalog`

- 9d1d1138e: Ensured that versions bumps of packages used in the app template trigger a release of this package when needed.
- db05f7a35: Remove the `@types/helmet` dev dependency from the app template. This
  dependency is now unused as the package `helmet` brings its own types.

  To update your existing app, simply remove the `@types/helmet` dependency from
  the `package.json` of your backend package.

- Updated dependencies [def2307f3]
- Updated dependencies [46bba09ea]
- Updated dependencies [efd6ef753]
- Updated dependencies [0b135e7e0]
- Updated dependencies [593632f07]
- Updated dependencies [2b514d532]
- Updated dependencies [318a6af9f]
- Updated dependencies [33846acfc]
- Updated dependencies [294a70cab]
- Updated dependencies [b604a9d41]
- Updated dependencies [ac7be581a]
- Updated dependencies [a187b8ad0]
- Updated dependencies [0ea032763]
- Updated dependencies [8855f61f6]
- Updated dependencies [5345a1f98]
- Updated dependencies [ed6baab66]
- Updated dependencies [ad838c02f]
- Updated dependencies [f04db53d7]
- Updated dependencies [a5e27d5c1]
- Updated dependencies [0643a3336]
- Updated dependencies [debf359b5]
- Updated dependencies [a2291d7cc]
- Updated dependencies [f9ba00a1c]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/plugin-catalog-backend@0.5.4
  - @backstage/plugin-github-actions@0.3.0
  - @backstage/core@0.5.0
  - @backstage/backend-common@0.5.0
  - @backstage/plugin-catalog@0.2.12
  - @backstage/plugin-catalog-import@0.3.5
  - @backstage/cli@0.4.7
  - @backstage/plugin-api-docs@0.4.3
  - @backstage/plugin-scaffolder@0.4.0
  - @backstage/plugin-scaffolder-backend@0.5.0
  - @backstage/plugin-techdocs@0.5.4
  - @backstage/plugin-techdocs-backend@0.5.4
  - @backstage/plugin-auth-backend@0.2.11
  - @backstage/plugin-lighthouse@0.2.8
  - @backstage/plugin-circleci@0.2.6
  - @backstage/plugin-search@0.2.6
  - @backstage/plugin-explore@0.2.3
  - @backstage/plugin-tech-radar@0.3.3
  - @backstage/plugin-user-settings@0.2.4
  - @backstage/plugin-app-backend@0.3.4
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7

## 0.3.5

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- cc068c0d6: Bump the gitbeaker dependencies to 28.x.

  To update your own installation, go through the `package.json` files of all of
  your packages, and ensure that all dependencies on `@gitbeaker/node` or
  `@gitbeaker/core` are at version `^28.0.2`. Then run `yarn install` at the root
  of your repo.

## 0.3.4

### Patch Changes

- 643dcec7c: noop release for create-app to force re-deploy

## 0.3.3

### Patch Changes

- bd9c6719f: Bumping the version for `create-app` so that we can use the latest versions of internal packages and rebuild the version which is passed to the package.json

## 0.3.2

### Patch Changes

- c2b52d9c5: Replace `register-component` plugin with new `catalog-import` plugin
- fc6839f13: Bump `sqlite3` to v5.

  To apply this change to an existing app, change the version of `sqlite3` in the `dependencies` of `packages/backend/package.json`:

  ```diff
       "pg": "^8.3.0",
  -    "sqlite3": "^4.2.0",
  +    "sqlite3": "^5.0.0",
       "winston": "^3.2.1"
  ```

  Note that the `sqlite3` dependency may not be preset if you chose to use PostgreSQL when creating the app.

- 8d68e4cdc: Removed the Circle CI sidebar item, since the target page does not exist.

  To apply this change to an existing app, remove `"CircleCI"` sidebar item from `packages/app/src/sidebar.tsx`, and the `BuildIcon` import if it is unused.

- 1773a5182: Removed lighthouse plugin from the default set up plugins, as it requires a separate Backend to function.

  To apply this change to an existing app, remove the following:

  1. The `lighthouse` block from `app-config.yaml`.
  2. The `@backstage/plugin-lighthouse` dependency from `packages/app/package.json`.
  3. The `@backstage/plugin-lighthouse` re-export from `packages/app/src/plugins.ts`.
  4. The Lighthouse sidebar item from `packages/app/src/sidebar.tsx`, and the `RuleIcon` import if it is unused.

## 0.3.1

### Patch Changes

- 4e0e3b1bf: Add missing `yarn clean` for app.

  For users with existing Backstage installations, add the following under the `scripts` section in `packages/app/package.json`, after the "lint" entry:

  ```json
  "clean": "backstage-cli clean",
  ```

  This will add the missing `yarn clean` for the generated frontend.

- 352a6581f: Added `"start-backend"` script to root `package.json`.

  To apply this change to an existing app, add the following script to the root `package.json`:

  ```json
  "start-backend": "yarn workspace backend start"
  ```

## 0.3.0

### Minor Changes

- 0101c7a16: Add search plugin to default template for CLI created apps

### Patch Changes

- a8573e53b: techdocs-backend: Simplified file, removing individual preparers and generators.
  techdocs-backend: UrlReader is now available to use in preparers.

  In your Backstage app, `packages/backend/plugins/techdocs.ts` file has now been simplified,
  to remove registering individual preparers and generators.

  Please update the file when upgrading the version of `@backstage/plugin-techdocs-backend` package.

  ```typescript
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  const generators = await Generators.fromConfig(config, {
    logger,
  });

  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });
  ```

  You should be able to remove unnecessary imports, and just do

  ```typescript
  import {
    createRouter,
    Preparers,
    Generators,
    Publisher,
  } from '@backstage/plugin-techdocs-backend';
  ```

## 0.2.5

### Patch Changes

- 2783ec018: In the techdocs-backend plugin (`packages/backend/src/plugins/techdocs.ts`), create a publisher using

  ```
    const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  instead of

  ```
    const publisher = new LocalPublish(logger, discovery);
  ```

  An instance of `publisher` can either be a local filesystem publisher or a Google Cloud Storage publisher.

  Read more about the configs here https://backstage.io/docs/features/techdocs/configuration
  (You will also have to update `techdocs.storage.type` to `local` or `googleGcs`. And `techdocs.builder` to either `local` or `external`.)

## 0.2.4

### Patch Changes

- 94348441e: Add `"files": ["dist"]` to both app and backend packages. This ensures that packaged versions of these packages do not contain unnecessary files.

  To apply this change to an existing app, add the following to `packages/app/package.json` and `packages/backend/package.json`:

  ```json
    "files": [
      "dist"
    ]
  ```

- cb5fc4b29: Adjust template to the latest changes in the `api-docs` plugin.

  ## Template Changes

  While updating to the latest `api-docs` plugin, the following changes are
  necessary for the `create-app` template in your
  `app/src/components/catalog/EntityPage.tsx`. This adds:

  - A custom entity page for API entities
  - Changes the API tab to include the new `ConsumedApisCard` and
    `ProvidedApisCard` that link to the API entity.

  ```diff
   import {
  +  ApiDefinitionCard,
  -  Router as ApiDocsRouter,
  +  ConsumedApisCard,
  +  ProvidedApisCard,
  +  ConsumedApisCard,
  +  ConsumingComponentsCard,
  +  ProvidedApisCard,
  +  ProvidingComponentsCard
   } from '@backstage/plugin-api-docs';

  ...

  +const ComponentApisContent = ({ entity }: { entity: Entity }) => (
  +  <Grid container spacing={3} alignItems="stretch">
  +    <Grid item md={6}>
  +      <ProvidedApisCard entity={entity} />
  +    </Grid>
  +    <Grid item md={6}>
  +      <ConsumedApisCard entity={entity} />
  +    </Grid>
  +  </Grid>
  +);

   const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
     <EntityPageLayout>
       <EntityPageLayout.Content
        path="/"
        title="Overview"
        element={<OverviewContent entity={entity} />}
      />
      <EntityPageLayout.Content
        path="/ci-cd/*"
        title="CI/CD"
        element={<CICDSwitcher entity={entity} />}
      />
      <EntityPageLayout.Content
        path="/api/*"
        title="API"
  -     element={<ApiDocsRouter entity={entity} />}
  +     element={<ComponentApisContent entity={entity} />}
      />
  ...

  -export const EntityPage = () => {
  -  const { entity } = useEntity();
  -  switch (entity?.spec?.type) {
  -    case 'service':
  -      return <ServiceEntityPage entity={entity} />;
  -    case 'website':
  -      return <WebsiteEntityPage entity={entity} />;
  -    default:
  -      return <DefaultEntityPage entity={entity} />;
  -  }
  -};

  +export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
  +  switch (entity?.spec?.type) {
  +    case 'service':
  +      return <ServiceEntityPage entity={entity} />;
  +    case 'website':
  +      return <WebsiteEntityPage entity={entity} />;
  +    default:
  +      return <DefaultEntityPage entity={entity} />;
  +  }
  +};
  +
  +const ApiOverviewContent = ({ entity }: { entity: Entity }) => (
  +  <Grid container spacing={3}>
  +    <Grid item md={6}>
  +      <AboutCard entity={entity} />
  +    </Grid>
  +    <Grid container item md={12}>
  +      <Grid item md={6}>
  +        <ProvidingComponentsCard entity={entity} />
  +      </Grid>
  +      <Grid item md={6}>
  +        <ConsumingComponentsCard entity={entity} />
  +      </Grid>
  +    </Grid>
  +  </Grid>
  +);
  +
  +const ApiDefinitionContent = ({ entity }: { entity: ApiEntity }) => (
  +  <Grid container spacing={3}>
  +    <Grid item xs={12}>
  +      <ApiDefinitionCard apiEntity={entity} />
  +    </Grid>
  +  </Grid>
  +);
  +
  +const ApiEntityPage = ({ entity }: { entity: Entity }) => (
  +  <EntityPageLayout>
  +    <EntityPageLayout.Content
  +      path="/*"
  +      title="Overview"
  +      element={<ApiOverviewContent entity={entity} />}
  +    />
  +    <EntityPageLayout.Content
  +      path="/definition/*"
  +      title="Definition"
  +      element={<ApiDefinitionContent entity={entity as ApiEntity} />}
  +    />
  +  </EntityPageLayout>
  +);
  +
  +export const EntityPage = () => {
  +  const { entity } = useEntity();
  +
  +  switch (entity?.kind?.toLowerCase()) {
  +    case 'component':
  +      return <ComponentEntityPage entity={entity} />;
  +    case 'api':
  +      return <ApiEntityPage entity={entity} />;
  +    default:
  +      return <DefaultEntityPage entity={entity} />;
  +  }
  +};
  ```

- 1e22f8e0b: Unify `dockerode` library and type dependency versions

## 0.2.3

### Patch Changes

- 68fdc3a9f: Optimized the `yarn install` step in the backend `Dockerfile`.

  To apply these changes to an existing app, make the following changes to `packages/backend/Dockerfile`:

  Replace the `RUN yarn install ...` line with the following:

  ```bash
  RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"
  ```

- 4a655c89d: Removed `"resolutions"` entry for `esbuild` in the root `package.json` in order to use the version specified by `@backstage/cli`.

  To apply this change to an existing app, remove the following from your root `package.json`:

  ```json
  "resolutions": {
    "esbuild": "0.6.3"
  },
  ```

- ea475893d: Add [API docs plugin](https://github.com/backstage/backstage/tree/master/plugins/api-docs) to new apps being created through the CLI.

## 0.2.2

### Patch Changes

- 7d7abd50c: Add `app-backend` as a backend plugin, and make a single docker build of the backend the default way to deploy backstage.

  Note that the `app-backend` currently only is a solution for deployments of the app, it's not a dev server and is not intended for local development.

  ## Template changes

  As a part of installing the `app-backend` plugin, the below changes where made. The changes are grouped into two steps, installing the plugin, and updating the Docker build and configuration.

  ### Installing the `app-backend` plugin in the backend

  First, install the `@backstage/plugin-app-backend` plugin package in your backend. These changes where made for `v0.3.0` of the plugin, and the installation process might change in the future. Run the following from the root of the repo:

  ```bash
  cd packages/backend
  yarn add @backstage/plugin-app-backend
  ```

  For the `app-backend` to get access to the static content in the frontend we also need to add the local `app` package as a dependency. Add the following to your `"dependencies"` in `packages/backend/package.json`, assuming your app package is still named `app` and on version `0.0.0`:

  ```json
  "app": "0.0.0",
  ```

  Don't worry, this will not cause your entire frontend dependency tree to be added to the app, just double check that `packages/app/package.json` has a `"bundled": true` field at top-level. This signals to the backend build process that the package is bundled and that no transitive dependencies should be included.

  Next, create `packages/backend/src/plugins/app.ts` with the following:

  ```ts
  import { createRouter } from '@backstage/plugin-app-backend';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin({
    logger,
    config,
  }: PluginEnvironment) {
    return await createRouter({
      logger,
      config,
      appPackageName: 'app',
    });
  }
  ```

  In `packages/backend/src/index.ts`, make the following changes:

  Add an import for the newly created plugin setup file:

  ```ts
  import app from './plugins/app';
  ```

  Setup the following plugin env.

  ```ts
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  ```

  Change service builder setup to include the `app` plugin as follows. Note that the `app` plugin is not installed on the `/api` route with most other plugins.

  ```ts
  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));
  ```

  You should now have the `app-backend` plugin installed in your backend, ready to serve the frontend bundle!

  ### Docker build setup

  Since the backend image is now the only one needed for a simple Backstage deployment, the image tag name in the `build-image` script inside `packages/backend/package.json` was changed to the following:

  ```json
  "build-image": "backstage-cli backend:build-image --build --tag backstage",
  ```

  For convenience, a `build-image` script was also added to the root `package.json` with the following:

  ```json
  "build-image": "yarn workspace backend build-image",
  ```

  In the root of the repo, a new `app-config.production.yaml` file was added. This is used to set the appropriate `app.baseUrl` now that the frontend is served directly by the backend in the production deployment. It has the following contents:

  ```yaml
  app:
    # Should be the same as backend.baseUrl when using the `app-backend` plugin
    baseUrl: http://localhost:7000

  backend:
    baseUrl: http://localhost:7000
    listen:
      port: 7000
  ```

  In order to load in the new configuration at runtime, the command in the `Dockerfile` at the repo root was changed to the following:

  ```dockerfile
  CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
  ```

## 0.2.1

### Patch Changes

- c56e28375: Fix missing api-docs plugin registration in app template

## 0.2.0

### Minor Changes

- 6d29605db: Change the default backend plugin mount point to /api
- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 56e4eb589: Make CSP configurable to fix app-backend served app not being able to fetch

  See discussion [here on discord](https://discordapp.com/channels/687207715902193673/687235481154617364/758721460163575850)

- d7873e1aa: Default to using internal scope for new plugins
- 6f447b3fc: Remove identity-backend

  Not used, and we're heading down the route of identities in the catalog

- 61db1ddc6: Allow node v14 and add to master build matrix

  - Upgrade sqlite3@^5.0.0 in @backstage/plugin-catalog-backend
  - Add Node 14 to engines in @backstage/create-app

- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.

  The token needs to have the scopes `user:email`, `read:user`, and `read:org`.

- f00ca3cb8: Auto-create plugin databases

  Relates to #1598.

  This creates databases for plugins before handing off control to plugins.

  The list of plugins currently need to be hard-coded depending on the installed plugins. A later PR will properly refactor the code to provide a factory pattern where plugins specify what they need, and Knex instances will be provided based on the input.

- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

- 7aff112af: The default mount point for backend plugins have been changed to /api. These changes are done in the backend package itself, so it is recommended that you sync up existing backend packages with this new pattern.

### Patch Changes

- e67d49bf5: Sync scaffolded backend with example
- 961414d55: Remove discovery api override
- 440a17b39: Bump @backstage/catalog-backend and pass the now required UrlReader interface to the plugin
- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- 5a920c6e4: Updated naming of environment variables. New pattern [NAME]\_TOKEN for GitHub, GitLab, Azure & GitHub Enterprise access tokens.

  ### Detail:

  - Previously we have to export same token for both, catalog & scaffolder

  ```bash
  export GITHUB_ACCESS_TOKEN=foo
  export GITHUB_PRIVATE_TOKEN=foo
  ```

  with latest changes, only single export is sufficient.

  ```bash
  export GITHUB_TOKEN=foo
  export GITLAB_TOKEN=foo
  export GHE_TOKEN=foo
  export AZURE_TOKEN=foo
  ```

  ### list:

  <table>
    <tr>
      <th>Old name</th>
      <th>New name</th>
    </tr>
    <tr>
      <td>GITHUB_ACCESS_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITHUB_PRIVATE_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_ACCESS_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_PRIVATE_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>AZURE_PRIVATE_TOKEN</td>
      <td>AZURE_TOKEN</td>
    </tr>
    <tr>
      <td>GHE_PRIVATE_TOKEN</td>
      <td>GHE_TOKEN</td>
    </tr>
  </table>

- 67d76b419: Fix for configured templates using 'url' locations even though it's not supported yet
- 7bbeb049f: Change loadBackendConfig to return the config directly
