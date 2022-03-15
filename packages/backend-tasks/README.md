# @backstage/backend-tasks

Common distributed task management for Backstage backends.

## Usage

Add the library to your backend package:

```sh
# From your Backstage root directory
cd packages/backend
yarn add @backstage/backend-tasks
```

then make use of its facilities as necessary:

```typescript
import { TaskScheduler } from '@backstage/backend-tasks';
import { Duration } from 'luxon';

const scheduler = TaskScheduler.fromConfig(rootConfig).forPlugin('my-plugin');

await scheduler.scheduleTask({
  id: 'refresh_things',
  frequency: { cron: '*/5 * * * *' }, // every 5 minutes, also supports Duration
  timeout: Duration.fromObject({ minutes: 15 }),
  fn: async () => {
    await entityProvider.run();
  },
});
```

## Local Development

When working with the `@backstage/backend-tasks` library you may run into your task not running immediately at startup as expected if you are using a persistent database. This is by design - the library respects the previous state and does not run the task sooner than the specified frequency. If you want to get around this, there is a table called `backstage_backend_tasks__tasks` in the applicable plugin's database which will contain a record with the next run date and time. You can delete this record to get things back to what you expect.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
