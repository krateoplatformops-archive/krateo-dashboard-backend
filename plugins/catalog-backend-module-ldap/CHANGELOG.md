# @backstage/plugin-catalog-backend-module-ldap

## 0.4.0

### Minor Changes

- 9461f73643: **BREAKING**: Added a `schedule` field to `LdapOrgEntityProvider.fromConfig`, which is required. If you want to retain the old behavior of scheduling the provider manually, you can set it to the string value `'manual'`. But you may want to leverage the ability to instead pass in the recurring task schedule information directly. This will allow you to simplify your backend setup code to not need an intermediate variable and separate scheduling code at the bottom.

  All things said, a typical setup might now look as follows:

  ```diff
   // packages/backend/src/plugins/catalog.ts
  +import { Duration } from 'luxon';
  +import { LdapOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-ldap';
   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  // The target parameter below needs to match the ldap.providers.target
  +  // value specified in your app-config.
  +  builder.addEntityProvider(
  +    LdapOrgEntityProvider.fromConfig(env.config, {
  +      id: 'our-ldap-master',
  +      target: 'ldaps://ds.example.net',
  +      logger: env.logger,
  +      schedule: env.scheduler.createScheduledTaskRunner({
  +        frequency: Duration.fromObject({ minutes: 60 }),
  +        timeout: Duration.fromObject({ minutes: 15 }),
  +      }),
  +    }),
  +  );
  ```

### Patch Changes

- f751e84572: Ignore search referrals instead of throwing an error.
- Updated dependencies
  - @backstage/backend-tasks@0.2.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0

## 0.4.0-next.0

### Minor Changes

- 9461f73643: **BREAKING**: Added a `schedule` field to `LdapOrgEntityProvider.fromConfig`, which is required. If you want to retain the old behavior of scheduling the provider manually, you can set it to the string value `'manual'`. But you may want to leverage the ability to instead pass in the recurring task schedule information directly. This will allow you to simplify your backend setup code to not need an intermediate variable and separate scheduling code at the bottom.

  All things said, a typical setup might now look as follows:

  ```diff
   // packages/backend/src/plugins/catalog.ts
  +import { Duration } from 'luxon';
  +import { LdapOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-ldap';
   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  // The target parameter below needs to match the ldap.providers.target
  +  // value specified in your app-config.
  +  builder.addEntityProvider(
  +    LdapOrgEntityProvider.fromConfig(env.config, {
  +      id: 'our-ldap-master',
  +      target: 'ldaps://ds.example.net',
  +      logger: env.logger,
  +      schedule: env.scheduler.createScheduledTaskRunner({
  +        frequency: Duration.fromObject({ minutes: 60 }),
  +        timeout: Duration.fromObject({ minutes: 15 }),
  +      }),
  +    }),
  +  );
  ```

### Patch Changes

- f751e84572: Ignore search referrals instead of throwing an error.
- Updated dependencies
  - @backstage/backend-tasks@0.2.0-next.0
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.3.15

### Patch Changes

- 83a83381b0: Use the new `processingResult` export from the catalog backend
- 66aa05c23c: Fixed bug in Catalog LDAP module to acknowledge page events to continue receiving entries if pagePause=true
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/plugin-catalog-backend@0.23.0

## 0.3.14

### Patch Changes

- ed09ad8093: Updated usage of the `LocationSpec` type from `@backstage/catalog-model`, which is deprecated.
- 25e97e7242: Minor wording update
- df61ca71dd: Implemented required `getProcessorName` method for catalog processor.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.22.0
  - @backstage/catalog-model@0.11.0

## 0.3.13

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 244d24ebc4: Import `Location` from the `@backstage/catalog-client` package.
- 27eccab216: Replaces use of deprecated catalog-model constants.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.4
  - @backstage/errors@0.2.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.3.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.3

## 0.3.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.3-next.0

## 0.3.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2

## 0.3.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2-next.0

## 0.3.10

### Patch Changes

- 3368dc6b62: Make sure to clone objects sent to `ldapjs` since the library modifies them
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10

## 0.3.10-next.0

### Patch Changes

- 3368dc6b62: Make sure to clone objects sent to `ldapjs` since the library modifies them
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0

## 0.3.9

### Patch Changes

- 2b19fd2e94: Make sure to avoid accidental data sharing / mutation of `set` values
- 722681b1b1: Clean up API report
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/plugin-catalog-backend@0.20.0
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.3.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.19.0

## 0.3.7

### Patch Changes

- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/plugin-catalog-backend@0.18.0

## 0.3.6

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.2
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/catalog-model@0.9.6

## 0.3.5

### Patch Changes

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.1
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.0

## 0.3.3

### Patch Changes

- a31afc5b62: Replace slash stripping regexp with trimEnd to remove CodeQL warning
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.16.0
  - @backstage/catalog-model@0.9.4

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.15.0

## 0.3.1

### Patch Changes

- 8b016ce67b: Alters LDAP processor to handle one SearchEntry at a time
- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.14.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10

## 0.3.0

### Minor Changes

- 54b441abe: Introduce `LdapOrgEntityProvider` as an alternative to `LdapOrgReaderProcessor`. This also changes the `LdapClient` interface to require a logger.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.3
  - @backstage/config@0.1.7

## 0.2.2

### Patch Changes

- 2a2a2749b: chore(deps): bump `@types/ldapjs` from 1.0.10 to 2.2.0
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.1

## 0.2.1

### Patch Changes

- afe3e4b54: Expose missing types used by the custom transformers
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.0

## 0.2.0

### Minor Changes

- b055ef88a: Add extension points to the `LdapOrgReaderProcessor` to make it possible to do more advanced modifications
  of the ingested users and groups.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-backend@0.12.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.11.0
