# @backstage/backend-tasks

## 0.2.0

### Minor Changes

- 9461f73643: **BREAKING**: The `TaskDefinition` type has been removed, and replaced by the equal pair `TaskScheduleDefinition` and `TaskInvocationDefinition`. The interface for `PluginTaskScheduler.scheduleTask` stays effectively unchanged, so this only affects you if you use the actual types directly.

  Added the method `PluginTaskScheduler.createTaskSchedule`, which returns a `TaskSchedule` wrapper that is convenient to pass down into classes that want to control their task invocations while the caller wants to retain control of the actual schedule chosen.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 7290dda9d4: Relaxed the task ID requirement to now support any non-empty string
- ae2ed04076: Add support for cron syntax to configure task frequency - `TaskScheduleDefinition.frequency` can now be both a `Duration` and an object on the form `{ cron: string }`, where the latter is expected to be on standard crontab format (e.g. `'0 */2 * * *'`).
- Updated dependencies
  - @backstage/backend-common@0.13.0

## 0.2.0-next.0

### Minor Changes

- 9461f73643: **BREAKING**: The `TaskDefinition` type has been removed, and replaced by the equal pair `TaskScheduleDefinition` and `TaskInvocationDefinition`. The interface for `PluginTaskScheduler.scheduleTask` stays effectively unchanged, so this only affects you if you use the actual types directly.

  Added the method `PluginTaskScheduler.createTaskSchedule`, which returns a `TaskSchedule` wrapper that is convenient to pass down into classes that want to control their task invocations while the caller wants to retain control of the actual schedule chosen.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 7290dda9d4: Relaxed the task ID requirement to now support any non-empty string
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0

## 0.1.9

### Patch Changes

- dc97845422: Only output janitor logs when actually timing out tasks
- Updated dependencies
  - @backstage/backend-common@0.11.0

## 0.1.8

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/types@0.1.3

## 0.1.7

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.1.6

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.1.6-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/errors@0.2.0

## 0.1.2

### Patch Changes

- e188b37024: Updated README to clarify the following:

  - Dashes cannot be used in the `id`, changed to an underscore in the example
  - The `timeout` is required, this was also added to the example
  - Added a note about tasks not running as expected for local development using persistent database

- Updated dependencies
  - @backstage/backend-common@0.10.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
