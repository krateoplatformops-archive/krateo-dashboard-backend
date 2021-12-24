# @backstage/plugin-user-settings

## 0.3.13

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0

## 0.3.12

### Patch Changes

- 9a1c8e92eb: The theme switcher now renders the title of themes instead of their variant
- Updated dependencies
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2

## 0.3.11

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- 274a4fc633: Add Props Icon for Sidebar Item SidebarSearchField and Settings
- Updated dependencies
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.3.10

### Patch Changes

- 63602a1753: Align grid height
- 202f322927: Atlassian auth provider

  - AtlassianAuth added to core-app-api
  - Atlassian provider added to plugin-auth-backend
  - Updated user-settings with Atlassian connection

- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/core-plugin-api@0.1.11

## 0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.3.8

### Patch Changes

- 4c3eea7788: Bitbucket Cloud authentication - based on the existing GitHub authentication + changes around BB apis and updated scope.

  - BitbucketAuth added to core-app-api.
  - Bitbucket provider added to plugin-auth-backend.
  - Cosmetic entry for Bitbucket connection in user-settings Authentication Providers tab.

- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10

## 0.3.7

### Patch Changes

- 79ebee7a6b: Add "data-testid" for e2e tests and fix techdocs entity not found error.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.3.6

### Patch Changes

- 038b9763d1: Add search to FeatureFlags
- Updated dependencies
  - @backstage/core-components@0.5.0

## 0.3.5

### Patch Changes

- 6082b9178c: Fix import for `createPlugin` in example snippet
- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/core-plugin-api@0.1.8

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.0

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5

## 0.3.2

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

## 0.3.1

### Patch Changes

- b5953c1df: Aligns switch left and allows clicking on rows
- Updated dependencies
  - @backstage/core-components@0.1.6

## 0.3.0

### Minor Changes

- 71afed7f3: Exported and renamed components from the `@backstage/plugin-user-settings` plugin , to be able to use it in the consumer side and customize the `SettingPage`

## 0.2.12

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.2.11

### Patch Changes

- 42a2d2ebc: Fix a bug that prevented changing themes on the user settings page when the theme `id` didn't match exactly the theme `variant`.
- Updated dependencies
  - @backstage/core@0.7.13

## 0.2.10

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [889d89b6e]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9

## 0.2.9

### Patch Changes

- dd7fa21e2: Adds Auth0 to the default Authentication Providers settings page

## 0.2.8

### Patch Changes

- 147b4c5b1: Avoid using `ApiRef` descriptions in the UI.
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/core@0.7.2

## 0.2.7

### Patch Changes

- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [4c049a1a1]
  - @backstage/core@0.7.0

## 0.2.6

### Patch Changes

- d872f662d: Use routed tabs to link to every settings page.
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2

## 0.2.5

### Patch Changes

- bc5082a00: Migrate to new composability API, exporting the plugin as `userSettingsPlugin` and the page as `UserSettingsPage`.
- de98c32ed: Keep the Pin Sidebar setting visible on small screens.
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

## 0.2.4

### Patch Changes

- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
  - @backstage/core@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [1c69d4716]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/theme@0.2.2

## 0.2.2

### Patch Changes

- 1722cb53c: Added configuration schema
- Updated dependencies [1722cb53c]
  - @backstage/core@0.3.1

## 0.2.1

### Patch Changes

- 5a2705de2: Export `AuthProviders`, `DefaultProviderSettings` and `ProviderSettingsItem`.
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

- 4fc1d440e: Add settings button to sidebar

### Patch Changes

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
