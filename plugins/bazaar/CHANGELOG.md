# @backstage/plugin-bazaar

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.15.2
  - @backstage/plugin-catalog@0.10.0
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/catalog-client@0.9.0

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.15.2-next.0
  - @backstage/plugin-catalog@0.10.0-next.0
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/catalog-client@0.9.0-next.0

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog@0.9.1
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/cli@0.15.0

## 0.1.15

### Patch Changes

- 67a7c02d26: Remove usages of `EntityRef` and `parseEntityName` from `@backstage/catalog-model`
- Updated dependencies
  - @backstage/plugin-catalog@0.9.0
  - @backstage/cli@0.14.1
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/core-plugin-api@0.7.0

## 0.1.14

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/cli@0.14.0
  - @backstage/catalog-client@0.7.0
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-catalog@0.8.0
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/catalog-model@0.10.0

## 0.1.13

### Patch Changes

- d674971d3a: Rolling back the `@date-io/luxon` bump as this broke both packages, and we need it for `@material-ui/pickers`
- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/cli@0.13.2
  - @backstage/core-components@0.8.8
  - @backstage/plugin-catalog-react@0.6.14
  - @backstage/plugin-catalog@0.7.12

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.2-next.0
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0
  - @backstage/plugin-catalog@0.7.12-next.0

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13
  - @backstage/cli@0.13.1
  - @backstage/plugin-catalog@0.7.11

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/cli@0.13.1-next.0
  - @backstage/plugin-catalog@0.7.11-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.6
  - @backstage/cli@0.13.0
  - @backstage/plugin-catalog@0.7.10

## 0.1.10

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- 8a6950b822: Switched out internal usage of the `catalogRouteRef` from `@backstage/plugin-catalog-react`.
- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/cli@0.12.0
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog@0.7.9
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.1.10-next.0

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/cli@0.12.0-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/plugin-catalog@0.7.9-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0

## 0.1.9

### Patch Changes

- 6eb6e2dc31: Add Bazaar plugin to marketplace and some minor refactoring
- b47965beec: build(deps): bump `@date-io/luxon` from 1.3.13 to 2.11.1
- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/cli@0.11.0
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9
  - @backstage/plugin-catalog@0.7.8

## 0.1.8

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/cli@0.10.5
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/core-components@0.8.3
  - @backstage/plugin-catalog@0.7.7

## 0.1.7

### Patch Changes

- 26926bb7a7: made the linkage between a Bazaar project to a catalog Entity optional
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2
  - @backstage/cli@0.10.3
  - @backstage/plugin-catalog@0.7.5

## 0.1.6

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-catalog@0.7.4
  - @backstage/plugin-catalog-react@0.6.5
  - @backstage/cli@0.10.1

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.6
  - @backstage/cli@0.10.0
  - @backstage/core-plugin-api@0.2.2

## 0.1.4

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- f6ba309d9e: A Bazaar project has been extended with the following fields: size, start date (optional), end date (optional) and a responsible person.
- Updated dependencies
  - @backstage/plugin-catalog@0.7.3
  - @backstage/cli@0.9.0
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.1.3

### Patch Changes

- 4a336fd292: Name extension to remove deprecation warning
- Updated dependencies
  - @backstage/cli@0.8.2
  - @backstage/core-components@0.7.3
  - @backstage/core-plugin-api@0.1.13
  - @backstage/plugin-catalog-react@0.6.3

## 0.1.2

### Patch Changes

- 5e43a73dd4: Bumped plugin-catalog-react version from 0.5.0 to 0.6.0
- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/core-plugin-api@0.1.11
  - @backstage/cli@0.8.0
  - @backstage/plugin-catalog@0.7.2
  - @backstage/plugin-catalog-react@0.6.1
  - @backstage/catalog-model@0.9.5
