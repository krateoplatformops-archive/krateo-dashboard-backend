# @backstage/plugin-shortcuts

## 0.1.15

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0

## 0.1.14

### Patch Changes

- f93e56ae3a: Add tooltip to display shortcut title on hover. This should improve the readability of shortcuts with long names, which are cutoff by ellipsis.
- Updated dependencies
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.1.13

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/theme@0.2.12
  - @backstage/core-components@0.7.2
  - @backstage/core-plugin-api@0.1.12

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.1.11

### Patch Changes

- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0

## 0.1.8

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/core-plugin-api@0.1.8

## 0.1.7

### Patch Changes

- e0a6aea82: Bumped `react-hook-form` to `^7.12.2`
- b8e8a3424: Fix material-ui warning about deprecated `onExit` prop
- Updated dependencies
  - @backstage/core-components@0.4.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5

## 0.1.5

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

## 0.1.4

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.1.3

### Patch Changes

- 15ffc1ac9: Fix horizontal scroll bar appearance issue

## 0.1.2

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- Updated dependencies [062bbf90f]
- Updated dependencies [889d89b6e]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
