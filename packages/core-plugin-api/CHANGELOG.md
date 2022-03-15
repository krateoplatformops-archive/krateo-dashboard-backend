# @backstage/core-plugin-api

## 0.8.0

### Minor Changes

- bb2bb36651: **BREAKING**: Removed the deprecated `get` method from `StorageAPI` and its implementations, this method has been replaced by the `snapshot` method. The return value from snapshot no longer includes `newValue` which has been replaced by `value`. For getting notified when a value changes, use `observe# @backstage/core-plugin-api.
- af5eaa87f4: **BREAKING**: Removed deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `samlAuthApiRef` and `oidcAuthApiRef` as these APIs are too generic to be useful. Instructions for how to migrate can be found at [https://backstage.io/docs/api/deprecations#generic-auth-api-refs](https://backstage.io/docs/api/deprecations#generic-auth-api-refs).
- a480f670c7: **BREAKING**: OAuth provider id is now required when passing a provider to `createAuthRequester`.

## 0.7.0

### Minor Changes

- 33cd215b11: **BREAKING**: Removed deprecated `AnyAnalyticsContext` type which is replaced by `AnalyticsContextValue`

## 0.6.1

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 2714145cf5: Removes unused react-use dependency.
- Updated dependencies
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2
  - @backstage/version-bridge@0.1.2

## 0.6.0

### Minor Changes

- ceebe25391: Removed deprecated `IdentityApi` methods: `getUserId`, `getIdToken`, and `getProfile`.

  Existing usage of `getUserId` can be replaced by `getBackstageIdentity`, more precisely the equivalent of the previous `userId` can be retrieved like this:

  ```ts
  import { parseEntityRef } from '@backstage/catalog-model';

  const identity = await identityApi.getBackstageIdentity();
  const { name: userId } = parseEntityRef(identity.userEntityRef);
  ```

  Note that it is recommended to consume the entire `userEntityRef` rather than parsing out just the name, in order to support namespaces.

  Existing usage of `getIdToken` can be replaced by `getCredentials`, like this:

  ```ts
  const { token } = await identityApi.getCredentials();
  ```

  And existing usage of `getProfile` is replaced by `getProfileInfo`, which returns the same profile object, but is now async.

- ceebe25391: Removed deprecated `SignInResult` type, which was replaced with the new `onSignInSuccess` callback.
- d879072b0c: Removed the deprecated `id` field of `BackstageIdentityResponse`.

  Existing usage can be replaced by parsing the `name` of the `identity.userEntityRef` with `parseEntityRef` from `@backstage/catalog-model`, although note that it is recommended to consume the entire `userEntityRef` in order to support namespaces.

- 94c02b4246: Removed deprecated `BackstageIdentity` type, which was replaced by `BackstageIdentityResponse`.
- 234a36405b: Removed deprecated `OAuthRequestApi` types: `AuthProvider`, `AuthRequesterOptions`, `AuthRequester`, and `PendingAuthRequest`.

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13

## 0.6.0-next.0

### Minor Changes

- ceebe25391: Removed deprecated `IdentityApi` methods: `getUserId`, `getIdToken`, and `getProfile`.

  Existing usage of `getUserId` can be replaced by `getBackstageIdentity`, more precisely the equivalent of the previous `userId` can be retrieved like this:

  ```ts
  import { parseEntityRef } from '@backstage/catalog-model';

  const identity = await identityApi.getBackstageIdentity();
  const { name: userId } = parseEntityRef(identity.userEntityRef);
  ```

  Note that it is recommended to consume the entire `userEntityRef` rather than parsing out just the name, in order to support namespaces.

  Existing usage of `getIdToken` can be replaced by `getCredentials`, like this:

  ```ts
  const { token } = await identityApi.getCredentials();
  ```

  And existing usage of `getProfile` is replaced by `getProfileInfo`, which returns the same profile object, but is now async.

- ceebe25391: Removed deprecated `SignInResult` type, which was replaced with the new `onSignInSuccess` callback.
- d879072b0c: Removed the deprecated `id` field of `BackstageIdentityResponse`.

  Existing usage can be replaced by parsing the `name` of the `identity.userEntityRef` with `parseEntityRef` from `@backstage/catalog-model`, although note that it is recommended to consume the entire `userEntityRef` in order to support namespaces.

- 94c02b4246: Removed deprecated `BackstageIdentity` type, which was replaced by `BackstageIdentityResponse`.
- 234a36405b: Removed deprecated `OAuthRequestApi` types: `AuthProvider`, `AuthRequesterOptions`, `AuthRequester`, and `PendingAuthRequest`.

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13-next.0

## 0.5.0

### Minor Changes

- 784d8078ab: Removed the deprecated `OldIconComponent` type.
- e2eb92c109: Removed previously deprecated exports: `PluginHooks`, `PluginOutput`, and `FeatureFlagOutput`.

  The deprecated `register` method of `PluginConfig` has been removed, as well as the deprecated `output` method of `BackstagePlugin`.

### Patch Changes

- 784d8078ab: Removed direct and transitive MUI dependencies.
- Updated dependencies
  - @backstage/config@0.1.12

## 0.4.1

### Patch Changes

- c534ef2242: Deprecated `OldIconComponent`. Existing usage should be replaced with `IconComponent`.

## 0.4.0

### Minor Changes

- a195284c7b: **BREAKING CHANGE** The `StorageApi` has received several updates that fills in gaps for some use-cases and makes it easier to avoid mistakes:

  - The `StorageValueChange` type has been renamed to `StorageValueSnapshot`, the `newValue` property has been renamed to `value`, the stored value type has been narrowed to `JsonValue`, and it has received a new `presence` property that is `'unknown'`, `'absent'`, or `'present'`.
  - The `get` method has been deprecated in favor of a new `snapshot` method, which returns a `StorageValueSnapshot`.
  - The `observe# @backstage/core-plugin-api method has had its contract changed. It should now emit values when the`presence`of a key changes, this may for example happen when remotely stored values are requested on page load and the presence switches from`'unknown'`to either`'absent'`or`'present'`.

  The above changes have been made with deprecations in place to maintain much of the backwards compatibility for consumers of the `StorageApi`. The only breaking change is the narrowing of the stored value type, which may in some cases require the addition of an explicit type parameter to the `get` and `observe# @backstage/core-plugin-api methods.

- f6722d2458: - Removed deprecated option `description` from `ApiRefConfig`
  - Removed descriptions from all plugin API refs
  - Removed deprecated parameters `path`, `icon`, and `title` in `createRouteRef`
  - Removed deprecated types `Error` and `ErrorContext` from `ErrorApi`
- 68f8b10ccd: - Removed deprecation configuration option `theme` from `AppTheme` of the `AppThemeApi`
  - Removed reference to `theme` in the `app-defaults` default `AppTheme`
  - Removed logic in `AppThemeProvider` that creates `ThemeProvider` from `appTheme.theme`
- 6b69b44862: Removed deprecated types `ApiRefType` and `ApiRefsToTypes`

### Patch Changes

- 7927005152: Add `FetchApi` and related `fetchApiRef` which implement fetch, with an added Backstage token header when available.

## 0.3.1

### Patch Changes

- 18d4f500af: Deprecated the `AnyAnalyticsContext` type and mark the `AnalyticsApi` experimental.
- 8a7372cfd5: Deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `oidcAuthApiRef`, `samlAuthApiRef`, and marked the rest of the auth `ApiRef`s as experimental. For more information on how to address the deprecations, see https://backstage.io/docs/api/deprecations#generic-auth-api-refs.
- 760791a642: Renamed `AuthProvider` to `AuthProviderInfo` and add a required 'id' property to match the majority of usage. The `AuthProvider` type without the `id` property still exists but is deprecated, and all usage of it without an `id` is deprecated as well. For example, calling `createAuthRequest` without a `provider.id` is deprecated and it will be required in the future.

  The following types have been renamed. The old names are still exported but deprecated, and are scheduled for removal in a future release.

  - Renamed `AuthRequesterOptions` to `OAuthRequesterOptions`
  - Renamed `AuthRequester` to `OAuthRequester`
  - Renamed `PendingAuthRequest` to `PendingOAuthRequest`

## 0.3.0

### Minor Changes

- a036b65c2f: The `IdentityApi` has received several updates. The `getUserId`, `getProfile`, and `getIdToken` have all been deprecated.

  The replacement for `getUserId` is the new `getBackstageIdentity` method, which provides both the `userEntityRef` as well as the `ownershipEntityRefs` that are used to resolve ownership. Existing usage of the user ID would typically be using a fixed entity kind and namespace, for example `` `user:default/${identityApi.getUserId()}` ``, this kind of usage should now instead use the `userEntityRef` directly.

  The replacement for `getProfile` is the new async `getProfileInfo`.

  The replacement for `getIdToken` is the new `getCredentials` method, which provides an optional token to the caller like before, but it is now wrapped in an object for forwards compatibility.

  The deprecated `idToken` field of the `BackstageIdentity` type has been removed, leaving only the new `token` field, which should be used instead. The `BackstageIdentity` also received a new `identity` field, which is a decoded version of the information within the token. Furthermore the `BackstageIdentity` has been renamed to `BackstageIdentityResponse`, with the old name being deprecated.

  We expect most of the breaking changes in this update to have low impact since the `IdentityApi` implementation is provided by the app, but it is likely that some tests need to be updated.

  Another breaking change is that the `SignInPage` props have been updated, and the `SignInResult` type is now deprecated. This is unlikely to have any impact on the usage of this package, but it is an important change that you can find more information about in the [`@backstage/core-app-api` CHANGELOG.md](https://github.com/backstage/backstage/blob/master/packages/core-app-api/CHANGELOG.md).

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/version-bridge@0.1.1

## 0.2.2

### Patch Changes

- b291d0ed7e: Tweaked the logged deprecation warning for `createRouteRef` to hopefully make it more clear.
- bacb94ea8f: Documented the options of each of the extension creation functions.
- Updated dependencies
  - @backstage/theme@0.2.14

## 0.2.1

### Patch Changes

- 950b36393c: Deprecated `register` option of `createPlugin` and the `outputs` methods of the plugin instance.

  Introduces the `featureFlags` property to define your feature flags instead.

## 0.2.0

### Minor Changes

- 7e18ed7f29: Removed the unused `UserFlags` type.
- 7df99cdb77: Remove exports of unused types(`RouteOptions` and `RoutePath`).

### Patch Changes

- 37ebea2d68: Add deprecation warnings around `title` `icon` and `path` as they are no longer controlled when creating `routeRefs`
- 2dd2a7b2cc: Deprecated the `theme` property on `AppTheme`, replacing it with `Provider`. See https://backstage.io/docs/api/deprecations#app-theme for more details.
- b6a4bacdc4: Deprecated the `Error` and `ErrorContext` types, replacing them with identical `ErrorApiError` and `ErrorApiErrorContext` types.

## 0.1.13

### Patch Changes

- 4a336fd292: Deprecate use of extensions without name. Adds a warning to the developer console to prompt integrators to provide names for extensions.
- 8b4284cd5c: Improve API documentation for @backstage/core-plugin-api
- e059aea7b9: Deprecate unused ApiRef types
- Updated dependencies
  - @backstage/theme@0.2.13

## 0.1.12

### Patch Changes

- 41c49884d2: Start using the new `@backstage/types` package. Initially, this means using the `Observable` and `Json*` types from there. The types also remain in their old places but deprecated, and will be removed in a future release.
- 925a967f36: Replace usage of test-utils-core with test-utils
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12

## 0.1.11

### Patch Changes

- 202f322927: Atlassian auth provider

  - AtlassianAuth added to core-app-api
  - Atlassian provider added to plugin-auth-backend
  - Updated user-settings with Atlassian connection

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.

## 0.1.10

### Patch Changes

- 829bc698f4: Introducing the Analytics API: a lightweight way for plugins to instrument key
  events that could help inform a Backstage Integrator how their instance of
  Backstage is being used. The API consists of the following:

  - `useAnalytics()`, a hook to be used inside plugin components which retrieves
    an Analytics Tracker.
  - `tracker.captureEvent()`, a method on the tracker used to instrument key
    events. The method expects an action (the event name) and a subject (a unique
    identifier of the object the action is being taken on).
  - `<AnalyticsContext />`, a way to declaratively attach additional information
    to any/all events captured in the underlying React tree. There is also a
    `withAnalyticsContext()` HOC utility.
  - The `tracker.captureEvent()` method also accepts an `attributes` option for
    providing additional run-time information about an event, as well as a
    `value` option for capturing a numeric/metric value.

  By default, captured events are not sent anywhere. In order to collect and
  redirect events to an analytics system, the `analyticsApi` will need to be
  implemented and instantiated by an App Integrator.

- 4c3eea7788: Bitbucket Cloud authentication - based on the existing GitHub authentication + changes around BB apis and updated scope.

  - BitbucketAuth added to core-app-api.
  - Bitbucket provider added to plugin-auth-backend.
  - Cosmetic entry for Bitbucket connection in user-settings Authentication Providers tab.

## 0.1.9

### Patch Changes

- 98bd661240: Improve compatibility between different versions by defining the route reference type using a string key rather than a unique symbol. This change only applies to type checking and has no effect on the runtime value, where we still use the symbol.

## 0.1.8

### Patch Changes

- 671015f132: Switch to using utilities from `@backstage/version-bridge'.

## 0.1.7

### Patch Changes

- 3d238b028: Migrated component data attachment method to have better compatibility with component proxies such as `react-hot-loader`.
- Updated dependencies
  - @backstage/config@0.1.9

## 0.1.6

### Patch Changes

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.

## 0.1.5

### Patch Changes

- c4d8ff963: Switched frontend identity code to use `token` instead of the deprecated `idToken` field
- Updated dependencies
  - @backstage/config@0.1.6

## 0.1.4

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/theme@0.2.9

## 0.1.3

### Patch Changes

- 5f4339b8c: Adding `FeatureFlag` component and treating `FeatureFlags` as first class citizens to composability API

## 0.1.2

### Patch Changes

- 75b8537ce: This change adds automatic error boundaries around extensions.

  This means that all exposed parts of a plugin are wrapped in a general error boundary component, that is plugin aware. The default design for the error box is borrowed from `@backstage/errors`. To override the default "fallback", one must provide a component named `ErrorBoundaryFallback` to `createApp`, like so:

  ```ts
  const app = createApp({
    components: {
      ErrorBoundaryFallback: props => {
        // a custom fallback component
        return (
          <>
            <h1>Oops.</h1>
            <h2>
              The plugin {props.plugin.getId()} failed with{' '}
              {props.error.message}
            </h2>
            <button onClick={props.resetError}>Try again</button>
          </>
        );
      },
    },
  });
  ```

  The props here include:

  - `error`. An `Error` object or something that inherits it that represents the error that was thrown from any inner component.
  - `resetError`. A callback that will simply attempt to mount the children of the error boundary again.
  - `plugin`. A `BackstagePlugin` that can be used to look up info to be presented in the error message. For instance, you may want to keep a map of your internal plugins and team names or slack channels and present these when an error occurs. Typically, you'll do that by getting the plugin ID with `plugin.getId()`.

- da8cba44f: Apply fixes to the extension creation API that were mistakenly applied to `@backstage/core-app-api` instead.

## 0.1.1

### Patch Changes

- 031ccd45f: Made the deprecated `icon` fields compatible with the `IconComponent` type from `@backstage/core` in order to smooth out the migration.
- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [e7c5e4b30]
  - @backstage/theme@0.2.8
