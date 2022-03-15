# @backstage/plugin-auth-backend

## 0.12.1

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- bf95bb806c: Remove usages of now-removed `CatalogApi.getEntityByName`
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/catalog-model@0.13.0
  - @backstage/catalog-client@0.9.0
  - @backstage/plugin-auth-node@0.1.5

## 0.12.1-next.0

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- bf95bb806c: Remove usages of now-removed `CatalogApi.getEntityByName`
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/catalog-client@0.9.0-next.0
  - @backstage/plugin-auth-node@0.1.5-next.0

## 0.12.0

### Minor Changes

- 0c8ba31d72: **BREAKING**: The `TokenFactory.issueToken` used by custom sign-in resolvers now ensures that the sub claim given is a full entity reference of the format `<kind>:<namespace>/<name>`. Any existing custom sign-in resolver functions that do not supply a full entity reference must be updated.

### Patch Changes

- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-auth-node@0.1.4

## 0.11.0

### Minor Changes

- 3884bf0348: **BREAKING**: The default sign-in resolvers for all providers, if you choose to
  use them, now emit the token `sub` and `ent` claims on the standard,
  all-lowercase form, instead of the mixed-case form. The mixed-case form causes
  problems for implementations that naively do string comparisons on refs. The end
  result is that you may for example see your Backstage token `sub` claim now
  become `'user:default/my-id'` instead of `'user:default/My-ID'`.

  On a related note, specifically the SAML provider now correctly issues both
  `sub` and `ent` claims, and on the full entity ref form instead of the short
  form with only the ID.

  **NOTE**: For a long time, it has been strongly recommended that you provide
  your own sign-in resolver instead of using the builtin ones, and that will
  become mandatory in the future.

### Patch Changes

- d64b8d3678: chore(deps): bump `minimatch` from 3.0.4 to 5.0.0
- 6e1cbc12a6: Updated according to the new `getEntityFacets` catalog API method
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/plugin-auth-node@0.1.3

## 0.10.2

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-client@0.7.1
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/types@0.1.3
  - @backstage/plugin-auth-node@0.1.2

## 0.10.1

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- a31559d1f5: Bump `passport-oauth2` to version 1.6.1
- deaf6065db: Adapt to the new `CatalogApi.getLocationByRef`
- 1433045c08: Removed unused `helmet` dependency.
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/errors@0.2.1
  - @backstage/plugin-auth-node@0.1.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.10.0

### Minor Changes

- 08fcda13ef: The `callbackUrl` option of `OAuthAdapter` is now required.
- 6bc86fcf2d: The following breaking changes were made, which may imply specifically needing
  to make small adjustments in your custom auth providers.

  - **BREAKING**: Moved `IdentityClient`, `BackstageSignInResult`,
    `BackstageIdentityResponse`, and `BackstageUserIdentity` to
    `@backstage/plugin-auth-node`.
  - **BREAKING**: Removed deprecated type `BackstageIdentity`, please use
    `BackstageSignInResult` from `@backstage/plugin-auth-node` instead.

  While moving over, `IdentityClient` was also changed in the following ways:

  - **BREAKING**: Made `IdentityClient.listPublicKeys` private. It was only used
    in tests, and should not be part of the API surface of that class.
  - **BREAKING**: Removed the static `IdentityClient.getBearerToken`. It is now
    replaced by `getBearerTokenFromAuthorizationHeader` from
    `@backstage/plugin-auth-node`.
  - **BREAKING**: Removed the constructor. Please use the `IdentityClient.create`
    static method instead.

  Since the `IdentityClient` interface is marked as experimental, this is a
  breaking change without a deprecation period.

  In your auth providers, you may need to update your imports and usages as
  follows (example code; yours may be slightly different):

  ````diff
  -import { IdentityClient } from '@backstage/plugin-auth-backend';
  +import {
  +  IdentityClient,
  +  getBearerTokenFromAuthorizationHeader
  +} from '@backstage/plugin-auth-node';

     // ...

  -  const identity = new IdentityClient({
  +  const identity = IdentityClient.create({
       discovery,
       issuer: await discovery.getExternalBaseUrl('auth'),
     });```

     // ...

     const token =
  -     IdentityClient.getBearerToken(req.headers.authorization) ||
  +     getBearerTokenFromAuthorizationHeader(req.headers.authorization) ||
        req.cookies['token'];
  ````

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- 3396bc5973: Enabled refresh for the Atlassian provider.
- 08fcda13ef: Added a new `cookieConfigurer` option to `AuthProviderConfig` that makes it possible to override the default logic for configuring OAuth provider cookies.
- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-auth-node@0.1.0

## 0.10.0-next.0

### Minor Changes

- 08fcda13ef: The `callbackUrl` option of `OAuthAdapter` is now required.

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- 3396bc5973: Enabled refresh for the Atlassian provider.
- 08fcda13ef: Added a new `cookieConfigurer` option to `AuthProviderConfig` that makes it possible to override the default logic for configuring OAuth provider cookies.
- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.9.0

### Minor Changes

- cef64b1561: **BREAKING** Added `tokenManager` as a required property for the auth-backend `createRouter` function. This dependency is used to issue server tokens that are used by the `CatalogIdentityClient` when looking up users and their group membership during authentication.

  These changes are **required** to `packages/backend/src/plugins/auth.ts`:

  ```diff
  export default async function createPlugin({
    logger,
    database,
    config,
    discovery,
  + tokenManager,
  }: PluginEnvironment): Promise<Router> {
    return await createRouter({
      logger,
      config,
      database,
      discovery,
  +   tokenManager,
    });
  }
  ```

  **BREAKING** The `CatalogIdentityClient` constructor now expects a `TokenManager` instead of a `TokenIssuer`. The `TokenManager` interface is used to generate a server token when [resolving a user's identity and membership through the catalog](https://backstage.io/docs/auth/identity-resolver). Using server tokens for these requests allows the auth-backend to bypass authorization checks when permissions are enabled for Backstage. This change will break apps that rely on the user tokens that were previously used by the client. Refer to the ["Backend-to-backend Authentication" tutorial](https://backstage.io/docs/tutorials/backend-to-backend-auth) for more information on server token usage.

### Patch Changes

- 9d75a939b6: Fixed a bug where providers that tracked the granted scopes through a cookie would not take failed authentication attempts into account.
- 28a5f9d0b1: chore(deps): bump `passport` from 0.4.1 to 0.5.2
- 5d09bdd1de: Added custom `callbackUrl` support for multiple providers. `v0.8.0` introduced this change for `github`, and now we're adding the same capability to the following providers: `atlassian, auth0, bitbucket, gitlab, google, microsoft, oauth2, oidc, okta, onelogin`.
- 648606b3ac: Added support for storing static GitHub access tokens in cookies and using them to refresh the Backstage session.
- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.9.0-next.1

### Patch Changes

- 9d75a939b6: Fixed a bug where providers that tracked the granted scopes through a cookie would not take failed authentication attempts into account.
- 648606b3ac: Added support for storing static GitHub access tokens in cookies and using them to refresh the Backstage session.
- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.9.0-next.0

### Minor Changes

- cef64b1561: **BREAKING** Added `tokenManager` as a required property for the auth-backend `createRouter` function. This dependency is used to issue server tokens that are used by the `CatalogIdentityClient` when looking up users and their group membership during authentication.

  These changes are **required** to `packages/backend/src/plugins/auth.ts`:

  ```diff
  export default async function createPlugin({
    logger,
    database,
    config,
    discovery,
  + tokenManager,
  }: PluginEnvironment): Promise<Router> {
    return await createRouter({
      logger,
      config,
      database,
      discovery,
  +   tokenManager,
    });
  }
  ```

  **BREAKING** The `CatalogIdentityClient` constructor now expects a `TokenManager` instead of a `TokenIssuer`. The `TokenManager` interface is used to generate a server token when [resolving a user's identity and membership through the catalog](https://backstage.io/docs/auth/identity-resolver). Using server tokens for these requests allows the auth-backend to bypass authorization checks when permissions are enabled for Backstage. This change will break apps that rely on the user tokens that were previously used by the client. Refer to the ["Backend-to-backend Authentication" tutorial](https://backstage.io/docs/tutorials/backend-to-backend-auth) for more information on server token usage.

### Patch Changes

- 28a5f9d0b1: chore(deps): bump `passport` from 0.4.1 to 0.5.2

## 0.8.0

### Minor Changes

- 67349916ac: The `sub` claim in Backstage tokens generated by the default Google and OIDC sign-in resolvers are now full entity references of the format `<kind>:<namespace>/<name>`.

### Patch Changes

- 033493a8af: Running the `auth-backend` on multiple domains, perhaps different domains depending on the `auth.environment`, was previously not possible as the `domain` name of the cookie was taken from `backend.baseUrl`. This prevented any cookies to be set in the start of the auth flow as the domain of the cookie would not match the domain of the callbackUrl configured in the OAuth app. This change checks if a provider supports custom `callbackUrl`'s to be configured in the application configuration and uses the domain from that, allowing the `domain`'s to match and the cookie to be set.
- Updated dependencies
  - @backstage/backend-common@0.10.5

## 0.7.0

### Minor Changes

- 6e92ee6267: Add new authentication provider to support the oauth2-proxy.

  **BREAKING** The `AuthHandler` requires now an `AuthResolverContext` parameter. This aligns with the
  behavior of the `SignInResolver`.

- f8496730ab: Switched the handling of the `BackstageIdentityResponse` so that the returned `identity.userEntityRef` is always a full entity reference. If `userEntityRef` was previously set to `jane`, it will now be `user:default/jane`. The `userEntityRef` in the response is parsed from the `sub` claim in the payload of the Backstage token.
- a53d7d8143: Update provider subs to return full entity ref.

### Patch Changes

- f815b7e4a4: build(deps): bump `@google-cloud/firestore` from 4.15.1 to 5.0.2
- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.7.0-next.0

### Minor Changes

- 6e92ee6267: Add new authentication provider to support the oauth2-proxy.

  **BREAKING** The `AuthHandler` requires now an `AuthResolverContext` parameter. This aligns with the
  behavior of the `SignInResolver`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0

## 0.6.2

### Patch Changes

- 5333451def: Cleaned up API exports
- da9c59d6e0: Removed `@backstage/test-utils` dependency.
- 20ca7cfa5f: Switched the secure cookie mode set on the `express-session` to use `'auto'` rather than `true`. This works around an issue where cookies would not be set if TLS termination was handled in a proxy rather than having the backend served directly with HTTPS.

  The downside of this change is that secure cookies won't be used unless the backend is directly served with HTTPS. This will be remedied in a future update that allows the backend to configured for trusted proxy mode.

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9

## 0.6.1

### Patch Changes

- e0e57817d2: Added Google Cloud Identity-Aware Proxy as an identity provider.
- Updated dependencies
  - @backstage/backend-common@0.10.2

## 0.6.0

### Minor Changes

- c88cdacc1a: Avoid ever returning OAuth refresh tokens back to the client, and always exchange refresh tokens for a new one when available for all providers.

  This comes with a breaking change to the TypeScript API for custom auth providers. The `refresh` method of `OAuthHandlers` implementation must now return a `{ response, refreshToken }` object rather than a direct response. Existing `refresh` implementations are typically migrated by changing an existing return expression that looks like this:

  ```ts
  return await this.handleResult({
    fullProfile,
    params,
    accessToken,
    refreshToken,
  });
  ```

  Into the following:

  ```ts
  return {
    response: await this.handleResult({
      fullProfile,
      params,
      accessToken,
    }),
    refreshToken,
  };
  ```

### Patch Changes

- f0f81f6cc7: Replaces the usage of `got` with `node-fetch` in the `getUserPhoto` method of the Microsoft provider
- 2f26120a36: Update `auth0` and `onelogin` providers to allow for `authHandler` and `signIn.resolver` configuration.
- a9abafa9df: Fixed bug on refresh token on Okta provider, now it gets the refresh token and it sends it into providerInfo
- eb48e78886: Enforce cookie SSL protection when in production for auth-backend sessions
- Updated dependencies
  - @backstage/test-utils@0.2.1
  - @backstage/backend-common@0.10.1

## 0.5.2

### Patch Changes

- 24a67e3e2e: Fixed the fallback identity population to correctly generate an entity reference for `userEntityRef` if no token is provided.
- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/test-utils@0.2.0
  - @backstage/catalog-client@0.5.3

## 0.5.1

### Patch Changes

- 699c2e9ddc: export minimal typescript types for OIDC provider
- Updated dependencies
  - @backstage/backend-common@0.9.14
  - @backstage/catalog-model@0.9.8

## 0.5.0

### Minor Changes

- a036b65c2f: **BREAKING CHANGE** The `idToken` field of `BackstageIdentity` has been removed, with the `token` taking its place. This means you may need to update existing `signIn.resolver` implementations to return an `token` rather than an `idToken`. This also applies to custom auth providers.

  The `BackstageIdentity` type has been deprecated and will be removed in the future. Taking its place is the new `BackstageSignInResult` type with the same shape.

  This change also introduces the new `BackstageIdentityResponse` that mirrors the type with the same name from `@backstage/core-plugin-api`. The `BackstageIdentityResponse` type is different from the `BackstageSignInResult` in that it also has a `identity` field which is of type `BackstageUserIdentity` and is a decoded version of the information within the token.

  When implementing a custom auth provider that is not based on the `OAuthAdapter` you may need to convert `BackstageSignInResult` into a `BackstageIdentityResponse`, this can be done using the new `prepareBackstageIdentityResponse` function.

### Patch Changes

- 8f461e6043: Fixes potential bug introduced in `0.4.10` which causes `OAuth2AuthProvider` to authenticate using credentials in both POST payload and headers.
  This might break some stricter OAuth2 implementations so there is now a `includeBasicAuth` config option that can manually be set to `true` to enable this behavior.
- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/test-utils@0.1.24
  - @backstage/backend-common@0.9.13

## 0.4.10

### Patch Changes

- 4bf4111902: Migrated the SAML provider to implement the `authHandler` and `signIn.resolver` options.
- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- 36fa32216f: Added signIn and authHandler resolver for oidc provider
- 7071dce02d: Expose catalog lib in plugin-auth-backend, i.e `CatalogIdentityClient` class is exposed now.
- 1b69ed44f2: Added custom OAuth2.0 authorization header for generic oauth2 provider.
- Updated dependencies
  - @backstage/backend-common@0.9.12

## 0.4.9

### Patch Changes

- 9312572360: Switched to using the standardized JSON error responses for all provider endpoints.
- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/backend-common@0.9.11
  - @backstage/test-utils@0.1.23

## 0.4.8

### Patch Changes

- 892c1d9202: Update OAuthAdapter to create identity.token from identity.idToken if it does not exist, and prevent overwrites to identity.toke. Update login page commonProvider to prefer .token over .idToken
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
  - @backstage/test-utils@0.1.22

## 0.4.7

### Patch Changes

- 5ee31f860b: Only use settings that have a value when creating a new FirestoreKeyStore instance
- 3e0e2f09d5: Added forwarding of the `audience` option for the SAML provider, making it possible to enable `audience` verification.
- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/test-utils@0.1.21
  - @backstage/catalog-client@0.5.1

## 0.4.6

### Patch Changes

- 3b767f19c9: Allow OAuth state to be encoded by a stateEncoder.
- Updated dependencies
  - @backstage/test-utils@0.1.20
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6

## 0.4.5

### Patch Changes

- 9322e632e9: Require that audience URLs for Okta authentication start with https
- de3e26aecc: Fix a bug preventing an access token to be refreshed a second time with the GitHub provider.
- ab9b4a6ea6: Add Firestore as key-store provider.
  Add `auth.keyStore` section to application config.
- 202f322927: Atlassian auth provider

  - AtlassianAuth added to core-app-api
  - Atlassian provider added to plugin-auth-backend
  - Updated user-settings with Atlassian connection

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.4.4

### Patch Changes

- 0cfeea8f8f: AWS-ALB: update provider to the latest changes described [here](https://backstage.io/docs/auth/identity-resolver).

  This removes the `ExperimentalIdentityResolver` type in favor of `SignInResolver` and `AuthHandler`.
  The AWS ALB provider can now be configured in the same way as the Google provider in the example.

- defae8f579: Added extra configuration parameters for active directory file system identity
- Updated dependencies
  - @backstage/test-utils@0.1.19

## 0.4.3

### Patch Changes

- 4c3eea7788: Bitbucket Cloud authentication - based on the existing GitHub authentication + changes around BB apis and updated scope.

  - BitbucketAuth added to core-app-api.
  - Bitbucket provider added to plugin-auth-backend.
  - Cosmetic entry for Bitbucket connection in user-settings Authentication Providers tab.

- Updated dependencies
  - @backstage/test-utils@0.1.18
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/catalog-client@0.5.0

## 0.4.2

### Patch Changes

- 88622e6422: Allow users to override callback url of GitHub provider
- c46396ebb0: Update OAuth refresh handler to pass updated refresh token to ensure cookie is updated with new value.
- Updated dependencies
  - @backstage/backend-common@0.9.5

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.4.0

### Minor Changes

- 19f45179a5: Bump `passport-saml` to version 3. This is a breaking change, in that it [now requires](https://github.com/node-saml/passport-saml/pull/548) the `auth.saml.cert` parameter to be set. If you are not using SAML auth, you can ignore this.

  To update your settings, add something similar to the following to your app-config:

  ```yaml
  auth:
    saml:
      # ... other settings ...
      cert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqh ... W=='
  ```

  For more information, see the [library README](https://github.com/node-saml/passport-saml#security-and-signatures).

### Patch Changes

- 560d6810f0: Fix a bug preventing an access token to be refreshed a second time with the GitLab provider.
- de5717872d: Use a more informative error message if the configured OIDC identity provider does not provide a `userinfo_endpoint` in its metadata.
- Updated dependencies
  - @backstage/backend-common@0.9.3

## 0.3.24

### Patch Changes

- 2a105f451: Add a warning log message that `passport-saml` will require a `cert` config parameter imminently.

  We intend to upgrade this package soon, past the point where we will start to strictly require the `auth.saml.cert` configuration parameter to be present. To avoid issues starting your auth backend, please

- 31892ee25: typo fix `tenentId` in Azure auth provider docs
- e9b1e2a9f: Added signIn and authHandler resolver for oAuth2 provider
- ca45b169d: Export GitHub to allow use with Identity resolver
- Updated dependencies
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.3.23

### Patch Changes

- 392b36fa1: Added support for using authenticating via GitHub Apps in addition to GitHub OAuth Apps. It used to be possible to use GitHub Apps, but they did not handle session refresh correctly.

  Note that GitHub Apps handle OAuth scope at the app installation level, meaning that the `scope` parameter for `getAccessToken` has no effect. When calling `getAccessToken` in open source plugins, one should still include the appropriate scope, but also document in the plugin README what scopes are required in the case of GitHub Apps.

  In addition, the `authHandler` and `signInResolver` options have been implemented for the GitHub provider in the auth backend.

- ea9fe9567: Fixed a bug where OAuth state parameters would be serialized as the string `'undefined'`.
- 39fc3d7f8: Add Sign In and Handler resolver for GitLab provider
- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.3.22

### Patch Changes

- 79d24a966: Fix an issue where the default app origin was not allowed to authenticate users.

## 0.3.21

### Patch Changes

- 72a31c29a: Add support for additional app origins
- Updated dependencies
  - @backstage/backend-common@0.8.10
  - @backstage/config@0.1.7

## 0.3.20

### Patch Changes

- 29f7cfffb: Added `resolveCatalogMembership` utility to query the catalog for additional authentication claims within sign-in resolvers.
- 8bedb75ae: Update Luxon dependency to 2.x
- bfe0ff93f: Add Sign In and Handler resolver for Okta provider
- Updated dependencies
  - @backstage/backend-common@0.8.9
  - @backstage/test-utils@0.1.17

## 0.3.19

### Patch Changes

- 4edca1bd0: Allow to configure SAML auth `acceptedClockSkewMs`
- b68f2c83c: Added the `disableRefresh` option to the `OAuth2` config
- Updated dependencies
  - @backstage/test-utils@0.1.16
  - @backstage/catalog-client@0.3.18

## 0.3.18

### Patch Changes

- 2567c066d: TokenIssuer is now exported so it may be used by auth providers that are not bundled with Backstage
- Updated dependencies
  - @backstage/catalog-client@0.3.17
  - @backstage/backend-common@0.8.7
  - @backstage/test-utils@0.1.15

## 0.3.17

### Patch Changes

- 40b3c60e2: Configuration updates for the `OpenID Connect` auth provider to allow `prompt` configuration and some sensible defaults.
- f55f9df10: Add Sign In and Handler resolver for Microsoft provider
- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6

## 0.3.16

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5
  - @backstage/catalog-client@0.3.16

## 0.3.15

### Patch Changes

- 6ca29b66c: Unbreak `.well-known` OIDC routes
- 72574ac4d: Show better error message when configs defined under auth.providers.<provider> are undefined.
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/catalog-client@0.3.15

## 0.3.14

### Patch Changes

- 36e9a4084: Don't export the `defaultGoogleAuthProvider`
- c467cc4b9: Adds support for custom sign-in resolvers and profile transformations for the
  Google auth provider.

  Adds an `ent` claim in Backstage tokens, with a list of
  [entity references](https://backstage.io/docs/features/software-catalog/references)
  related to your signed-in user's identities and groups across multiple systems.

  Adds an optional `providerFactories` argument to the `createRouter` exported by
  the `auth-backend` plugin.

  Updates `BackstageIdentity` so that

  - `idToken` is deprecated in favor of `token`
  - An optional `entity` field is added which represents the entity that the user is represented by within Backstage.

  More information:

  - [The identity resolver documentation](https://backstage.io/docs/auth/identity-resolver)
    explains the concepts and shows how to implement your own.
  - The [From Identity to Ownership](https://github.com/backstage/backstage/issues/4089)
    RFC contains details about how this affects ownership in the catalog

- Updated dependencies
  - @backstage/catalog-client@0.3.14
  - @backstage/catalog-model@0.8.4
  - @backstage/test-utils@0.1.14

## 0.3.13

### Patch Changes

- 1aa31f0af: Add support for refreshing GitLab auth sessions.
- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/catalog-model@0.8.3

## 0.3.12

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0

## 0.3.11

### Patch Changes

- 65e6c4541: Remove circular dependencies
- Updated dependencies [f7f7783a3]
- Updated dependencies [c7dad9218]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5001de908]
- Updated dependencies [61c3f927c]
  - @backstage/catalog-model@0.7.10
  - @backstage/backend-common@0.8.1
  - @backstage/test-utils@0.1.12

## 0.3.10

### Patch Changes

- Updated dependencies [062bbf90f]
- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/test-utils@0.1.11
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.3.9

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
- Updated dependencies [d1b1306d9]
  - @backstage/backend-common@0.7.0
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5
  - @backstage/catalog-client@0.3.11

## 0.3.8

### Patch Changes

- 2b2b31186: When using OAuth2 authentication the name is now taken from the name property of the JWT instead of the email property
- Updated dependencies [97b60de98]
- Updated dependencies [ae6250ce3]
- Updated dependencies [98dd5da71]
- Updated dependencies [b779b5fee]
  - @backstage/catalog-model@0.7.6
  - @backstage/test-utils@0.1.10
  - @backstage/backend-common@0.6.2

## 0.3.7

### Patch Changes

- 0d55dcc74: Fixes timezone bug for auth signing keys
- 676ede643: Added the `getOriginLocationByEntity` and `removeLocationById` methods to the catalog client
- Updated dependencies [676ede643]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-client@0.3.9
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.3.6

### Patch Changes

- 449776cd6: The `auth` config types now properly accept any declared auth environment. Previously only `development` was accepted.

  The `audience` configuration is no longer required for GitLab auth; this will default to `https://gitlab.com`

## 0.3.5

### Patch Changes

- 8686eb38c: Use errors from `@backstage/errors`
- 8b5e59750: expose verifyNonce and readState publicly from auth-backend
- Updated dependencies [8686eb38c]
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [4e0b5055a]
- Updated dependencies [8686eb38c]
  - @backstage/catalog-client@0.3.8
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4
  - @backstage/test-utils@0.1.9

## 0.3.4

### Patch Changes

- 761698831: Bump to the latest version of the Knex library.
- 5f1b7ea35: Change the JWKS url value for the oidc configuration endpoint
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [761698831]
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7

## 0.3.3

### Patch Changes

- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- 3af994c81: Expose a configuration option for the oidc scope
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.3.2

### Patch Changes

- ec504e7b4: Fix for refresh token being lost during Microsoft login.
- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.3.1

### Patch Changes

- 92f01d75c: Refactored auth provider factories to accept options along with other internal refactoring of the auth providers.
- d9687c524: Fixed parsing of OIDC key timestamps when using SQLite.
- 3600ac3b0: Migrated the package from using moment to Luxon. #4278
- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4

## 0.3.0

### Minor Changes

- 1deb31141: Remove undocumented scope (default) from the OIDC auth provider which was breaking some identity services. If your app relied on this scope, you can manually specify it by adding a new factory in `packages/app/src/apis.ts`:

  ```
  export const apis = [
    createApiFactory({
      api: oidcAuthApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        oauthRequestApi: oauthRequestApiRef,
        configApi: configApiRef,
      },
      factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
        OAuth2.create({
          discoveryApi,
          oauthRequestApi,
          provider: {
            id: 'oidc',
            title: 'Your Identity Provider',
            icon: OAuth2Icon,
          },
          defaultScopes: [
            'default',
            'openid',
            'email',
            'offline_access',
          ],
          environment: configApi.getOptionalString('auth.environment'),
        }),
    }),
  ];
  ```

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- 07bafa248: Add configurable `scope` for oauth2 auth provider.

  Some OAuth2 providers require certain scopes to facilitate a user sign-in using the Authorization Code flow.
  This change adds the optional `scope` key to auth.providers.oauth2. An example is:

  ```yaml
  auth:
    providers:
      oauth2:
        development:
          clientId:
            $env: DEV_OAUTH2_CLIENT_ID
          clientSecret:
            $env: DEV_OAUTH2_CLIENT_SECRET
          authorizationUrl:
            $env: DEV_OAUTH2_AUTH_URL
          tokenUrl:
            $env: DEV_OAUTH2_TOKEN_URL
          scope: saml-login-selector openid profile email
  ```

  This tells the OAuth 2.0 AS to perform a SAML login and return OIDC information include the `profile`
  and `email` claims as part of the ID Token.

- Updated dependencies [6ed2b47d6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [72b96e880]
- Updated dependencies [5a5163519]
  - @backstage/catalog-client@0.3.6
  - @backstage/backend-common@0.5.3

## 0.2.12

### Patch Changes

- d7b1d317f: Fixed serialization issue with caching of public keys in AWS ALB auth provider
- 39b05b9ae: Use .text instead of .json for ALB key response
- 4eaa06057: Fix AWS ALB issuer check
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1

## 0.2.11

### Patch Changes

- 0643a3336: Add AWS ALB OIDC reverse proxy authentication provider
- a2291d7cc: Optional identity token authorization of api requests
- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/catalog-client@0.3.5

## 0.2.10

### Patch Changes

- 468579734: Allow blank certificates and support logout URLs in the SAML provider.
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.2.9

### Patch Changes

- 0289a059c: Add support for the majority of the Core configurations for Passport-SAML.

  These configuration keys are supported:

  - entryPoint
  - issuer
  - cert
  - privateKey
  - decryptionPvk
  - signatureAlgorithm
  - digestAlgorithm

  As part of this change, there is also a fix to the redirection behaviour when doing load balancing and HTTPS termination - the application's baseUrl is used to generate the callback URL. For properly configured Backstage installations, no changes are necessary, and the baseUrl is respected.

- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2

## 0.2.8

### Patch Changes

- cc046682e: fix bug in token expiration date

## 0.2.7

### Patch Changes

- 7b15cc271: Added configuration schema for the commonly used properties
- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1
  - @backstage/catalog-client@0.3.4

## 0.2.6

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0
  - @backstage/catalog-client@0.3.3

## 0.2.5

### Patch Changes

- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0
  - @backstage/catalog-client@0.3.2

## 0.2.4

### Patch Changes

- 50eff1d00: Allow the backend to register custom AuthProviderFactories
- 700a212b4: bug fix: issue 3223 - detect mismatching origin and indicate it in the message at auth failure
- Updated dependencies [3aa7efb3f]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2
  - @backstage/catalog-model@0.3.1

## 0.2.3

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1
  - @backstage/catalog-client@0.3.1

## 0.2.2

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
- Updated dependencies [717e43de1]
  - @backstage/backend-common@0.3.0
  - @backstage/catalog-client@0.3.0

## 0.2.1

### Patch Changes

- 752808090: Handle non-7-bit safe characters in the posted message data
- 462876399: Encode the OAuth state parameter using URL safe chars only, so that providers have an easier time forming the callback URL.
- Updated dependencies [33b7300eb]
  - @backstage/backend-common@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 819a70229: Add SAML login to backstage

  ![](https://user-images.githubusercontent.com/872486/92251660-bb9e3400-eeff-11ea-86fe-1f2a0262cd31.png)

  ![](https://user-images.githubusercontent.com/872486/93851658-1a76f200-fce3-11ea-990b-26ca1a327a15.png)

- 6d29605db: Change the default backend plugin mount point to /api
- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 6f1768c0f: Initial implementation of catalog user lookup

  This adds a basic catalog client + method for the Google provider to look up users in the catalog. It expects to find a single user entity in the catalog with a google.com/email annotation that matches the email of the Google profile.

  Right now it falls back to the old behavior of splitting the email, since I don't wanna break the sign-in flow for existing apps, not yet anyway x).

  - Added "@backstage/catalog-model@^0.1.1-alpha.23" as a dependency
  - Added "node-fetch@^2.6.1" as a dependency

- 1687b8fbb: Lookup user in Google Auth Provider

### Patch Changes

- b4e5466e1: Move auth provider router creation to router
- b652bf2cc: Add OneLogin Identity Provider to Auth Backend
- e142a2767: Better presentation of authentication errors
- Updated dependencies [3a4236570]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [5adfc005e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [b3d57961c]
- Updated dependencies [7bbeb049f]
  - @backstage/catalog-model@0.2.0
  - @backstage/backend-common@0.2.0
