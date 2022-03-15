/*
 * Copyright 2020 The Backstage Authors
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

import { NotFoundError, NotModifiedError } from '@backstage/errors';
import fetch, { Response } from 'node-fetch';
import {
  ReaderFactory,
  ReadTreeResponse,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchResponse,
  UrlReader,
} from './types';
import path from 'path';

/**
 * A {@link UrlReader} that does a plain fetch of the URL.
 *
 * @public
 */
export class FetchUrlReader implements UrlReader {
  /**
   * The factory creates a single reader that will be used for reading any URL that's listed
   * in configuration at `backend.reading.allow`. The allow list contains a list of objects describing
   * targets to allow, containing the following fields:
   *
   * `host`:
   *   Either full hostnames to match, or subdomain wildcard matchers with a leading `*`.
   *   For example `example.com` and `*.example.com` are valid values, `prod.*.example.com` is not.
   *
   * `paths`:
   *   An optional list of paths which are allowed. If the list is omitted all paths are allowed.
   */
  static factory: ReaderFactory = ({ config }) => {
    const predicates =
      config
        .getOptionalConfigArray('backend.reading.allow')
        ?.map(allowConfig => {
          const paths = allowConfig.getOptionalStringArray('paths');
          const checkPath = paths
            ? (url: URL) => {
                const targetPath = path.posix.normalize(url.pathname);
                return paths.some(allowedPath =>
                  targetPath.startsWith(allowedPath),
                );
              }
            : (_url: URL) => true;
          const host = allowConfig.getString('host');
          if (host.startsWith('*.')) {
            const suffix = host.slice(1);
            return (url: URL) => url.host.endsWith(suffix) && checkPath(url);
          }
          return (url: URL) => url.host === host && checkPath(url);
        }) ?? [];

    const reader = new FetchUrlReader();
    const predicate = (url: URL) => predicates.some(p => p(url));
    return [{ reader, predicate }];
  };

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          ...(options?.etag && { 'If-None-Match': options.etag }),
        },
        // TODO(freben): The signal cast is there because pre-3.x versions of
        // node-fetch have a very slightly deviating AbortSignal type signature.
        // The difference does not affect us in practice however. The cast can
        // be removed after we support ESM for CLI dependencies and migrate to
        // version 3 of node-fetch.
        // https://github.com/backstage/backstage/issues/8242
        signal: options?.signal as any,
      });
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.status === 304) {
      throw new NotModifiedError();
    }

    if (response.ok) {
      return {
        buffer: async () => Buffer.from(await response.arrayBuffer()),
        etag: response.headers.get('ETag') ?? undefined,
      };
    }

    const message = `could not read ${url}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(): Promise<ReadTreeResponse> {
    throw new Error('FetchUrlReader does not implement readTree');
  }

  async search(): Promise<SearchResponse> {
    throw new Error('FetchUrlReader does not implement search');
  }

  toString() {
    return 'fetch{}';
  }
}
