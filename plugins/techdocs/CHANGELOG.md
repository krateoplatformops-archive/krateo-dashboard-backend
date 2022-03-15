# @backstage/plugin-techdocs

## 0.15.1

### Patch Changes

- 7a1dbe6ce9: The panels of `TechDocsCustomHome` now use the `useEntityOwnership` hook to resolve ownership when the `'ownedByUser'` filter predicate is used.
- Updated dependencies
  - @backstage/plugin-catalog@0.10.0
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-search@0.7.3
  - @backstage/integration-react@0.1.25

## 0.15.1-next.0

### Patch Changes

- 7a1dbe6ce9: The panels of `TechDocsCustomHome` now use the `useEntityOwnership` hook to resolve ownership when the `'ownedByUser'` filter predicate is used.
- Updated dependencies
  - @backstage/plugin-catalog@0.10.0-next.0
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-search@0.7.3-next.0
  - @backstage/integration-react@0.1.25-next.0

## 0.15.0

### Minor Changes

- ee3d6c6f10: **BREAKING:**
  Table column utilities `createNameColumn`, `createOwnerColumn`, `createTypeColumn` as well as actions utilities `createCopyDocsUrlAction` and `createStarEntityAction` are no longer directly exported. Instead accessible through DocsTable and EntityListDocsTable.

  Use as following:

  ```tsx
  DocsTable.columns.createNameColumn();
  DocsTable.columns.createOwnerColumn();
  DocsTable.columns.createTypeColumn();

  DocsTable.actions.createCopyDocsUrlAction();
  DocsTable.actions.createStarEntityAction();
  ```

  - Renamed `DocsResultListItem` to `TechDocsSearchResultListItem`, leaving the old name in place as a deprecations.

  - Renamed `TechDocsPage` to `TechDocsReaderPage`, leaving the old name in place as a deprecations.

  - Renamed `TechDocsPageRenderFunction` to `TechDocsPageRenderFunction`, leaving the old name in place as a deprecations.

  - Renamed `TechDocsPageHeader` to `TechDocsReaderPageHeader`, leaving the old name in place as a deprecations.

  - `LegacyTechDocsHome` marked as deprecated and will be deleted in next release, use `TechDocsCustomHome` instead.

  - `LegacyTechDocsPage` marked as deprecated and will be deleted in next release, use `TechDocsReaderPage` instead.

### Patch Changes

- 64b430f80d: chore(deps): bump `react-text-truncate` from 0.17.0 to 0.18.0
- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- f41a293231: - **DEPRECATION**: Deprecated `formatEntityRefTitle` in favor of the new `humanizeEntityRef` method instead. Please migrate to using the new method instead.
- c5fda066b1: Collapse techdocs sidebar on small devices
- f590d1681b: Removed usage of deprecated favorite utility methods.
- 5b0f9a75fa: Remove copyright from old footer in documentation generated with previous version of `mkdocs-techdocs-plugin` (`v0.2.2`).
- 0c3ba547a6: Show feedback when copying code snippet to clipboard.
- 0ca964ee0e: Fixed a bug that could cause searches in the in-context TechDocs search bar to show results from a different TechDocs site.
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-search@0.7.2
  - @backstage/plugin-catalog@0.9.1
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/integration@0.8.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/integration-react@0.1.24

## 0.14.0

### Minor Changes

- 2262fe19c9: **BREAKING**: Removed support for passing in an explicit `entity` prop to entity page extensions, which has been deprecated for a long time. This is only a breaking change at the TypeScript level, as this property was already ignored.
- 4faae902eb: Adjust the Tech Docs page theme as a side effect of the `mkdocs-material` theme update.

  If you use the `spofify/techdocs` image to build your documentation, make sure you use version `spotify/techdocs:v0.3.7`.

  **Breaking**: The `PyMdown` extensions have also been updated and some syntax may have changed, so it is recommended that you check the extension's documentation if something stops working.
  For example, the syntax of tags below was deprecated in `PyMdown` extensions `v.7.0` and in `v.8.0.0` it has been removed. This means that the old syntax specified below no longer works.

  ````markdown
  ```markdown tab="tab"
  This is some markdown
  ```

  ```markdown tab="tab 2"
  This is some markdown in tab 2
  ```
  ````

### Patch Changes

- 3bbb4d98c6: Changed <TechdocsPage /> to use <NotFoundErrorPage /> from createApp
- ed09ad8093: Updated usage of the `LocationSpec` type from `@backstage/catalog-model`, which is deprecated.
- b776ce5aab: Replaced use of deprecated `useEntityListProvider` hook with `useEntityList`.
- d4f67fa728: Removed import of deprecated hook.
- 45e1706328: Continuation of [#9569](https://github.com/backstage/backstage/pull/9569), fix Tech Docs Reader search position to be the same width as content.
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/plugin-catalog@0.9.0
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/core-plugin-api@0.7.0
  - @backstage/integration@0.7.5
  - @backstage/plugin-search@0.7.1
  - @backstage/integration-react@0.1.23

## 0.13.4

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 6553985cd4: Match text size of admonitions to main content text size.
- 9df7b43e1a: Improve overall appearance of highlighted code in docs.
- Updated dependencies
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/integration-react@0.1.22
  - @backstage/plugin-catalog@0.8.0
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/plugin-search@0.7.0
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/theme@0.2.15

## 0.13.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8
  - @backstage/plugin-search@0.6.2
  - @backstage/plugin-catalog-react@0.6.14
  - @backstage/plugin-catalog@0.7.12
  - @backstage/integration-react@0.1.21

## 0.13.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-search@0.6.2-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0
  - @backstage/integration-react@0.1.21-next.0
  - @backstage/plugin-catalog@0.7.12-next.0

## 0.13.2

### Patch Changes

- 742434a6ba: Fixed a bug where links to files within a TechDocs site that use the `download` attribute would result in a 404 in cases where the TechDocs backend and Backstage frontend application are on the same host.
- 359c31e31d: Added support for documentation using the raw `<source>` tag to point to relative resources like audio or video files.
- 18317a08db: Fixed a bug where copy-to-clipboard buttons were appended to unintended elements.
- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13
  - @backstage/integration-react@0.1.20
  - @backstage/plugin-catalog@0.7.11
  - @backstage/plugin-search@0.6.1

## 0.13.2-next.1

### Patch Changes

- 742434a6ba: Fixed a bug where links to files within a TechDocs site that use the `download` attribute would result in a 404 in cases where the TechDocs backend and Backstage frontend application are on the same host.
- Updated dependencies
  - @backstage/core-components@0.8.7-next.1
  - @backstage/plugin-catalog-react@0.6.13-next.1
  - @backstage/plugin-catalog@0.7.11-next.1

## 0.13.2-next.0

### Patch Changes

- 359c31e31d: Added support for documentation using the raw `<source>` tag to point to relative resources like audio or video files.
- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/integration-react@0.1.20-next.0
  - @backstage/plugin-catalog@0.7.11-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0
  - @backstage/plugin-search@0.6.1-next.0

## 0.13.1

### Patch Changes

- bdc53553eb: chore(deps): bump `react-text-truncate` from 0.16.0 to 0.17.0
- a64f99f734: Code snippets now include a "copy to clipboard" button.
- Updated dependencies
  - @backstage/core-components@0.8.6
  - @backstage/plugin-search@0.6.0
  - @backstage/plugin-catalog@0.7.10

## 0.13.0

### Minor Changes

- aecfe4f403: Make `TechDocsClient` and `TechDocsStorageClient` use the `FetchApi`. You now
  need to pass in an instance of that API when constructing the client, if you
  create a custom instance in your app.

  If you are replacing the factory:

  ```diff
  +import { fetchApiRef } from '@backstage/core-plugin-api';

   createApiFactory({
     api: techdocsStorageApiRef,
     deps: {
       configApi: configApiRef,
       discoveryApi: discoveryApiRef,
       identityApi: identityApiRef,
  +    fetchApi: fetchApiRef,
     },
     factory: ({
       configApi,
       discoveryApi,
       identityApi,
  +    fetchApi,
     }) =>
       new TechDocsStorageClient({
         configApi,
         discoveryApi,
         identityApi,
  +      fetchApi,
       }),
   }),
   createApiFactory({
     api: techdocsApiRef,
     deps: {
       configApi: configApiRef,
       discoveryApi: discoveryApiRef,
  -    identityApi: identityApiRef,
  +    fetchApi: fetchApiRef,
     },
     factory: ({
       configApi,
       discoveryApi,
  -    identityApi,
  +    fetchApi,
     }) =>
       new TechDocsClient({
         configApi,
         discoveryApi,
  -      identityApi,
  +      fetchApi,
       }),
   }),
  ```

  If instantiating directly:

  ```diff
  +import { fetchApiRef } from '@backstage/core-plugin-api';

  +const fetchApi = useApi(fetchApiRef);
   const storageClient = new TechDocsStorageClient({
     configApi,
     discoveryApi,
     identityApi,
  +  fetchApi,
   });
   const techdocsClient = new TechDocsClient({
     configApi,
     discoveryApi,
  -  identityApi,
  +  fetchApi,
   }),
  ```

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- 29710c91c2: use lighter color for block quotes and horizontal rulers
- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/integration@0.7.2
  - @backstage/plugin-search@0.5.6
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog@0.7.9
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/integration-react@0.1.19

## 0.12.15-next.0

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- 29710c91c2: use lighter color for block quotes and horizontal rulers
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/plugin-catalog@0.7.9-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/plugin-search@0.5.6-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/integration-react@0.1.19-next.0
  - @backstage/integration@0.7.2-next.0

## 0.12.14

### Patch Changes

- 5333451def: Cleaned up API exports
- 1628ca3f49: Fix an issue where the TechDocs sidebar is hidden when the Backstage sidebar is pinned at smaller screen sizes
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9
  - @backstage/integration-react@0.1.18
  - @backstage/plugin-catalog@0.7.8
  - @backstage/plugin-search@0.5.5

## 0.12.13

### Patch Changes

- fe9de6c25b: Adds support for opening internal Techdocs links in a new tab with CTRL+Click or CMD+Click
- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- e0271456d8: Updated Techdocs footer navigation to dynamically resize to the width of the dom, resolving an issue where a pinned sidebar causes navigation to go off of the screen
- Updated dependencies
  - @backstage/plugin-search@0.5.4
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/core-components@0.8.3
  - @backstage/plugin-catalog@0.7.7

## 0.12.12

### Patch Changes

- aa8f764a3e: Add the techdocs.sanitizer.allowedIframeHosts config.
  This config allows all iframes which have the host of the attribute src in the 'allowedIframehosts' list to be displayed in the documentation.
- Updated dependencies
  - @backstage/plugin-search@0.5.3
  - @backstage/plugin-catalog@0.7.6
  - @backstage/plugin-catalog-react@0.6.9
  - @backstage/integration@0.7.0
  - @backstage/integration-react@0.1.17

## 0.12.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search@0.5.2
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2
  - @backstage/plugin-catalog@0.7.5
  - @backstage/integration-react@0.1.16

## 0.12.10

### Patch Changes

- e7cce2b603: Fix issue where assets weren't being fetched from the correct URL path for doc URLs without trailing slashes
- Updated dependencies
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1
  - @backstage/catalog-model@0.9.8
  - @backstage/plugin-catalog-react@0.6.7

## 0.12.9

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- d90dad84b0: Switch to using `LogViewer` component from `@backstage/core-components` to display build logs.
- 3421826ca8: The problem of lowercase entity triplets which causes docs to not load on entity page is fixed.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-catalog@0.7.4
  - @backstage/integration-react@0.1.15
  - @backstage/plugin-catalog-react@0.6.5
  - @backstage/plugin-search@0.5.1

## 0.12.8

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.10
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2
  - @backstage/plugin-search@0.5.0

## 0.12.7

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/core-plugin-api@0.2.1
  - @backstage/core-components@0.7.5

## 0.12.6

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- c1858c4cf9: Fixed entity triplet case handling for certain locales.
- f7703981a9: Use a better checkbox rendering in a task list.
- e266687580: Updates reader component used to display techdocs documentation. A previous change made this component not usable out of a page which don't have entityRef in url parameters. Reader component EntityRef parameter is now used instead of url parameters. Techdocs documentation component can now be used in our custom pages.
- Updated dependencies
  - @backstage/plugin-catalog@0.7.3
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/plugin-search@0.4.18
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/integration-react@0.1.14

## 0.12.5

### Patch Changes

- fe5738fe1c: Lazy load `LazyLog` as it is rarely used.
- 53c9ad7e04: Update font weight for headings in TechDocs
- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/plugin-search@0.4.17
  - @backstage/core-plugin-api@0.1.13
  - @backstage/plugin-catalog-react@0.6.3

## 0.12.4

### Patch Changes

- a9a8c6f7c5: Reader will now scroll to the top of the page when navigating between pages
- 106a5dc3ad: Restore original casing for `kind`, `namespace` and `name` in `DefaultTechDocsCollator`.
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/core-components@0.7.2
  - @backstage/integration-react@0.1.13
  - @backstage/plugin-catalog-react@0.6.2
  - @backstage/catalog-model@0.9.6
  - @backstage/plugin-search@0.4.16
  - @backstage/core-plugin-api@0.1.12

## 0.12.3

### Patch Changes

- ba5b75ed2f: Add `<EntityListDocsGrid>` as an alternative to `<EntityListDocsTable>` that
  shows a grid of card instead of table.

  Extend `<DocsCardGrid>` to display the entity title of the entity instead of the
  name if available.

- 177401b571: Display entity title (if defined) in titles of TechDocs search results
- cdf8ca6111: Only replace the shadow dom if the content is changed to avoid a flickering UI.
- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/errors@0.1.3
  - @backstage/core-plugin-api@0.1.11
  - @backstage/plugin-catalog@0.7.2
  - @backstage/plugin-catalog-react@0.6.1
  - @backstage/catalog-model@0.9.5

## 0.12.2

### Patch Changes

- 76fef740fe: Refactored `<Reader />` component internals to support future extensibility.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/plugin-catalog@0.7.1
  - @backstage/integration@0.6.8
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11
  - @backstage/plugin-search@0.4.15
  - @backstage/integration-react@0.1.12

## 0.12.1

### Patch Changes

- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog@0.7.0
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4
  - @backstage/integration@0.6.7
  - @backstage/plugin-search@0.4.14

## 0.12.0

### Minor Changes

- 82bb0842a3: Adds support for being able to customize and compose your TechDocs reader page in the App.

  You can likely upgrade to this version without issue. If, however, you have
  imported the `<Reader />` component in your custom code, the name of a property
  has changed. You will need to make the following change anywhere you use it:

  ```diff
  -<Reader entityId={value} />
  +<Reader entityRef={value} />
  ```

### Patch Changes

- 79ebee7a6b: Add "data-testid" for e2e tests and fix techdocs entity not found error.
- 3df2e8532b: Fixed the URL for the "Click to copy documentation link to clipboard" action
- 0a8bec0877: Added a check for the TechDocs annotation on the entity
- Updated dependencies
  - @backstage/integration@0.6.6
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/integration-react@0.1.11
  - @backstage/plugin-catalog@0.6.17
  - @backstage/plugin-catalog-react@0.5.1
  - @backstage/plugin-search@0.4.13

## 0.11.3

### Patch Changes

- be13dfe61a: Make techdocs context search bar width adjust on smaller screens.
- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/integration@0.6.5
  - @backstage/plugin-catalog@0.6.16
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10
  - @backstage/integration-react@0.1.10
  - @backstage/plugin-search@0.4.12

## 0.11.2

### Patch Changes

- 1d346ba903: Modify TechDocsCollator to be aware of new TechDocs URL pattern. Modify tech docs in context search to use correct casing when creating initial filter.
- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/integration@0.6.4
  - @backstage/integration-react@0.1.9
  - @backstage/plugin-catalog@0.6.15
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/plugin-search@0.4.11
  - @backstage/core-plugin-api@0.1.8

## 0.11.1

### Patch Changes

- 30ed662a3: Adding in-context search to TechDocs Reader component. Using existing search-backend to query for indexed search results scoped into a specific entity's techdocs. Needs TechDocsCollator enabled on the backend to work.

  Adding extra information to indexed tech docs documents for search.

- 434dfc5d4: Display [metadata.title](https://backstage.io/docs/features/software-catalog/descriptor-format#title-optional) for components on the TechDocs homepage, if defined; otherwise fall back to `metadata.name` as displayed before.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/integration@0.6.3
  - @backstage/core-components@0.4.0
  - @backstage/plugin-catalog@0.6.14
  - @backstage/plugin-search@0.4.9
  - @backstage/catalog-model@0.9.1
  - @backstage/integration-react@0.1.8

## 0.11.0

### Minor Changes

- c772d9a84: TechDocs sites can now be accessed using paths containing entity triplets of
  any case (e.g. `/docs/namespace/KIND/name` or `/docs/namespace/kind/name`).

  If you do not use an external storage provider for serving TechDocs, this is a
  transparent change and no action is required from you.

  If you _do_ use an external storage provider for serving TechDocs (one of\* GCS,
  AWS S3, or Azure Blob Storage), you must run a migration command against your
  storage provider before updating.

  [A migration guide is available here](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-alpha-to-beta).

  - (\*) We're seeking help from the community to bring OpenStack Swift support
    [to feature parity](https://github.com/backstage/backstage/issues/6763) with the above.

- 787bc0826: The TechDocs plugin has completed the migration to the Composability API. In
  order to update to this version, please ensure you've made all necessary
  changes to your `App.tsx` file as outlined in the [create-app changelog][cacl].

  [cacl]: https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md

### Patch Changes

- 90c68a2ca: Fix Techdocs feedback icon link for GitHub URLs
- Updated dependencies
  - @backstage/plugin-catalog@0.6.13
  - @backstage/plugin-catalog-react@0.4.4
  - @backstage/core-components@0.3.3
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8

## 0.10.4

### Patch Changes

- a440d3b38: Expose a new composable `TechDocsIndexPage` and a `DefaultTechDocsHome` with support for starring docs and filtering on owned, starred, owner, and tags.

  You can migrate to the new UI view by making the following changes in your `App.tsx`:

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

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- 8a3e46591: Switch `EventSource` implementation with header support from a Node.js API-based one to an XHR-based one.
- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6
  - @backstage/plugin-catalog@0.6.11
  - @backstage/plugin-catalog-react@0.4.2
  - @backstage/integration-react@0.1.7

## 0.10.3

### Patch Changes

- 260c053b9: Fix All Material UI Warnings
- db58cf06c: Avoid sanitize safe links in the header of document pages.
- 1d65bd490: Fix Techdocs feedback icon link for GitLab URLs with subgroup(s) in path
- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5
  - @backstage/integration@0.5.9
  - @backstage/integration-react@0.1.6
  - @backstage/plugin-catalog-react@0.4.1

## 0.10.2

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- 11c370af2: Optimize load times by only fetching entities with the `backstage.io/techdocs-ref` annotation
- 2b1ac002d: TechDocs now uses a "safe by default" sanitization library, rather than relying on its own, hard-coded list of allowable tags and attributes.
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/integration-react@0.1.5
  - @backstage/theme@0.2.9

## 0.10.1

### Patch Changes

- 9266b80ab: Add search list item to display tech docs search results
- 03bf17e9b: Improve the responsiveness of the EntityPage UI. With this the Header component should scale with the screen size & wrapping should not cause overflowing/blocking of links. Additionally enforce the Pages using the Grid Layout to use it across all screen sizes & to wrap as intended.

  To benefit from the improved responsive layout, the `EntityPage` in existing Backstage applications should be updated to set the `xs` column size on each grid item in the page, as this does not default. For example:

  ```diff
  -  <Grid item md={6}>
  +  <Grid item xs={12} md={6}>
  ```

- 378cc6a54: Only update the `path` when the content is updated.
  If content and path are updated independently, the frontend rendering is triggered twice on each navigation: Once for the `path` change (with the old content) and once for the new content.
  This might result in a flickering rendering that is caused by the async frontend preprocessing, and the fact that replacing the shadow dom content is expensive.
- 214e7c52d: Refactor the techdocs transformers to return `Promise`s and await all transformations.
- e35b13afa: Handle error responses in `getTechDocsMetadata` and `getEntityMetadata` such that `<TechDocsPageHeader>` doesn't throw errors.
- Updated dependencies
  - @backstage/core-components@0.1.6
  - @backstage/plugin-catalog-react@0.3.1

## 0.10.0

### Minor Changes

- 94a54dd47: Added a `migrateDocsCase()` method to TechDocs publishers, along with
  implementations for AWS, Azure, and GCS.

  This change is in support of a future update to TechDocs that will allow for
  case-insensitive entity triplet URL access to documentation pages which will
  require a migration of existing documentation objects in external storage
  solutions.

  See [#4367](https://github.com/backstage/backstage/issues/4367) for details.

### Patch Changes

- 537c37b0f: Fix displaying owned documents list by fetching associated entity relations
- 136a91974: Show a "Refresh" button to if the content is stale.
  This removes the need to do a full page-reload to display more recent TechDocs content.
- f1200f44c: Rewrite the `/sync/:namespace/:kind/:name` endpoint to support an event-stream as response.
  This change allows the sync process to take longer than a normal HTTP timeout.
  The stream also emits log events, so the caller can follow the build process in the frontend.
- 3af126cdd: Provide a Drawer component to follow a running build.
  This can be used to debug the rendering and get build logs in case an error occurs.
- 2a4a3b32d: Techdocs: fix sidebars not adjusting position automatically
- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.9.9

### Patch Changes

- 0172d3424: Fixed bug preventing scroll bar from showing up on code blocks in a TechDocs site.
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-react@0.2.6

## 0.9.8

### Patch Changes

- 99a2873c7: Include cookies when making fetch requests for SVG from techdocs plugin
- a444c7431: Filter fetched entity fields to optimize loading techdocs list
- Updated dependencies
  - @backstage/plugin-catalog-react@0.2.5
  - @backstage/core-components@0.1.4
  - @backstage/integration@0.5.7

## 0.9.7

### Patch Changes

- aefd54da6: Fix the overlapping between the sidebar and the tabs navigation when enabled in mkdocs (features: navigation.tabs)
- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- 1dfec7a2a: Refactor the implicit logic from `<Reader />` into an explicit state machine. This resolves some state synchronization issues when content is refreshed or rebuilt in the backend.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-model@0.8.4
  - @backstage/integration-react@0.1.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.9.6

### Patch Changes

- 938aee2fb: Fix the link to the documentation page when no owned documents are displayed
- 2e1fbe203: Do not add trailing slash for .html pages during doc links rewriting
- 9b57fda8b: Fixes a bug that could prevent some externally hosted images (like icons or
  build badges) from rendering within TechDocs documentation.
- 667656c8b: Adding support for user owned document filter for TechDocs custom Homepage
- Updated dependencies
  - @backstage/plugin-catalog-react@0.2.3
  - @backstage/catalog-model@0.8.3
  - @backstage/core@0.7.13

## 0.9.5

### Patch Changes

- aad98c544: Fixes multiple XSS and sanitization bypass vulnerabilities in TechDocs.
- Updated dependencies [e7c5e4b30]
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
- Updated dependencies [1cf1d351f]
- Updated dependencies [deaba2e13]
- Updated dependencies [8e919a6f8]
  - @backstage/theme@0.2.8
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5
  - @backstage/core@0.7.12
  - @backstage/plugin-catalog-react@0.2.1

## 0.9.4

### Patch Changes

- 4ea9df9d3: Set admonition font size to 1rem in TechDocs to align with the rest of the document's font sizes.
  Fixes #5448 and #5541.
- bf805b467: Fixes #5529, a bug that prevented TechDocs from rendering pages containing malformed links.
- 203ce6f6f: TechDocs now respects the `download` attribute on anchor tags in generated
  markup, allowing documentation authors to bundle downloadable files with their
  documentation.
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.9.3

### Patch Changes

- 65e6c4541: Remove circular dependencies
- a62cfe068: Bug fix on sidebar position when Tab-Bar is enabled
- 35e091604: Handle URLs with a `#hash` correctly when rewriting link URLs.
- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10
  - @backstage/integration@0.5.3

## 0.9.2

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/integration-react@0.1.2
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.9.1

### Patch Changes

- 2e05277e0: Fix navigation in a page using the table of contents.
- 4075c6367: Make git config optional for techdocs feedback links
- Updated dependencies [38ca05168]
- Updated dependencies [f65adcde7]
- Updated dependencies [81c54d1f2]
- Updated dependencies [80888659b]
- Updated dependencies [7b8272fb7]
- Updated dependencies [d8b81fd28]
  - @backstage/integration@0.5.2
  - @backstage/core@0.7.8
  - @backstage/plugin-catalog-react@0.1.5
  - @backstage/theme@0.2.7
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.9.0

### Minor Changes

- 21fddf452: Make `techdocsStorageApiRef` and `techdocsApiRef` use interfaces instead of the
  actual implementation classes.

  This renames the classes `TechDocsApi` to `TechDocsClient` and `TechDocsStorageApi`
  to `TechDocsStorageClient` and renames the interfaces `TechDocs` to `TechDocsApi`
  and `TechDocsStorage` to `TechDocsStorageApi` to comply the pattern elsewhere in
  the project. This also fixes the types returned by some methods on those
  interfaces.

### Patch Changes

- 6fbd7beca: Use `EntityRefLink` in header and use relations to reference the owner of the
  document.
- 15cbe6815: Fix TechDocs landing page table wrong copied link
- 39bdaa004: Add customization and exportable components for TechDocs landing page
- cb8c848a3: Disable color transitions on links to avoid issues in dark mode.
- 17915e29b: Rework state management to avoid rendering multiple while navigating between pages.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.8.0

### Minor Changes

- ac6025f63: Add feedback link icon in Techdocs Reader that directs to GitLab or GitHub repo issue page with pre-filled title and source link.
  For link to appear, requires `repo_url` and `edit_uri` to be filled in mkdocs.yml, as per https://www.mkdocs.org/user-guide/configuration. An `edit_uri` will need to be specified for self-hosted GitLab/GitHub instances with a different host name.
  To identify issue URL format as GitHub or GitLab, the host name of source in `repo_url` is checked if it contains `gitlab` or `github`. Alternately this is determined by matching to `host` values from `integrations` in app-config.yaml.

### Patch Changes

- e292e393f: Add a test id to the shadow root element of the Reader to access it easily in e2e tests
- Updated dependencies [94da20976]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [99fbef232]
- Updated dependencies [ab07d77f6]
- Updated dependencies [931b21a12]
- Updated dependencies [937ed39ce]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
  - @backstage/core@0.7.6
  - @backstage/theme@0.2.6

## 0.7.2

### Patch Changes

- fef852ecd: Reworked the TechDocs plugin to support using the configured company name instead of
  'Backstage' in the page title.
- 18f7345a6: Add borders to TechDocs tables and increase font size. Fixes #5264 and #5276.
- Updated dependencies [bb5055aee]
- Updated dependencies [d0d1c2f7b]
- Updated dependencies [5d0740563]
- Updated dependencies [5cafcf452]
- Updated dependencies [86a95ba67]
- Updated dependencies [e27cb6c45]
  - @backstage/catalog-model@0.7.7
  - @backstage/core@0.7.5

## 0.7.1

### Patch Changes

- bebd1c4fe: Remove the `@backstage/techdocs-common` dependency to not pull in backend config schemas in the frontend.
- Updated dependencies [9f48b548c]
- Updated dependencies [8488a1a96]
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.7.0

### Minor Changes

- aaeb7ecf3: When newer documentation available but not built, show older documentation while async building newer
  TechDocs backend: /sync endpoint added to support above, returns immediate success if docs don't need a build, returns delayed success after build if needed
  TechDocs backend: /docs endpoint removed as frontend can directly request to techdocs.storageUrl or /static/docs
- 3139f83af: Add sticky sidebars and footer navigation links to TechDocs Reader

### Patch Changes

- ea9d977e7: Introduce workaround for admonition icons of MkDocs.
- 2aab54319: TechDocs: links at sidebar and bottom reset scroll position to top
- Updated dependencies [01ccef4c7]
- Updated dependencies [fcc3ada24]
- Updated dependencies [4618774ff]
- Updated dependencies [df59930b3]
  - @backstage/plugin-catalog-react@0.1.3
  - @backstage/core@0.7.3
  - @backstage/theme@0.2.5

## 0.6.2

### Patch Changes

- 83bfc98a3: On TechDocs page header, change the breadcrumbs link to be static and point to TechDocs homepage.
- e7baa0d2e: Separate techdocs-backend and frontend config schema declarations
- c8b54c370: Extended TechDocs HomePage with owned documents
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
- Updated dependencies [8686eb38c]
- Updated dependencies [424742dc1]
- Updated dependencies [4e0b5055a]
  - @backstage/config@0.1.4
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2
  - @backstage/techdocs-common@0.4.5
  - @backstage/test-utils@0.1.9

## 0.6.1

### Patch Changes

- aa095e469: OpenStack Swift publisher added for tech-docs.
- 2089de76b: Make use of the new core `ItemCardGrid` and `ItemCardHeader` instead of the deprecated `ItemCard`.
- 868e4cdf2: - Adds a link to the owner entity
  - Corrects the link to the component which includes the namespace
- ca4a904f6: Add an optional configuration option for setting the url endpoint for AWS S3 publisher: `techdocs.publisher.awsS3.endpoint`
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [2ef5bc7ea]
- Updated dependencies [ff4d666ab]
- Updated dependencies [aa095e469]
- Updated dependencies [2089de76b]
- Updated dependencies [dc1fc92c8]
- Updated dependencies [bc46435f5]
- Updated dependencies [a501128db]
- Updated dependencies [ca4a904f6]
  - @backstage/techdocs-common@0.4.4
  - @backstage/catalog-model@0.7.4
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4

## 0.6.0

### Minor Changes

- 813c6a4f2: Add authorization header on techdocs api requests. Breaking change as clients now needs the Identity API.

### Patch Changes

- Updated dependencies [12d8f27a6]
- Updated dependencies [f43192207]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
- Updated dependencies [61299519f]
  - @backstage/catalog-model@0.7.3
  - @backstage/techdocs-common@0.4.3
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.5.8

### Patch Changes

- f37992797: Got rid of some `attr` and cleaned up a bit in the TechDocs config schema.
- 2499f6cde: Add support for assuming role in AWS integrations
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [dc12852c9]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [2499f6cde]
- Updated dependencies [a1f5e6545]
- Updated dependencies [1e4ddd71d]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/test-utils@0.1.8
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2
  - @backstage/techdocs-common@0.4.2
  - @backstage/config@0.1.3

## 0.5.7

### Patch Changes

- Updated dependencies [fd3f2a8c0]
- Updated dependencies [fb28da212]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [26e143e60]
- Updated dependencies [c6655413d]
- Updated dependencies [44414239f]
- Updated dependencies [b0a41c707]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2
  - @backstage/techdocs-common@0.4.1
  - @backstage/plugin-catalog-react@0.0.4

## 0.5.6

### Patch Changes

- f5e564cd6: Improve display of error messages
- 41af18227: Migrated to new composability API, exporting the plugin instance as `techdocsPlugin`, the top-level page as `TechdocsPage`, and the entity content as `EntityTechdocsContent`.
- 8f3443427: Enhance API calls to support trapping 500 errors from techdocs-backend
- Updated dependencies [77ad0003a]
- Updated dependencies [b51ee6ece]
- Updated dependencies [19d354c78]
- Updated dependencies [08142b256]
- Updated dependencies [08142b256]
- Updated dependencies [b51ee6ece]
  - @backstage/techdocs-common@0.4.0
  - @backstage/test-utils@0.1.7
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.5.5

### Patch Changes

- 5fa3bdb55: Add `href` in addition to `onClick` to `ItemCard`. Ensure that the height of a
  `ItemCard` with and without tags is equal.
- e44925723: `techdocs.requestUrl` and `techdocs.storageUrl` are now optional configs and the discovery API will be used to get the URL where techdocs plugin is hosted.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [c777df180]
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [e44925723]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [f0320190d]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/techdocs-common@0.3.7
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.5.4

### Patch Changes

- a5e27d5c1: Create type for TechDocsMetadata (#3716)

  This change introduces a new type (TechDocsMetadata) in packages/techdocs-common. This type is then introduced in the endpoint response in techdocs-backend and in the api interface in techdocs (frontend).

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [53c9c51f2]
- Updated dependencies [a5e27d5c1]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12
  - @backstage/techdocs-common@0.3.5

## 0.5.3

### Patch Changes

- dbe4450c3: Google Cloud authentication in TechDocs has been improved.

  1. `techdocs.publisher.googleGcs.credentials` is now optional. If it is missing, `GOOGLE_APPLICATION_CREDENTIALS`
     environment variable (and some other methods) will be used to authenticate.
     Read more here https://cloud.google.com/docs/authentication/production

  2. `techdocs.publisher.googleGcs.projectId` is no longer used. You can remove it from your `app-config.yaml`.

- a6f9dca0d: Remove dependency on `@backstage/core-api`. No plugin should ever depend on that package; it's an internal concern whose important bits are re-exported by `@backstage/core` which is the public facing dependency to use.
- b3b9445df: AWS S3 authentication in TechDocs has been improved.

  1. `techdocs.publisher.awsS3.bucketName` is now the only required config. `techdocs.publisher.awsS3.credentials` and `techdocs.publisher.awsS3.region` are optional.

  2. If `techdocs.publisher.awsS3.credentials` and `techdocs.publisher.awsS3.region` are missing, the AWS environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_REGION` will be used. There are more better ways of setting up AWS authentication. Read the guide at https://backstage.io/docs/features/techdocs/using-cloud-storage

- e5d12f705: Use `history.pushState` for hash link navigation.
- Updated dependencies [68ad5af51]
- Updated dependencies [f3b064e1c]
- Updated dependencies [371f67ecd]
- Updated dependencies [f1e74777a]
- Updated dependencies [dbe4450c3]
- Updated dependencies [c00488983]
- Updated dependencies [265a7ab30]
- Updated dependencies [5826d0973]
- Updated dependencies [b3b9445df]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/techdocs-common@0.3.3
  - @backstage/catalog-model@0.6.1
  - @backstage/plugin-catalog@0.2.11
  - @backstage/core@0.4.4

## 0.5.2

### Patch Changes

- 359f9d2d8: Added configuration schema for the commonly used properties of techdocs and techdocs-backend plugins
- Updated dependencies [a08c32ced]
- Updated dependencies [7e0b8cac5]
- Updated dependencies [8804e8981]
- Updated dependencies [87c0c53c2]
- Updated dependencies [86c3c652a]
- Updated dependencies [27f2af935]
  - @backstage/core-api@0.2.8
  - @backstage/core@0.4.3
  - @backstage/plugin-catalog@0.2.9
  - @backstage/techdocs-common@0.3.1

## 0.5.1

### Patch Changes

- Updated dependencies [d681db2b5]
- Updated dependencies [1dc445e89]
- Updated dependencies [342270e4d]
- Updated dependencies [1dc445e89]
- Updated dependencies [a8573e53b]
  - @backstage/core-api@0.2.7
  - @backstage/core@0.4.2
  - @backstage/test-utils@0.1.6
  - @backstage/plugin-catalog@0.2.8
  - @backstage/techdocs-common@0.3.0

## 0.5.0

### Minor Changes

- dae4f3983: _Breaking changes_

  1. Added option to use Google Cloud Storage as a choice to store the static generated files for TechDocs.
     It can be configured using `techdocs.publisher.type` option in `app-config.yaml`.
     Step-by-step guide to configure GCS is available here https://backstage.io/docs/features/techdocs/using-cloud-storage
     Set `techdocs.publisher.type` to `'local'` if you want to continue using local filesystem to store TechDocs files.

  2. `techdocs.builder` is now required and can be set to `'local'` or `'external'`. (Set it to `'local'` for now, since CI/CD build
     workflow for TechDocs will be available soon (in few weeks)).
     If builder is set to 'local' and you open a TechDocs page, `techdocs-backend` will try to generate the docs, publish to storage and
     show the generated docs afterwords.
     If builder is set to `'external'`, `techdocs-backend` will only fetch the docs and will NOT try to generate and publish. In this case of `'external'`,
     we assume that docs are being built in the CI/CD pipeline of the repository.
     TechDocs will not assume a default value for `techdocs.builder`. It is better to explicitly define it in the `app-config.yaml`.

  3. When configuring TechDocs in your backend, there is a difference in how a new publisher is created.

  ```
  ---  const publisher = new LocalPublish(logger, discovery);
  +++  const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  Based on the config `techdocs.publisher.type`, the publisher could be either Local publisher or Google Cloud Storage publisher.

  4. `techdocs.storageUrl` is now a required config. Should be `http://localhost:7000/api/techdocs/static/docs` in most setups.

  5. Parts of `@backstage/plugin-techdocs-backend` have been moved to a new package `@backstage/techdocs-common` to generate docs. Also to publish docs
     to-and-fro between TechDocs and a storage (either local or external). However, a Backstage app does NOT need to import the `techdocs-common` package -
     app should only import `@backstage/plugin-techdocs` and `@backstage/plugin-techdocs-backend`.

  _Patch changes_

  1. See all of TechDocs config options and its documentation https://backstage.io/docs/features/techdocs/configuration

  2. Logic about serving static files and metadata retrieval have been abstracted away from the router in `techdocs-backend` to the instance of publisher.

  3. Removed Material UI Spinner from TechDocs header. Spinners cause unnecessary UX distraction.
     Case 1 (when docs are built and are to be served): Spinners appear for a split second before the name of site shows up. This unnecessarily distracts eyes because spinners increase the size of the Header. A dot (.) would do fine. Definitely more can be done.
     Case 2 (when docs are being generated): There is already a linear progress bar (which is recommended in Storybook).

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [dae4f3983]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [7dd2ef7d1]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/techdocs-common@0.2.0
  - @backstage/core@0.4.1
  - @backstage/core-api@0.2.6
  - @backstage/plugin-catalog@0.2.7

## 0.4.0

### Minor Changes

- 87a33d2fe: Removed modifyCss transformer and moved the css to injectCss transformer
  Fixed issue where some internal doc links would cause a reload of the page

### Patch Changes

- Updated dependencies [b6557c098]
- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [e1f4e24ef]
- Updated dependencies [1c69d4716]
- Updated dependencies [d8d5a17da]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core-api@0.2.5
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/test-utils@0.1.5
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.3.1

### Patch Changes

- da2ad65cb: Use type EntityName from catalog-model for entities
- Updated dependencies [b4488ddb0]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/core-api@0.2.4
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5
  - @backstage/test-utils@0.1.4

## 0.3.0

### Minor Changes

- 4b53294a6: - Use techdocs annotation to add repo_url if missing in mkdocs.yml. Having repo_url creates a Edit button on techdocs pages.
  - techdocs-backend: API endpoint `/metadata/mkdocs/*` renamed to `/metadata/techdocs/*`

### Patch Changes

- Updated dependencies [6f70ed7a9]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [700a212b4]
  - @backstage/plugin-catalog@0.2.4
  - @backstage/catalog-model@0.3.1
  - @backstage/core-api@0.2.3

## 0.2.3

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-catalog@0.2.3

## 0.2.2

### Patch Changes

- 1722cb53c: Added configuration schema
- Updated dependencies [1722cb53c]
- Updated dependencies [8b7737d0b]
  - @backstage/core@0.3.1
  - @backstage/plugin-catalog@0.2.2
  - @backstage/test-utils@0.1.3

## 0.2.1

### Patch Changes

- Updated dependencies [c5bab94ab]
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [2d0bd1be7]
  - @backstage/core-api@0.2.1
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-catalog@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 8351ad79b: Add a message if techdocs takes long time to load

  Fixes #2416.

  The UI after the change should look like this:

  ![techdocs-progress-bar](https://user-images.githubusercontent.com/33940798/94189286-296ac980-fec8-11ea-9051-1b3db938d12f.gif)

### Patch Changes

- 782f3b354: add test case for Progress component
- 57b54c8ed: While techdocs fetches site name and metadata for the component, the page title was displayed as '[object Object] | Backstage'. This has now been fixed to display the component ID if site name is not present or being fetched.
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [cbbd271c4]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [368fd8243]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [f0aa01bcc]
- Updated dependencies [0aecfded0]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [8b9c8196f]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [60d40892c]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [2ebcfac8d]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [0b956f21b]
- Updated dependencies [26e69ab1a]
- Updated dependencies [97c2cb19b]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [cbab5bbf8]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-catalog@0.2.0
  - @backstage/core-api@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
