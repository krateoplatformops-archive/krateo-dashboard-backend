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

type BitbucketRepositoryBase = {
  project: {
    key: string;
  };
  slug: string;
};

export type BitbucketRepository = BitbucketRepositoryBase & {
  links: Record<
    string,
    {
      href: string;
    }[]
  >;
};

export type BitbucketRepository20 = BitbucketRepositoryBase & {
  links: Record<
    | 'self'
    | 'source'
    | 'html'
    | 'avatar'
    | 'pullrequests'
    | 'commits'
    | 'forks'
    | 'watchers'
    | 'downloads'
    | 'hooks',
    {
      href: string;
      name?: string;
    }
  > &
    Record<
      'clone',
      {
        href: string;
        name?: string;
      }[]
    >;
  mainbranch?: {
    type: string;
    name: string;
  };
};
