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

import {
  PermissionCondition,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import { createConditionTransformer } from './createConditionTransformer';

const transformConditions = createConditionTransformer([
  {
    name: 'test-rule-1',
    description: 'Test rule 1',
    apply: jest.fn(),
    toQuery: jest.fn(
      (firstParam: string, secondParam: number) =>
        `test-rule-1:${firstParam}/${secondParam}`,
    ),
  },
  {
    name: 'test-rule-2',
    description: 'Test rule 2',
    apply: jest.fn(),
    toQuery: jest.fn(
      (firstParam: object) => `test-rule-2:${JSON.stringify(firstParam)}`,
    ),
  },
]);

describe('createConditionTransformer', () => {
  const testCases: {
    conditions: PermissionCriteria<PermissionCondition>;
    expectedResult: PermissionCriteria<string>;
  }[] = [
    {
      conditions: { rule: 'test-rule-1', params: ['abc', 123] },
      expectedResult: 'test-rule-1:abc/123',
    },
    {
      conditions: { rule: 'test-rule-2', params: [{ foo: 0 }] },
      expectedResult: 'test-rule-2:{"foo":0}',
    },
    {
      conditions: {
        anyOf: [
          { rule: 'test-rule-1', params: ['a', 1] },
          { rule: 'test-rule-2', params: [{}] },
        ],
      },
      expectedResult: {
        anyOf: ['test-rule-1:a/1', 'test-rule-2:{}'],
      },
    },
    {
      conditions: {
        allOf: [
          { rule: 'test-rule-1', params: ['a', 1] },
          { rule: 'test-rule-2', params: [{}] },
        ],
      },
      expectedResult: {
        allOf: ['test-rule-1:a/1', 'test-rule-2:{}'],
      },
    },
    {
      conditions: {
        not: { rule: 'test-rule-2', params: [{}] },
      },
      expectedResult: {
        not: 'test-rule-2:{}',
      },
    },
    {
      conditions: {
        allOf: [
          {
            anyOf: [
              { rule: 'test-rule-1', params: ['a', 1] },
              { rule: 'test-rule-2', params: [{}] },
            ],
          },
          {
            not: {
              allOf: [
                { rule: 'test-rule-1', params: ['b', 2] },
                { rule: 'test-rule-2', params: [{ c: 3 }] },
              ],
            },
          },
        ],
      },
      expectedResult: {
        allOf: [
          {
            anyOf: ['test-rule-1:a/1', 'test-rule-2:{}'],
          },
          {
            not: {
              allOf: ['test-rule-1:b/2', 'test-rule-2:{"c":3}'],
            },
          },
        ],
      },
    },
    {
      conditions: {
        allOf: [
          {
            anyOf: [
              { rule: 'test-rule-1', params: ['a', 1] },
              { rule: 'test-rule-2', params: [{ b: 2 }] },
            ],
          },
          {
            not: {
              allOf: [
                { rule: 'test-rule-1', params: ['c', 3] },
                { not: { rule: 'test-rule-2', params: [{ d: 4 }] } },
              ],
            },
          },
        ],
      },
      expectedResult: {
        allOf: [
          {
            anyOf: ['test-rule-1:a/1', 'test-rule-2:{"b":2}'],
          },
          {
            not: {
              allOf: ['test-rule-1:c/3', { not: 'test-rule-2:{"d":4}' }],
            },
          },
        ],
      },
    },
  ];

  it.each(testCases)(
    'works with criteria %#',
    ({ conditions, expectedResult }) => {
      expect(transformConditions(conditions)).toEqual(expectedResult);
    },
  );
});
