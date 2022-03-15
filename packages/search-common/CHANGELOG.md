# @backstage/search-common

## 0.3.1

### Patch Changes

- d52155466a: **DEPRECATION**

  The `@backstage/search-common` package is being renamed `@backstage/plugin-search-common`. We may continue to publish changes to `@backstage/search-common` for a time, but will stop doing so in the near future. If you depend on this package, you should update your dependencies to point at the renamed package.

- Updated dependencies
  - @backstage/plugin-search-common@0.3.1

## 0.3.1-next.0

### Patch Changes

- d52155466a: **DEPRECATION**

  The `@backstage/search-common` package is being renamed `@backstage/plugin-search-common`. We may continue to publish changes to `@backstage/search-common` for a time, but will stop doing so in the near future. If you depend on this package, you should update your dependencies to point at the renamed package.

- Updated dependencies
  - @backstage/plugin-search-common@0.3.1-next.0

## 0.3.0

### Minor Changes

- 022507c860: **BREAKING**

  The Backstage Search Platform's indexing process has been rewritten as a stream
  pipeline in order to improve efficiency and performance on large document sets.

  The concepts of `Collator` and `Decorator` have been replaced with readable and
  transform object streams (respectively), as well as factory classes to
  instantiate them. Accordingly, the `SearchEngine.index()` method has also been
  replaced with a `getIndexer()` factory method that resolves to a writable
  object stream.

  Check [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
  for further details.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.5.2

## 0.2.4

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/types@0.1.3
  - @backstage/plugin-permission-common@0.5.1

## 0.2.3

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/types@0.1.2

## 0.2.2

### Patch Changes

- 9a511968b1: - Add optional visibilityPermission property to DocumentCollator type
  - Add new DocumentTypeInfo type for housing information about the document types stored in a search engine.
- b2e918fa0b: Add optional resourceRef field to the IndexableDocument type for use when authorizing access to documents.
- 96cbebc629: Add optional query request options containing authorization token to SearchEngine#query.

## 0.2.1

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`

## 0.2.0

### Minor Changes

- a13f21cdc: Implement optional `pageCursor` based paging in search.

  To use paging in your app, add a `<SearchResultPager />` to your
  `SearchPage.tsx`.

## 0.1.3

### Patch Changes

- d9c13d535: Implements configuration and indexing functionality for ElasticSearch search engine. Adds indexing, searching and default translator for ElasticSearch and modifies default backend example-app to use ES if it is configured.

  ## Example configurations:

  ### AWS

  Using AWS hosted ElasticSearch the only configuration options needed is the URL to the ElasticSearch service. The implementation assumes
  that environment variables for AWS access key id and secret access key are defined in accordance to the [default AWS credential chain.](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

  ```yaml
  search:
    elasticsearch:
      provider: aws
      node: https://my-backstage-search-asdfqwerty.eu-west-1.es.amazonaws.com
  ```

  ### Elastic.co

  Elastic Cloud hosted ElasticSearch uses a Cloud ID to determine the instance of hosted ElasticSearch to connect to. Additionally, username and password needs to be provided either directly or using environment variables like defined in [Backstage documentation.](https://backstage.io/docs/conf/writing#includes-and-dynamic-data)

  ```yaml
  search:
    elasticsearch:
      provider: elastic
      cloudId: backstage-elastic:asdfqwertyasdfqwertyasdfqwertyasdfqwerty==
      auth:
        username: elastic
        password: changeme
  ```

  ### Others

  Other ElasticSearch instances can be connected to by using standard ElasticSearch authentication methods and exposed URL, provided that the cluster supports that. The configuration options needed are the URL to the node and authentication information. Authentication can be handled by either providing username/password or and API key or a bearer token. In case both username/password combination and one of the tokens are provided, token takes precedence. For more information how to create an API key, see [Elastic documentation on API keys](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html) and how to create a bearer token, see [Elastic documentation on tokens.](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-service-token.html)

  #### Configuration examples

  ##### With username and password

  ```yaml
  search:
    elasticsearch:
      node: http://localhost:9200
      auth:
        username: elastic
        password: changeme
  ```

  ##### With bearer token

  ```yaml
  search:
    elasticsearch:
      node: http://localhost:9200
      auth:
        bearer: token
  ```

  ##### With API key

  ```yaml
  search:
    elasticsearch:
      node: http://localhost:9200
      auth:
        apiKey: base64EncodedKey
  ```

- Updated dependencies
  - @backstage/config@0.1.6

## 0.1.2

### Patch Changes

- db1c8f93b: The `<Search...Next /> set of components exported by the Search Plugin are now updated to use the Search Backend API. These will be made available as the default non-"next" versions in a follow-up release.

  The interfaces for decorators and collators in the Search Backend have also seen minor, breaking revisions ahead of a general release. If you happen to be building on top of these interfaces, check and update your implementations accordingly. The APIs will be considered more stable in a follow-up release.
