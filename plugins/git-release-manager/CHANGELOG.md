# @backstage/plugin-git-release-manager

## 0.3.4

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0

## 0.3.3

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- Updated dependencies
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.3.2

### Patch Changes

- 82ea1f2bed: Minor internal type improvement
- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/core-plugin-api@0.1.11

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.8
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.3.0

### Minor Changes

- 6c318336b4: Errors caused while patching can leave the release branch in a broken state. Most commonly caused due to merge errors.

  This has been solved by introducing a dry run prior to patching the release branch. The dry run will attempt to cherry pick the selected patch commit onto a temporary branch created off of the release branch. If it succeeds, the temporary branch is deleted and the patch is applied on the release branch

### Patch Changes

- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/integration@0.6.7

## 0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.6
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.2.7

### Patch Changes

- 023350f910: Remove 'refresh' icon from success dialog's OK-CTA. User feedback deemed it confusing.
- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/integration@0.6.5

## 0.2.6

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/integration@0.6.4
  - @backstage/core-plugin-api@0.1.8

## 0.2.5

### Patch Changes

- 27ef7b645: Wrap each feature in custom feature arrays with an element containing a 'key' to avoid missing-key-warnings
- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/core-components@0.4.0

## 0.2.4

### Patch Changes

- c9e61d909: Expose internal constants, helpers and components to make it easier for users to build custom features for GRM.
- Updated dependencies
  - @backstage/core-components@0.3.3
  - @backstage/integration@0.6.2

## 0.2.3

### Patch Changes

- 8bedb75ae: Update Luxon dependency to 2.x
- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5
  - @backstage/integration@0.5.9

## 0.2.1

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.2.0

### Minor Changes

- a2d8922c9: Enable users to add custom features

  Add more metadata to success callbacks

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.1.6

## 0.1.3

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.1.2

### Patch Changes

- f915a342d: [ImgBot] Optimize images
- Updated dependencies [65e6c4541]
- Updated dependencies [5da6a561d]
  - @backstage/core@0.7.10
  - @backstage/integration@0.5.3
