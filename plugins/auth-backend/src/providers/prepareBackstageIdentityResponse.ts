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

import { BackstageIdentityResponse, BackstageSignInResult } from './types';

function parseJwtPayload(token: string) {
  const [_header, payload, _signature] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64').toString());
}

/**
 * Parses token and decorates the BackstageIdentityResponse with identity information sourced from the token
 *
 * @public
 */
export function prepareBackstageIdentityResponse(
  result: BackstageSignInResult,
): BackstageIdentityResponse {
  const { sub, ent } = parseJwtPayload(result.token);
  return {
    ...{
      // TODO: idToken is for backwards compatibility and can be removed in the future
      idToken: result.token,
      ...result,
    },
    identity: {
      type: 'user',
      userEntityRef: sub,
      ownershipEntityRefs: ent ?? [],
    },
  };
}
