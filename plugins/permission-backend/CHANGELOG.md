# @backstage/plugin-permission-backend

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-auth-node@0.1.5
  - @backstage/plugin-permission-node@0.5.4

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-auth-node@0.1.5-next.0
  - @backstage/plugin-permission-node@0.5.4-next.0

## 0.5.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/plugin-permission-node@0.5.3
  - @backstage/plugin-auth-node@0.1.4

## 0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-permission-node@0.5.2
  - @backstage/plugin-auth-node@0.1.3

## 0.5.1

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/plugin-auth-node@0.1.2
  - @backstage/plugin-permission-common@0.5.1
  - @backstage/plugin-permission-node@0.5.1

## 0.5.0

### Minor Changes

- e2cf0662eb: Add a warning if the permission backend is used without setting `permission.enabled=true`.

  **BREAKING** Permission backend's `createRouter` now requires a `config` option.

  ```diff
  // packages/backend/src/plugins/permission.ts

  ...
  export default async function createPlugin({
    ...
  + config,
  }: PluginEnvironment) {
    return createRouter({
      ...
  +   config,
    });
  }
  ```

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/plugin-auth-node@0.1.1
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/config@0.1.14
  - @backstage/plugin-permission-node@0.5.0

## 0.4.3

### Patch Changes

- b3f3e42036: Use `getBearerTokenFromAuthorizationHeader` from `@backstage/plugin-auth-node` instead of the deprecated `IdentityClient` method.
- Updated dependencies
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-auth-node@0.1.0
  - @backstage/plugin-permission-node@0.4.3

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.10.0-next.0
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-permission-node@0.4.3-next.0

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-permission-node@0.4.2

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0-next.1
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-permission-node@0.4.2-next.1

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0-next.0
  - @backstage/plugin-permission-node@0.4.2-next.0

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.8.0
  - @backstage/backend-common@0.10.5
  - @backstage/plugin-permission-node@0.4.1

## 0.4.0

### Minor Changes

- b768259244: **BREAKING**: Wrap batched requests and responses to /authorize in an envelope object. The latest version of the PermissionClient in @backstage/permission-common uses the new format - as long as the permission-backend is consumed using this client, no other changes are necessary.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.7.0
  - @backstage/plugin-permission-common@0.4.0
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/plugin-permission-node@0.4.0

## 0.4.0-next.0

### Minor Changes

- b768259244: **BREAKING**: Wrap batched requests and responses to /authorize in an envelope object. The latest version of the PermissionClient in @backstage/permission-common uses the new format - as long as the permission-backend is consumed using this client, no other changes are necessary.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.7.0-next.0
  - @backstage/plugin-permission-common@0.4.0-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-permission-node@0.4.0-next.0

## 0.3.0

### Minor Changes

- 419ca637c0: Optimizations to the integration between the permission backend and plugin-backends using createPermissionIntegrationRouter:

  - The permission backend already supported batched requests to authorize, but would make calls to plugin backend to apply conditions serially. Now, after applying the policy for each authorization request, the permission backend makes a single batched /apply-conditions request to each plugin backend referenced in policy decisions.
  - The `getResource` method accepted by `createPermissionIntegrationRouter` has been replaced with `getResources`, to allow consumers to make batch requests to upstream data stores. When /apply-conditions is called with a batch of requests, all required resources are requested in a single invocation of `getResources`.

  Plugin owners consuming `createPermissionIntegrationRouter` should replace the `getResource` method in the options with a `getResources` method, accepting an array of resourceRefs, and returning an array of the corresponding resources.

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-permission-node@0.3.0
  - @backstage/plugin-auth-backend@0.6.2
  - @backstage/errors@0.2.0
  - @backstage/plugin-permission-common@0.3.1

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.6.0
  - @backstage/backend-common@0.10.1
  - @backstage/plugin-permission-node@0.2.3

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/plugin-auth-backend@0.5.2
  - @backstage/plugin-permission-common@0.3.0
  - @backstage/plugin-permission-node@0.2.2

## 0.2.1

### Patch Changes

- a036b65c2f: Updated to use the new `BackstageIdentityResponse` type from `@backstage/plugin-auth-backend`.

  The `BackstageIdentityResponse` type is backwards compatible with the `BackstageIdentity`, and provides an additional `identity` field with the claims of the user.

- Updated dependencies
  - @backstage/plugin-auth-backend@0.5.0
  - @backstage/backend-common@0.9.13
  - @backstage/plugin-permission-node@0.2.1

## 0.2.0

### Minor Changes

- 450ca92330: Change route used for integration between the authorization framework and other plugin backends to use the /.well-known prefix.

### Patch Changes

- e7851efa9e: Rename and adjust permission policy return type to reduce nesting
- Updated dependencies
  - @backstage/plugin-auth-backend@0.4.10
  - @backstage/plugin-permission-node@0.2.0
  - @backstage/backend-common@0.9.12

## 0.1.0

### Minor Changes

- 7a8312f126: New package containing the backend for authorization and permissions. For more information, see the [authorization PRFC](https://github.com/backstage/backstage/pull/7761).

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.4.9
  - @backstage/plugin-permission-node@0.1.0
  - @backstage/backend-common@0.9.11
  - @backstage/plugin-permission-common@0.2.0
