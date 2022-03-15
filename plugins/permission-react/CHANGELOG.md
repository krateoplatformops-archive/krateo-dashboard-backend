# @backstage/plugin-permission-react

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.8.0
  - @backstage/plugin-permission-common@0.5.2

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.7.0

## 0.3.1

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/config@0.1.14

## 0.3.0

### Minor Changes

- 0ae4f4cc82: **BREAKING**: Update to use renamed request and response types from @backstage/plugin-permission-common.

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/plugin-permission-common@0.4.0
  - @backstage/core-plugin-api@0.6.0
  - @backstage/config@0.1.13

## 0.3.0-next.0

### Minor Changes

- 0ae4f4cc82: **BREAKING**: Update to use renamed request and response types from @backstage/plugin-permission-common.

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/plugin-permission-common@0.4.0-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/config@0.1.13-next.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-permission-common@0.3.1

## 0.2.1

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1

## 0.2.0

### Minor Changes

- 70281a475b: Breaking Changes:

  - Remove "api" suffixes from constructor parameters in IdentityPermissionApi.create

  ```diff
    const { config, discovery, identity } = options;
  -  const permissionApi = IdentityPermissionApi.create({
  -    configApi: config,
  -    discoveryApi: discovery,
  -    identityApi: identity
  -  });
  +  const permissionApi = IdentityPermissionApi.create({ config, discovery, identity });
  ```

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-permission-common@0.3.0

## 0.1.1

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/core-plugin-api@0.3.0

## 0.1.0

### Minor Changes

- 6ed24445a9: Add @backstage/plugin-permission-react

  @backstage/plugin-permission-react is a library containing utils for implementing permissions in your frontend Backstage plugins. See [the authorization PRFC](https://github.com/backstage/backstage/pull/7761) for more details.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.2.2
