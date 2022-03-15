/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Duration } from 'luxon';
import { AbortSignal } from 'node-abort-controller';
import { z } from 'zod';
import { CronTime } from 'cron';

/**
 * A function that can be called as a scheduled task.
 *
 * It may optionally accept an abort signal argument. When the signal triggers,
 * processing should abort and return as quickly as possible.
 *
 * @public
 */
export type TaskFunction =
  | ((abortSignal: AbortSignal) => void | Promise<void>)
  | (() => void | Promise<void>);

/**
 * Options that control the scheduling of a task.
 *
 * @public
 */
export interface TaskScheduleDefinition {
  /**
   * How often you want the task to run. The system does its best to avoid
   * overlapping invocations.
   *
   * This is a best effort value; under some circumstances there can be
   * deviations. For example, if the task runtime is longer than the frequency
   * and the timeout has not been given or not been exceeded yet, the next
   * invocation of this task will be delayed until after the previous one
   * finishes.
   *
   * This is a required field.
   */
  frequency:
    | {
        /**
         * A crontab style string.
         *
         * Overview:
         *
         * ```
         *   ┌────────────── second (optional)
         *   │ ┌──────────── minute
         *   │ │ ┌────────── hour
         *   │ │ │ ┌──────── day of month
         *   │ │ │ │ ┌────── month
         *   │ │ │ │ │ ┌──── day of week
         *   │ │ │ │ │ │
         *   │ │ │ │ │ │
         *   * * * * * *
         * ```
         */
        cron: string;
      }
    | Duration;

  /**
   * The maximum amount of time that a single task invocation can take, before
   * it's considered timed out and gets "released" such that a new invocation
   * is permitted to take place (possibly, then, on a different worker).
   */
  timeout: Duration;

  /**
   * The amount of time that should pass before the first invocation happens.
   *
   * This can be useful in cold start scenarios to stagger or delay some heavy
   * compute jobs.
   *
   * If no value is given for this field then the first invocation will happen
   * as soon as possible according to the cadence.
   */
  initialDelay?: Duration;
}

/**
 * Options that apply to the invocation of a given task.
 *
 * @public
 */
export interface TaskInvocationDefinition {
  /**
   * A unique ID (within the scope of the plugin) for the task.
   */
  id: string;

  /**
   * The actual task function to be invoked regularly.
   */
  fn: TaskFunction;

  /**
   * An abort signal that, when triggered, will stop the recurring execution of
   * the task.
   */
  signal?: AbortSignal;
}

/**
 * A previously prepared task schedule, ready to be invoked.
 *
 * @public
 */
export interface TaskRunner {
  /**
   * Takes the schedule and executes an actual task using it.
   *
   * @param task - The actual runtime properties of the task
   */
  run(task: TaskInvocationDefinition): Promise<void>;
}

/**
 * Deals with the scheduling of distributed tasks, for a given plugin.
 *
 * @public
 */
export interface PluginTaskScheduler {
  /**
   * Schedules a task function for coordinated exclusive invocation across
   * workers. This convenience method performs both the scheduling and
   * invocation in one go.
   *
   * @remarks
   *
   * If the task was already scheduled since before by us or by another party,
   * its options are just overwritten with the given options, and things
   * continue from there.
   *
   * @param task - The task definition
   */
  scheduleTask(
    task: TaskScheduleDefinition & TaskInvocationDefinition,
  ): Promise<void>;

  /**
   * Creates a scheduled but dormant recurring task, ready to be launched at a
   * later time.
   *
   * @remarks
   *
   * This method is useful for pre-creating a schedule in outer code to be
   * passed into an inner implementation, such that the outer code controls
   * scheduling while inner code controls implementation.
   *
   * @param schedule - The task schedule
   */
  createScheduledTaskRunner(schedule: TaskScheduleDefinition): TaskRunner;
}

function isValidOptionalDurationString(d: string | undefined): boolean {
  try {
    return !d || Duration.fromISO(d).isValid;
  } catch {
    return false;
  }
}

function isValidCronFormat(c: string | undefined): boolean {
  try {
    if (!c) {
      return false;
    }
    // parse cron format to ensure it's a valid format.
    // eslint-disable-next-line no-new
    new CronTime(c);
    return true;
  } catch {
    return false;
  }
}

export const taskSettingsV1Schema = z.object({
  version: z.literal(1),
  initialDelayDuration: z
    .string()
    .optional()
    .refine(isValidOptionalDurationString, {
      message: 'Invalid duration, expecting ISO Period',
    }),
  recurringAtMostEveryDuration: z
    .string()
    .refine(isValidOptionalDurationString, {
      message: 'Invalid duration, expecting ISO Period',
    }),
  timeoutAfterDuration: z.string().refine(isValidOptionalDurationString, {
    message: 'Invalid duration, expecting ISO Period',
  }),
});

/**
 * The properties that control a scheduled task (version 1).
 */
export type TaskSettingsV1 = z.infer<typeof taskSettingsV1Schema>;

export const taskSettingsV2Schema = z.object({
  version: z.literal(2),
  cadence: z
    .string()
    .refine(isValidCronFormat, { message: 'Invalid cron' })
    .or(
      z.string().refine(isValidOptionalDurationString, {
        message: 'Invalid duration, expecting ISO Period',
      }),
    ),
  timeoutAfterDuration: z.string().refine(isValidOptionalDurationString, {
    message: 'Invalid duration, expecting ISO Period',
  }),
  initialDelayDuration: z
    .string()
    .optional()
    .refine(isValidOptionalDurationString, {
      message: 'Invalid duration, expecting ISO Period',
    }),
});

/**
 * The properties that control a scheduled task (version 2).
 */
export type TaskSettingsV2 = z.infer<typeof taskSettingsV2Schema>;
