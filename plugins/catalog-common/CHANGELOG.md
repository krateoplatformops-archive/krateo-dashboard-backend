# @backstage/plugin-catalog-common

## 0.2.2

### Patch Changes

- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- Updated dependencies
  - @backstage/search-common@0.3.1

## 0.2.2-next.0

### Patch Changes

- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- Updated dependencies
  - @backstage/search-common@0.3.1-next.0

## 0.2.1

### Patch Changes

- Fixed runtime resolution of the `/alpha` entry point.

## 0.2.0

### Minor Changes

- e3c2bfef11: Remove resourceType property from catalogEntityCreatePermission. Resource type refers to the type of resources whose resourceRefs should be passed along with authorize requests, to allow conditional responses for that resource type. Since creation does not correspond to an entity (as the entity does not exist at the time of authorization), the resourceRef should not be included on the permission.
- 81273e95cf: **Breaking**: Mark permission-related exports as alpha. This means that the exports below should now be imported from `@backstage/plugin-catalog-common/alpha` instead of `@backstage/plugin-catalog-common`.

  - `RESOURCE_TYPE_CATALOG_ENTITY`
  - `catalogEntityReadPermission`
  - `catalogEntityCreatePermission`
  - `catalogEntityDeletePermission`
  - `catalogEntityRefreshPermission`
  - `catalogLocationReadPermission`
  - `catalogLocationCreatePermission`
  - `catalogLocationDeletePermission`

### Patch Changes

- ab7b6cb7b1: **DEPRECATION**: Moved the `CatalogEntityDocument` to `@backstage/plugin-catalog-common` and deprecated the export from `@backstage/plugin-catalog-backend`.

  A new `type` field has also been added to `CatalogEntityDocument` as a replacement for `componentType`, which is now deprecated. Both fields are still present and should be set to the same value in order to avoid issues with indexing.

  Any search customizations need to be updated to use this new `type` field instead, including any custom frontend filters, custom frontend result components, custom search decorators, or non-default Catalog collator implementations.

- Updated dependencies
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/search-common@0.3.0

## 0.1.4

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/plugin-permission-common@0.5.1

## 0.1.3

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/plugin-permission-common@0.5.0

## 0.1.2

### Patch Changes

- ba59832aed: Adds new `catalogEntityCreatePermission` which can be imported and used when authoring a permission policy to restrict/grant a user's access to the catalog import plugin. (And the "Register Existing Component" button which navigates there).

## 0.1.2-next.0

### Patch Changes

- ba59832aed: Adds new `catalogEntityCreatePermission` which can be imported and used when authoring a permission policy to restrict/grant a user's access to the catalog import plugin. (And the "Register Existing Component" button which navigates there).

## 0.1.1

### Patch Changes

- 7e38acaa9e: Remove Catalog Location resource type
- Updated dependencies
  - @backstage/plugin-permission-common@0.4.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.4.0-next.0

## 0.1.0

### Minor Changes

- 393f107893: Create catalog-common and add catalog permissions.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.3.0
