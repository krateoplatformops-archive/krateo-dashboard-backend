# @backstage/plugin-code-coverage

## 0.1.19

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-catalog-react@0.6.5

## 0.1.18

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.1.17

### Patch Changes

- a5512851a0: Change represented test date from epoch to something more human friendly. Round test coverage to 2 decimal places.
- 5a85b802f3: Make dates in X-Axis sort in ascending order
- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/core-plugin-api@0.1.13
  - @backstage/plugin-catalog-react@0.6.3

## 0.1.16

### Patch Changes

- 767fe912b2: Addresses bug when file path contains multiple directories with the same name.
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/errors@0.1.4
  - @backstage/core-components@0.7.2
  - @backstage/plugin-catalog-react@0.6.2
  - @backstage/catalog-model@0.9.6
  - @backstage/core-plugin-api@0.1.12

## 0.1.15

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.1.14

### Patch Changes

- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4

## 0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/plugin-catalog-react@0.5.1

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10

## 0.1.11

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/core-plugin-api@0.1.8

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/core-components@0.4.0
  - @backstage/catalog-model@0.9.1

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5
  - @backstage/plugin-catalog-react@0.4.1

## 0.1.8

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-react@0.2.6

## 0.1.5

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-model@0.8.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.1.4

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.1.3

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
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.1.2

### Patch Changes

- 55b2fc0c0: Update tests to function in windows
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
