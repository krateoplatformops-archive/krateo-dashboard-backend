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

import { Config } from '@backstage/config';
import { ResponseError } from '@backstage/errors';
import fetch from 'cross-fetch';
import * as uuid from 'uuid';
import { z } from 'zod';
import {
  AuthorizeResult,
  AuthorizeQuery,
  AuthorizeDecision,
  Identified,
  PermissionCriteria,
  PermissionCondition,
  AuthorizeResponse,
  AuthorizeRequest,
} from './types/api';
import { DiscoveryApi } from './types/discovery';
import {
  PermissionAuthorizer,
  AuthorizeRequestOptions,
} from './types/permission';

const permissionCriteriaSchema: z.ZodSchema<
  PermissionCriteria<PermissionCondition>
> = z.lazy(() =>
  z
    .object({
      rule: z.string(),
      params: z.array(z.unknown()),
    })
    .strict()
    .or(
      z
        .object({ anyOf: z.array(permissionCriteriaSchema).nonempty() })
        .strict(),
    )
    .or(
      z
        .object({ allOf: z.array(permissionCriteriaSchema).nonempty() })
        .strict(),
    )
    .or(z.object({ not: permissionCriteriaSchema }).strict()),
);

const responseSchema = z.object({
  items: z.array(
    z
      .object({
        id: z.string(),
        result: z
          .literal(AuthorizeResult.ALLOW)
          .or(z.literal(AuthorizeResult.DENY)),
      })
      .or(
        z.object({
          id: z.string(),
          result: z.literal(AuthorizeResult.CONDITIONAL),
          conditions: permissionCriteriaSchema,
        }),
      ),
  ),
});

/**
 * An isomorphic client for requesting authorization for Backstage permissions.
 * @public
 */
export class PermissionClient implements PermissionAuthorizer {
  private readonly enabled: boolean;
  private readonly discovery: DiscoveryApi;

  constructor(options: { discovery: DiscoveryApi; config: Config }) {
    this.discovery = options.discovery;
    this.enabled =
      options.config.getOptionalBoolean('permission.enabled') ?? false;
  }

  /**
   * Request authorization from the permission-backend for the given set of permissions.
   *
   * Authorization requests check that a given Backstage user can perform a protected operation,
   * potentially for a specific resource (such as a catalog entity). The Backstage identity token
   * should be included in the `options` if available.
   *
   * Permissions can be imported from plugins exposing them, such as `catalogEntityReadPermission`.
   *
   * The response will be either ALLOW or DENY when either the permission has no resourceType, or a
   * resourceRef is provided in the request. For permissions with a resourceType, CONDITIONAL may be
   * returned if no resourceRef is provided in the request. Conditional responses are intended only
   * for backends which have access to the data source for permissioned resources, so that filters
   * can be applied when loading collections of resources.
   * @public
   */
  async authorize(
    queries: AuthorizeQuery[],
    options?: AuthorizeRequestOptions,
  ): Promise<AuthorizeDecision[]> {
    // TODO(permissions): it would be great to provide some kind of typing guarantee that
    // conditional responses will only ever be returned for requests containing a resourceType
    // but no resourceRef. That way clients who aren't prepared to handle filtering according
    // to conditions can be guaranteed that they won't unexpectedly get a CONDITIONAL response.

    if (!this.enabled) {
      return queries.map(_ => ({ result: AuthorizeResult.ALLOW }));
    }

    const request: AuthorizeRequest = {
      items: queries.map(query => ({
        id: uuid.v4(),
        ...query,
      })),
    };

    const permissionApi = await this.discovery.getBaseUrl('permission');
    const response = await fetch(`${permissionApi}/authorize`, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        ...this.getAuthorizationHeader(options?.token),
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const responseBody = await response.json();
    this.assertValidResponse(request, responseBody);

    const responsesById = responseBody.items.reduce((acc, r) => {
      acc[r.id] = r;
      return acc;
    }, {} as Record<string, Identified<AuthorizeDecision>>);

    return request.items.map(query => responsesById[query.id]);
  }

  private getAuthorizationHeader(token?: string): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private assertValidResponse(
    request: AuthorizeRequest,
    json: any,
  ): asserts json is AuthorizeResponse {
    const authorizedResponses = responseSchema.parse(json);
    const responseIds = authorizedResponses.items.map(r => r.id);
    const hasAllRequestIds = request.items.every(r =>
      responseIds.includes(r.id),
    );
    if (!hasAllRequestIds) {
      throw new Error(
        'Unexpected authorization response from permission-backend',
      );
    }
  }
}
