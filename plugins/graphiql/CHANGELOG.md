# @backstage/plugin-graphiql

## 0.2.24

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0

## 0.2.23

### Patch Changes

- dde1681f33: chore(dependencies): bump `graphiql` package to latest

## 0.2.22

### Patch Changes

- cd398cd4ab: Letting GraphiQL use headers
- Updated dependencies
  - @backstage/core-plugin-api@0.2.1
  - @backstage/core-components@0.7.5

## 0.2.21

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.2.20

### Patch Changes

- c8215e1fe6: Add experimental `experimentalInstallationRecipe` to `package.json`.
- Updated dependencies
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.2.19

### Patch Changes

- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10

## 0.2.18

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.2.17

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0

## 0.2.16

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/core-plugin-api@0.1.8

## 0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.0

## 0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5

## 0.2.13

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

## 0.2.12

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.2.11

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [889d89b6e]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9

## 0.2.10

### Patch Changes

- c614ede9a: Updated README to have up-to-date install instructions.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.2.9

### Patch Changes

- 09eb54e01: Export `GraphiQLIcon`.
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/core@0.7.2

## 0.2.8

### Patch Changes

- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [4c049a1a1]
  - @backstage/core@0.7.0

## 0.2.7

### Patch Changes

- 87b189d00: Finalized composability API migration, now exporting the plugin as `graphiqlPlugin`.
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [54c7d02f7]
  - @backstage/core@0.6.0
  - @backstage/theme@0.2.3

## 0.2.6

### Patch Changes

- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
  - @backstage/core@0.5.0

## 0.2.5

### Patch Changes

- 5a1368ba1: Updated README
- Updated dependencies [265a7ab30]
  - @backstage/core@0.4.4

## 0.2.4

### Patch Changes

- 21f6be0f6: Patch release to force a release for the `esm.js` extension change for dynamically loading chunks

## 0.2.3

### Patch Changes

- 1dc445e89: Update to use new plugin extension API
- Updated dependencies [1dc445e89]
- Updated dependencies [342270e4d]
  - @backstage/core@0.4.2

## 0.2.2

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [1c69d4716]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/theme@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- 782f3b354: add test case for Progress component
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/core@0.2.0
  - @backstage/theme@0.2.0
