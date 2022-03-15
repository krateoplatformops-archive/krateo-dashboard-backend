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

import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { GcpIapProvider } from './provider';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GcpIapProvider', () => {
  const authHandler = jest.fn();
  const signInResolver = jest.fn();
  const tokenValidator = jest.fn();
  const logger = getVoidLogger();

  it('runs the happy path', async () => {
    const provider = new GcpIapProvider({
      authHandler,
      signInResolver,
      tokenValidator,
      tokenIssuer: {} as any,
      catalogIdentityClient: {} as any,
      logger,
    });

    // { "sub": "user:default/me", "ent": ["group:default/home"] }
    const backstageToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvbWUiLCJlbnQiOlsiZ3JvdXA6ZGVmYXVsdC9ob21lIl19.CbmAKzFErGmtsnpRxyPc7dHv7WEjb5lY6206YCzR_Rc';
    const iapToken = { sub: 's', email: 'e@mail.com' };

    authHandler.mockResolvedValueOnce({ email: 'e@mail.com' });
    signInResolver.mockResolvedValueOnce({ id: 'i', token: backstageToken });
    tokenValidator.mockResolvedValueOnce(iapToken);

    const app = express();
    app.use('/refresh', provider.refresh.bind(provider));

    const response = await request(app)
      .get('/refresh')
      .set('x-goog-iap-jwt-assertion', 'token');

    expect(response.status).toBe(200);
    expect(response.get('content-type')).toBe(
      'application/json; charset=utf-8',
    );
    expect(response.body).toEqual({
      backstageIdentity: {
        id: 'i',
        idToken: backstageToken,
        token: backstageToken,
        identity: {
          type: 'user',
          userEntityRef: 'user:default/me',
          ownershipEntityRefs: ['group:default/home'],
        },
      },
      providerInfo: { iapToken },
    });
  });
});
