# @backstage/plugin-catalog-backend-module-msgraph

## 0.2.19

### Patch Changes

- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0

## 0.2.19-next.0

### Patch Changes

- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.2.18

### Patch Changes

- c820a49426: add config option `groupExpand` to allow expanding a single relationship
- 83a83381b0: Use the new `processingResult` export from the catalog backend
- 4bc61a64e2: add documentation for config options `userGroupMemberSearch` and `groupSearch`
- f9bb6aa0aa: add `userExpand` config option to allow expanding a single relationship
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/plugin-catalog-backend@0.23.0

## 0.2.17

### Patch Changes

- ed09ad8093: Updated usage of the `LocationSpec` type from `@backstage/catalog-model`, which is deprecated.
- 25e97e7242: Minor wording update
- a097678475: add configuration to use search criteria to select groups
- df61ca71dd: Implemented required `getProcessorName` method for catalog processor.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.22.0
  - @backstage/catalog-model@0.11.0

## 0.2.16

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 27eccab216: Replaces use of deprecated catalog-model constants.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.4
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14

## 0.2.15

### Patch Changes

- 9b122a780c: Add userExpand option to allow users to expand fields retrieved from the Graph API - for use in custom transformers
- 7bb1bde7f6: Minor API cleanups
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.3

## 0.2.15-next.0

### Patch Changes

- 9b122a780c: Add userExpand option to allow users to expand fields retrieved from the Graph API - for use in custom transformers
- 7bb1bde7f6: Minor API cleanups
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.3-next.0

## 0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2

## 0.2.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2-next.0

## 0.2.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10

## 0.2.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0

## 0.2.12

### Patch Changes

- 722681b1b1: Clean up API report
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/plugin-catalog-backend@0.20.0
  - @backstage/catalog-model@0.9.9

## 0.2.11

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.19.0

## 0.2.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.18.0

## 0.2.9

### Patch Changes

- 779d7a2304: Tweak logic for msgraph catalog ingesting for display names with security groups

  Previously security groups that weren't mail enabled were imported with UUIDs, now they use the display name.

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.3

## 0.2.8

### Patch Changes

- 406dcf06e5: Add `MicrosoftGraphOrgEntityProvider` as an alternative to `MicrosoftGraphOrgReaderProcessor` that automatically handles user and group deletions.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.1
  - @backstage/catalog-model@0.9.5

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.0

## 0.2.6

### Patch Changes

- ff7c6cec1a: Allow loading users using group membership
- 95869261ed: Adding some documentation for the `msgraph` client
- a31afc5b62: Replace slash stripping regexp with trimEnd to remove CodeQL warning
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.16.0
  - @backstage/catalog-model@0.9.4

## 0.2.5

### Patch Changes

- 664bba5c45: Bumped `@microsoft/microsoft-graph-types` to v2
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.15.0

## 0.2.4

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.14.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10

## 0.2.3

### Patch Changes

- 77cdc5a84: Pass along a `UserTransformer` to the read step
- be498d22f: Pass along a `OrganizationTransformer` to the read step
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.3
  - @backstage/config@0.1.7

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-backend@0.12.0

## 0.2.0

### Minor Changes

- 115473c08: Handle error gracefully if failure occurs while loading photos using Microsoft Graph API.

  This includes a breaking change: you now have to pass the `options` object to `readMicrosoftGraphUsers` and `readMicrosoftGraphOrg`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.11.0

## 0.1.1

### Patch Changes

- 127048f92: Move `MicrosoftGraphOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
  to `@backstage/plugin-catalog-backend-module-msgraph`.

  The `MicrosoftGraphOrgReaderProcessor` isn't registered by default anymore, if
  you want to continue using it you have to register it manually at the catalog
  builder:

  1. Add dependency to `@backstage/plugin-catalog-backend-module-msgraph` to the `package.json` of your backend.
  2. Add the processor to the catalog builder:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(config, {
      logger,
    }),
  );
  ```

  For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-msgraph` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md).

- 127048f92: Allow customizations of `MicrosoftGraphOrgReaderProcessor` by passing an
  optional `groupTransformer`, `userTransformer`, and `organizationTransformer`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.10.4
  - @backstage/catalog-model@0.8.4
