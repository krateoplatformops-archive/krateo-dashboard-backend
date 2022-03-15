# @backstage/plugin-apache-airflow

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.1

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.1-next.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.0
  - @backstage/core-plugin-api@0.8.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/core-plugin-api@0.7.0

## 0.1.7

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0

## 0.1.3

### Patch Changes

- 5333451def: Cleaned up API exports
- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0

## 0.1.2

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/core-components@0.8.3

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/core-components@0.8.2

## 0.1.0

### Minor Changes

- 9aea335911: Introduces a new plugin for the Apache Airflow workflow management platform.
  This implementation has been tested with the Apache Airflow v2 API,
  authenticating with basic authentication through the Backstage proxy plugin.

  Supported functionality includes:

  - Information card of version information of the Airflow instance
  - Information card of instance health for the meta-database and scheduler
  - Table of DAGs with meta information and status, along with a link to view
    details in the Airflow UI

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1
