# @backstage/plugin-techdocs-backend

## 0.12.0

### Minor Changes

- 1bada775a9: Added the ability for the TechDocs Backend to (optionally) leverage a cache
  store to improve performance when reading files from a cloud storage provider.

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/backend-common@0.9.13
  - @backstage/techdocs-common@0.11.0

## 0.11.0

### Minor Changes

- 905dd952ac: **BREAKING** `DefaultTechDocsCollator` has a new required option `tokenManager`. See the create-app changelog for how to create a `tokenManager` and add it to the `PluginEnvironment`. It can then be passed to the collator in `createPlugin`:

  ```diff
  // packages/backend/src/plugins/search.ts

  ...
  export default async function createPlugin({
    ...
  + tokenManager,
  }: PluginEnvironment) {
    ...

    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
      collator: DefaultTechDocsCollator.fromConfig(config, {
        discovery,
        logger,
  +     tokenManager,
      }),
    });

    ...
  }
  ```

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- Updated dependencies
  - @backstage/integration@0.6.10
  - @backstage/backend-common@0.9.12

## 0.10.9

### Patch Changes

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
  - @backstage/techdocs-common@0.10.8

## 0.10.8

### Patch Changes

- e21e3c6102: Bumping minimum requirements for `dockerode` and `testcontainers`
- 9e64a7ac1e: Allow amazon web services s3 buckets to pass an server side encryption configuration so they can publish to encrypted buckets
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
  - @backstage/techdocs-common@0.10.7

## 0.10.7

### Patch Changes

- b45607a2ec: Make techdocs s3 publisher credentials config schema optional.

## 0.10.6

### Patch Changes

- 106a5dc3ad: Restore original casing for `kind`, `namespace` and `name` in `DefaultTechDocsCollator`.
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6
  - @backstage/search-common@0.2.1
  - @backstage/techdocs-common@0.10.5

## 0.10.5

### Patch Changes

- 177401b571: Display entity title (if defined) in titles of TechDocs search results
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/techdocs-common@0.10.4
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.10.4

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/catalog-client@0.5.0
  - @backstage/integration@0.6.7
  - @backstage/techdocs-common@0.10.3

## 0.10.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.10.2

### Patch Changes

- 1d346ba903: Modify TechDocsCollator to be aware of new TechDocs URL pattern. Modify tech docs in context search to use correct casing when creating initial filter.
- Updated dependencies
  - @backstage/backend-common@0.9.3
  - @backstage/integration@0.6.4
  - @backstage/techdocs-common@0.10.1

## 0.10.1

### Patch Changes

- 30ed662a3: Adding in-context search to TechDocs Reader component. Using existing search-backend to query for indexed search results scoped into a specific entity's techdocs. Needs TechDocsCollator enabled on the backend to work.

  Adding extra information to indexed tech docs documents for search.

- a42a142c2: Errors encountered while attempting to load TechDocs search indices at
  collation-time are now logged at `DEBUG` instead of `WARN` level.
- Updated dependencies
  - @backstage/techdocs-common@0.10.0
  - @backstage/integration@0.6.3
  - @backstage/search-common@0.2.0
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.10.0

### Minor Changes

- 58452cdb7: OpenStack Swift Client changed with Trendyol's OpenStack Swift SDK.

  ## Migration from old OpenStack Swift Configuration

  Let's assume we have the old OpenStack Swift configuration here.

  ```yaml
  techdocs:
    publisher:
      type: 'openStackSwift'
      openStackSwift:
        containerName: 'name-of-techdocs-storage-bucket'
        credentials:
          username: ${OPENSTACK_SWIFT_STORAGE_USERNAME}
          password: ${OPENSTACK_SWIFT_STORAGE_PASSWORD}
        authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
        keystoneAuthVersion: ${OPENSTACK_SWIFT_STORAGE_AUTH_VERSION}
        domainId: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_ID}
        domainName: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_NAME}
        region: ${OPENSTACK_SWIFT_STORAGE_REGION}
  ```

  ##### Step 1: Change the credential keys

  Since the new SDK uses _Application Credentials_ to authenticate OpenStack, we
  need to change the keys `credentials.username` to `credentials.id`,
  `credentials.password` to `credentials.secret` and use Application Credential ID
  and secret here. For more detail about credentials look
  [here](https://docs.openstack.org/api-ref/identity/v3/?expanded=password-authentication-with-unscoped-authorization-detail,authenticating-with-an-application-credential-detail#authenticating-with-an-application-credential).

  ##### Step 2: Remove the unused keys

  Since the new SDK doesn't use the old way authentication, we don't need the keys
  `openStackSwift.keystoneAuthVersion`, `openStackSwift.domainId`,
  `openStackSwift.domainName` and `openStackSwift.region`. So you can remove them.

  ##### Step 3: Add Swift URL

  The new SDK needs the OpenStack Swift connection URL for connecting the Swift.
  So you need to add a new key called `openStackSwift.swiftUrl` and give the
  OpenStack Swift url here. Example url should look like that:
  `https://example.com:6780/swift/v1`

  ##### That's it!

  Your new configuration should look like that!

  ```yaml
  techdocs:
    publisher:
      type: 'openStackSwift'
      openStackSwift:
        containerName: 'name-of-techdocs-storage-bucket'
        credentials:
          id: ${OPENSTACK_SWIFT_STORAGE_APPLICATION_CREDENTIALS_ID}
          secret: ${OPENSTACK_SWIFT_STORAGE_APPLICATION_CREDENTIALS_SECRET}
        authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
        swiftUrl: ${OPENSTACK_SWIFT_STORAGE_SWIFT_URL}
  ```

- c772d9a84: TechDocs sites can now be accessed using paths containing entity triplets of
  any case (e.g. `/docs/namespace/KIND/name` or `/docs/namespace/kind/name`).

  If you do not use an external storage provider for serving TechDocs, this is a
  transparent change and no action is required from you.

  If you _do_ use an external storage provider for serving TechDocs (one of\* GCS,
  AWS S3, or Azure Blob Storage), you must run a migration command against your
  storage provider before updating.

  [A migration guide is available here](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-alpha-to-beta).

  - (\*) We're seeking help from the community to bring OpenStack Swift support
    [to feature parity](https://github.com/backstage/backstage/issues/6763) with the above.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8
  - @backstage/techdocs-common@0.9.0

## 0.9.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/backend-common@0.8.9
  - @backstage/techdocs-common@0.8.1

## 0.9.1

### Patch Changes

- 48ea3d25b: The recommended value for a `backstage.io/techdocs-ref` annotation is now
  `dir:.`, indicating "documentation source files are located in the same
  directory relative to the catalog entity." Note that `url:<location>` values
  are still supported.
- Updated dependencies
  - @backstage/backend-common@0.8.8
  - @backstage/config@0.1.6
  - @backstage/integration@0.5.9
  - @backstage/techdocs-common@0.8.0
  - @backstage/search-common@0.1.3

## 0.9.0

### Minor Changes

- d32d01e5b: Improve the annotation `backstage.io/techdocs-ref: dir:<relative-target>` that links to a path that is relative to the source of the annotated entity.
  This annotation works with the basic and the recommended flow, however, it will be most useful with the basic approach.

  This change remove the deprecation of the `dir` reference and provides first-class support for it.
  In addition, this change removes the support of the deprecated `github`, `gitlab`, and `azure/api` locations from the `dir` reference preparer.

  #### Example Usage

  The annotation is convenient if the documentation is stored in the same location, i.e. the same git repository, as the `catalog-info.yaml`.
  While it is still supported to add full URLs such as `backstage.io/techdocs-ref: url:https://...` for custom setups, documentation is mostly stored in the same repository as the entity definition.
  By automatically resolving the target relative to the registration location of the entity, the configuration overhead for this default setup is minimized.
  Since it leverages the `@backstage/integrations` package for the URL resolution, this is compatible with every supported source.

  Consider the following examples:

  1. "I have a repository with a single `catalog-info.yaml` and a TechDocs page in the root folder!"

  ```
  https://github.com/backstage/example/tree/main/
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Component
   |  > metadata:
   |  >   name: example
   |  >   annotations:
   |  >     backstage.io/techdocs-ref: dir:. # -> same folder
   |  > spec: {}
   |- docs/
   |- mkdocs.yml
  ```

  2. "I have a repository with a single `catalog-info.yaml` and my TechDocs page in located in a folder!"

  ```
  https://bitbucket.org/my-owner/my-project/src/master/
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Component
   |  > metadata:
   |  >   name: example
   |  >   annotations:
   |  >     backstage.io/techdocs-ref: dir:./some-folder # -> subfolder
   |  > spec: {}
   |- some-folder/
     |- docs/
     |- mkdocs.yml
  ```

  3. "I have a mono repository that hosts multiple components!"

  ```
  https://dev.azure.com/organization/project/_git/repository
   |- my-1st-module/
     |- catalog-info.yaml
     |  > apiVersion: backstage.io/v1alpha1
     |  > kind: Component
     |  > metadata:
     |  >   name: my-1st-module
     |  >   annotations:
     |  >     backstage.io/techdocs-ref: dir:. # -> same folder
     |  > spec: {}
     |- docs/
     |- mkdocs.yml
   |- my-2nd-module/
     |- catalog-info.yaml
     |  > apiVersion: backstage.io/v1alpha1
     |  > kind: Component
     |  > metadata:
     |  >   name: my-2nd-module
     |  >   annotations:
     |  >     backstage.io/techdocs-ref: dir:. # -> same folder
     |  > spec: {}
     |- docs/
     |- mkdocs.yml
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Location
   |  > metadata:
   |  >   name: example
   |  > spec:
   |  >   targets:
   |  >     - ./*/catalog-info.yaml
  ```

### Patch Changes

- 9266b80ab: Implements tech docs collator to retrieve and expose search indexes for entities that have tech docs configured
- Updated dependencies
  - @backstage/techdocs-common@0.7.0
  - @backstage/catalog-client@0.3.17
  - @backstage/backend-common@0.8.7

## 0.8.7

### Patch Changes

- f1200f44c: Rewrite the `/sync/:namespace/:kind/:name` endpoint to support an event-stream as response.
  This change allows the sync process to take longer than a normal HTTP timeout.
  The stream also emits log events, so the caller can follow the build process in the frontend.
- 35a67722b: It is no longer required to provide a generator and a preparer to the TechDocs
  router factory when running TechDocs in the "recommended" (e.g. externally
  prepared and generated docs) configuration.
- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6
  - @backstage/techdocs-common@0.6.8

## 0.8.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/techdocs-common@0.6.7
  - @backstage/backend-common@0.8.5

## 0.8.5

### Patch Changes

- b47fc34bc: Update "service catalog" references to "software catalog"
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/techdocs-common@0.6.6

## 0.8.4

### Patch Changes

- fea7fa0ba: Return a `304 Not Modified` from the `/sync/:namespace/:kind/:name` endpoint if nothing was built. This enables the caller to know whether a refresh of the docs page will return updated content (-> `201 Created`) or not (-> `304 Not Modified`).
- Updated dependencies
  - @backstage/techdocs-common@0.6.5
  - @backstage/catalog-model@0.8.4

## 0.8.3

### Patch Changes

- 6013a16dc: TechDocs: Support configurable working directory as temp dir
- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/catalog-model@0.8.3

## 0.8.2

### Patch Changes

- Updated dependencies [8cefadca0]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/techdocs-common@0.6.3
  - @backstage/catalog-model@0.8.0

## 0.8.1

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
- Updated dependencies [e04f1ccfb]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9
  - @backstage/techdocs-common@0.6.1

## 0.8.0

### Minor Changes

- e0bfd3d44: Migrate the plugin to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
  It also provides the `ContainerRunner` to the generators instead of to the `createRouter` function.

  To apply this change to an existing backend application, add the following to `src/plugins/techdocs.ts`:

  ```diff
  + import { DockerContainerRunner } from '@backstage/backend-common';

    // ...

    export default async function createPlugin({
      logger,
      config,
      discovery,
      reader,
    }: PluginEnvironment): Promise<Router> {
      // Preparers are responsible for fetching source files for documentation.
      const preparers = await Preparers.fromConfig(config, {
        logger,
        reader,
      });

  +   // Docker client (conditionally) used by the generators, based on techdocs.generators config.
  +   const dockerClient = new Docker();
  +   const containerRunner = new DockerContainerRunner({ dockerClient });

      // Generators are used for generating documentation sites.
      const generators = await Generators.fromConfig(config, {
        logger,
  +     containerRunner,
      });

      // Publisher is used for
      // 1. Publishing generated files to storage
      // 2. Fetching files from storage and passing them to TechDocs frontend.
      const publisher = await Publisher.fromConfig(config, {
        logger,
        discovery,
      });

      // checks if the publisher is working and logs the result
      await publisher.getReadiness();

  -   // Docker client (conditionally) used by the generators, based on techdocs.generators config.
  -   const dockerClient = new Docker();

      return await createRouter({
        preparers,
        generators,
        publisher,
  -     dockerClient,
        logger,
        config,
        discovery,
      });
    }
  ```

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [e0bfd3d44]
- Updated dependencies [d8b81fd28]
- Updated dependencies [e9e56b01a]
  - @backstage/backend-common@0.7.0
  - @backstage/techdocs-common@0.6.0
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.7.1

### Patch Changes

- cba5944fc: Change the response status of metadata endpoints in case a documentation is not
  available to `404 NOT FOUND`. This also introduces the JSON based error messages
  used by other backends.
- Updated dependencies [bc9d62f4f]
- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/techdocs-common@0.5.0
  - @backstage/catalog-model@0.7.7

## 0.7.0

### Minor Changes

- aaeb7ecf3: When newer documentation available but not built, show older documentation while async building newer
  TechDocs backend: /sync endpoint added to support above, returns immediate success if docs don't need a build, returns delayed success after build if needed
  TechDocs backend: /docs endpoint removed as frontend can directly request to techdocs.storageUrl or /static/docs

## 0.6.5

### Patch Changes

- e7baa0d2e: Separate techdocs-backend and frontend config schema declarations
- 8686eb38c: Use errors from `@backstage/errors`
- 424742dc1: Applies only if you use TechDocs local builder instead of building on CI/CD i.e. if `techdocs.builder` in your `app-config.yaml` is set to `'local'`

  Improvements

  1. Do not check for updates in the repository if a check has been made in the last 60 seconds. This is to prevent the annoying check for update on every page switch or load.
  2. No need to maintain an in-memory etag storage, and use the one stored in `techdocs_metadata.json` file alongside generated docs.

  New feature

  1. You can now use a mix of basic and recommended setup i.e. `techdocs.builder` is `'local'` but using an external cloud storage instead of local storage. Previously, in this setup, the docs would never get updated.

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
- Updated dependencies [424742dc1]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4
  - @backstage/techdocs-common@0.4.5

## 0.6.4

### Patch Changes

- aa095e469: OpenStack Swift publisher added for tech-docs.
- 761698831: Bump to the latest version of the Knex library.
- 02d78290a: Enhanced the example documented-component to better demonstrate TechDocs features
- a501128db: Refactor log messaging to improve clarity
- Updated dependencies [d7245b733]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [2ef5bc7ea]
- Updated dependencies [761698831]
- Updated dependencies [aa095e469]
- Updated dependencies [bc46435f5]
- Updated dependencies [a501128db]
- Updated dependencies [ca4a904f6]
  - @backstage/backend-common@0.5.6
  - @backstage/techdocs-common@0.4.4
  - @backstage/catalog-model@0.7.4

## 0.6.3

### Patch Changes

- 52b5bc3e2: Forward authorization header on backend request if present
- 15eee03bc: Use external url for static docs
- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [f43192207]
- Updated dependencies [8adb48df4]
- Updated dependencies [61299519f]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5
  - @backstage/techdocs-common@0.4.3

## 0.6.2

### Patch Changes

- f37992797: Got rid of some `attr` and cleaned up a bit in the TechDocs config schema.
- Updated dependencies [bad21a085]
- Updated dependencies [2499f6cde]
- Updated dependencies [a1f5e6545]
- Updated dependencies [1e4ddd71d]
  - @backstage/catalog-model@0.7.2
  - @backstage/techdocs-common@0.4.2
  - @backstage/config@0.1.3

## 0.6.1

### Patch Changes

- b0a41c707: Add etag of the prepared file tree to techdocs_metadata.json in the storage
- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
- Updated dependencies [26e143e60]
- Updated dependencies [c6655413d]
- Updated dependencies [44414239f]
- Updated dependencies [b0a41c707]
  - @backstage/backend-common@0.5.4
  - @backstage/techdocs-common@0.4.1

## 0.6.0

### Minor Changes

- 08142b256: URL Preparer will now use proper etag based caching introduced in https://github.com/backstage/backstage/pull/4120. Previously, builds used to be cached for 30 minutes.

### Patch Changes

- 08142b256: TechDocs will throw warning in backend logs when legacy git preparer or dir preparer is used to preparer docs. Migrate to URL Preparer by updating `backstage.io/techdocs-ref` annotation to be prefixed with `url:`.
  Detailed docs are here https://backstage.io/docs/features/techdocs/how-to-guides#how-to-use-url-reader-in-techdocs-prepare-step
  See benefits and reason for doing so https://github.com/backstage/backstage/issues/4409
- Updated dependencies [77ad0003a]
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [5a5163519]
- Updated dependencies [08142b256]
- Updated dependencies [08142b256]
  - @backstage/techdocs-common@0.4.0
  - @backstage/backend-common@0.5.3

## 0.5.5

### Patch Changes

- c777df180: 1. Added option to use Azure Blob Storage as a choice to store the static generated files for TechDocs.
- e44925723: `techdocs.requestUrl` and `techdocs.storageUrl` are now optional configs and the discovery API will be used to get the URL where techdocs plugin is hosted.
- Updated dependencies [c777df180]
- Updated dependencies [2430ee7c2]
- Updated dependencies [6e612ce25]
- Updated dependencies [e44925723]
- Updated dependencies [025e122c3]
- Updated dependencies [7881f2117]
- Updated dependencies [f0320190d]
- Updated dependencies [11cb5ef94]
  - @backstage/techdocs-common@0.3.7
  - @backstage/backend-common@0.5.2
  - @backstage/catalog-model@0.7.1

## 0.5.4

### Patch Changes

- a5e27d5c1: Create type for TechDocsMetadata (#3716)

  This change introduces a new type (TechDocsMetadata) in packages/techdocs-common. This type is then introduced in the endpoint response in techdocs-backend and in the api interface in techdocs (frontend).

- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [53c9c51f2]
- Updated dependencies [a5e27d5c1]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/techdocs-common@0.3.5

## 0.5.3

### Patch Changes

- 68ad5af51: Improve techdocs-common Generator API for it to be used by techdocs-cli. TechDocs generator.run function now takes
  an input AND an output directory. Most probably you use techdocs-common via plugin-techdocs-backend, and so there
  is no breaking change for you.
  But if you use techdocs-common separately, you need to create an output directory and pass into the generator.
- cb7af51e7: If using Url Reader, cache downloaded source files for 30 minutes.
- Updated dependencies [68ad5af51]
- Updated dependencies [f3b064e1c]
- Updated dependencies [371f67ecd]
- Updated dependencies [f1e74777a]
- Updated dependencies [dbe4450c3]
- Updated dependencies [5826d0973]
- Updated dependencies [b3b9445df]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/techdocs-common@0.3.3
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.5.2

### Patch Changes

- 7ec525481: 1. Added option to use AWS S3 as a choice to store the static generated files for TechDocs.
- Updated dependencies [7ec525481]
- Updated dependencies [5ecd50f8a]
- Updated dependencies [f8ba88ded]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/techdocs-common@0.3.2
  - @backstage/backend-common@0.4.2

## 0.5.1

### Patch Changes

- 8804e8981: Using @backstage/integration package for GitHub/GitLab/Azure tokens and request options.

  Most probably you do not have to make any changes in the app because of this change.
  However, if you are using the `DirectoryPreparer` or `CommonGitPreparer` exported by
  `@backstage/techdocs-common` package, you now need to add pass in a `config` (from `@backstage/config`)
  instance as argument.

  ```
  <!-- Before -->
      const directoryPreparer = new DirectoryPreparer(logger);
      const commonGitPreparer = new CommonGitPreparer(logger);
  <!-- Now -->
      const directoryPreparer = new DirectoryPreparer(config, logger);
      const commonGitPreparer = new CommonGitPreparer(config, logger);
  ```

- 359f9d2d8: Added configuration schema for the commonly used properties of techdocs and techdocs-backend plugins
- Updated dependencies [8804e8981]
  - @backstage/techdocs-common@0.3.1

## 0.5.0

### Minor Changes

- a8573e53b: techdocs-backend: Simplified file, removing individual preparers and generators.
  techdocs-backend: UrlReader is now available to use in preparers.

  In your Backstage app, `packages/backend/plugins/techdocs.ts` file has now been simplified,
  to remove registering individual preparers and generators.

  Please update the file when upgrading the version of `@backstage/plugin-techdocs-backend` package.

  ```typescript
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  const generators = await Generators.fromConfig(config, {
    logger,
  });

  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });
  ```

  You should be able to remove unnecessary imports, and just do

  ```typescript
  import {
    createRouter,
    Preparers,
    Generators,
    Publisher,
  } from '@backstage/plugin-techdocs-backend';
  ```

### Patch Changes

- Updated dependencies [a8573e53b]
  - @backstage/techdocs-common@0.3.0

## 0.4.0

### Minor Changes

- dae4f3983: _Breaking changes_

  1. Added option to use Google Cloud Storage as a choice to store the static generated files for TechDocs.
     It can be configured using `techdocs.publisher.type` option in `app-config.yaml`.
     Step-by-step guide to configure GCS is available here https://backstage.io/docs/features/techdocs/using-cloud-storage
     Set `techdocs.publisher.type` to `'local'` if you want to continue using local filesystem to store TechDocs files.

  2. `techdocs.builder` is now required and can be set to `'local'` or `'external'`. (Set it to `'local'` for now, since CI/CD build
     workflow for TechDocs will be available soon (in few weeks)).
     If builder is set to 'local' and you open a TechDocs page, `techdocs-backend` will try to generate the docs, publish to storage and
     show the generated docs afterwords.
     If builder is set to `'external'`, `techdocs-backend` will only fetch the docs and will NOT try to generate and publish. In this case of `'external'`,
     we assume that docs are being built in the CI/CD pipeline of the repository.
     TechDocs will not assume a default value for `techdocs.builder`. It is better to explicitly define it in the `app-config.yaml`.

  3. When configuring TechDocs in your backend, there is a difference in how a new publisher is created.

  ```
  ---  const publisher = new LocalPublish(logger, discovery);
  +++  const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  Based on the config `techdocs.publisher.type`, the publisher could be either Local publisher or Google Cloud Storage publisher.

  4. `techdocs.storageUrl` is now a required config. Should be `http://localhost:7000/api/techdocs/static/docs` in most setups.

  5. Parts of `@backstage/plugin-techdocs-backend` have been moved to a new package `@backstage/techdocs-common` to generate docs. Also to publish docs
     to-and-fro between TechDocs and a storage (either local or external). However, a Backstage app does NOT need to import the `techdocs-common` package -
     app should only import `@backstage/plugin-techdocs` and `@backstage/plugin-techdocs-backend`.

  _Patch changes_

  1. See all of TechDocs config options and its documentation https://backstage.io/docs/features/techdocs/configuration

  2. Logic about serving static files and metadata retrieval have been abstracted away from the router in `techdocs-backend` to the instance of publisher.

  3. Removed Material UI Spinner from TechDocs header. Spinners cause unnecessary UX distraction.
     Case 1 (when docs are built and are to be served): Spinners appear for a split second before the name of site shows up. This unnecessarily distracts eyes because spinners increase the size of the Header. A dot (.) would do fine. Definitely more can be done.
     Case 2 (when docs are being generated): There is already a linear progress bar (which is recommended in Storybook).

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [dae4f3983]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/techdocs-common@0.2.0
  - @backstage/backend-common@0.4.1

## 0.3.2

### Patch Changes

- 1e22f8e0b: Unify `dockerode` library and type dependency versions
- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.1

### Patch Changes

- ae95c7ff3: Update URL auth format for GitLab clone
- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.3.0

### Minor Changes

- 4b53294a6: - Use techdocs annotation to add repo_url if missing in mkdocs.yml. Having repo_url creates a Edit button on techdocs pages.
  - techdocs-backend: API endpoint `/metadata/mkdocs/*` renamed to `/metadata/techdocs/*`

### Patch Changes

- Updated dependencies [3aa7efb3f]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2
  - @backstage/catalog-model@0.3.1

## 0.2.2

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.2.1

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- 6d29605db: Change the default backend plugin mount point to /api
- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 5a920c6e4: Updated naming of environment variables. New pattern [NAME]\_TOKEN for GitHub, GitLab, Azure & GitHub Enterprise access tokens.

  ### Detail:

  - Previously we have to export same token for both, catalog & scaffolder

  ```bash
  export GITHUB_ACCESS_TOKEN=foo
  export GITHUB_PRIVATE_TOKEN=foo
  ```

  with latest changes, only single export is sufficient.

  ```bash
  export GITHUB_TOKEN=foo
  export GITLAB_TOKEN=foo
  export GHE_TOKEN=foo
  export AZURE_TOKEN=foo
  ```

  ### list:

  <table>
    <tr>
      <th>Old name</th>
      <th>New name</th>
    </tr>
    <tr>
      <td>GITHUB_ACCESS_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITHUB_PRIVATE_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_ACCESS_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_PRIVATE_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>AZURE_PRIVATE_TOKEN</td>
      <td>AZURE_TOKEN</td>
    </tr>
    <tr>
      <td>GHE_PRIVATE_TOKEN</td>
      <td>GHE_TOKEN</td>
    </tr>
  </table>

### Patch Changes

- 22ff8fba5: Replacing the hard coded `baseApiUrl` by reading the value from configuration to enable private GitHub setup for TechDocs.
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
