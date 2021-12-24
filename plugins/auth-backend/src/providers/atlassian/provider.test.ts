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

import { AtlassianAuthProvider } from './provider';
import * as helpers from '../../lib/passport/PassportStrategyHelper';
import { getVoidLogger } from '@backstage/backend-common';
import { TokenIssuer } from '../../identity';
import { CatalogIdentityClient } from '../../lib/catalog';
import { OAuthResult } from '../../lib/oauth';
import { PassportProfile } from '../../lib/passport/types';

const mockFrameHandler = jest.spyOn(
  helpers,
  'executeFrameHandlerStrategy',
) as unknown as jest.MockedFunction<() => Promise<{ result: OAuthResult }>>;

describe('createAtlassianProvider', () => {
  const tokenIssuer = {
    issueToken: jest.fn(),
    listPublicKeys: jest.fn(),
  };
  const catalogIdentityClient = {
    findUser: jest.fn(),
  };

  const provider = new AtlassianAuthProvider({
    logger: getVoidLogger(),
    catalogIdentityClient:
      catalogIdentityClient as unknown as CatalogIdentityClient,
    tokenIssuer: tokenIssuer as unknown as TokenIssuer,
    authHandler: async ({ fullProfile }) => ({
      profile: {
        email: fullProfile.emails![0]!.value,
        displayName: fullProfile.displayName,
        picture: 'http://google.com/lols',
      },
    }),
    clientId: 'mock',
    clientSecret: 'mock',
    callbackUrl: 'mock',
    scopes: 'scope',
  });

  it('should auth', async () => {
    mockFrameHandler.mockResolvedValueOnce({
      result: {
        fullProfile: {
          photos: [
            {
              value:
                'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
            },
          ],
          emails: [{ value: 'conrad@example.com' }],
          displayName: 'Conrad',
          id: 'conrad',
          provider: 'google',
        },
        params: {
          id_token: 'idToken',
          scope: 'scope',
          expires_in: 123,
        },
        accessToken: 'accessToken',
        refreshToken: 'wacka',
      },
    });
    const { response } = await provider.handler({} as any);
    expect(response).toEqual({
      providerInfo: {
        accessToken: 'accessToken',
        expiresInSeconds: 123,
        idToken: 'idToken',
        scope: 'scope',
        refreshToken: 'wacka',
      },
      profile: {
        email: 'conrad@example.com',
        displayName: 'Conrad',
        picture: 'http://google.com/lols',
      },
    });
  });

  it('should forward a new refresh token on refresh', async () => {
    const mockRefreshToken = jest.spyOn(
      helpers,
      'executeRefreshTokenStrategy',
    ) as unknown as jest.MockedFunction<() => Promise<{}>>;

    mockRefreshToken.mockResolvedValueOnce({
      accessToken: 'a.b.c',
      refreshToken: 'dont-forget-to-send-refresh',
      params: {
        id_token: 'my-id',
        scope: 'read_user',
      },
    });

    const mockUserProfile = jest.spyOn(
      helpers,
      'executeFetchUserProfileStrategy',
    ) as unknown as jest.MockedFunction<() => Promise<PassportProfile>>;

    mockUserProfile.mockResolvedValueOnce({
      id: 'uid-my-id',
      username: 'mockuser',
      provider: 'atlassian',
      displayName: 'Mocked User',
      emails: [
        {
          value: 'mockuser@gmail.com',
        },
      ],
    });

    const response = await provider.refresh({} as any);

    expect(response).toEqual({
      profile: {
        displayName: 'Mocked User',
        email: 'mockuser@gmail.com',
        picture: 'http://google.com/lols',
      },
      providerInfo: {
        accessToken: 'a.b.c',
        idToken: 'my-id',
        refreshToken: 'dont-forget-to-send-refresh',
        scope: 'read_user',
      },
    });
  });
});
