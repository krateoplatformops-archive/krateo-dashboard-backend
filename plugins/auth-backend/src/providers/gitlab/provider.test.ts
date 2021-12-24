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

import { GitlabAuthProvider, gitlabDefaultSignInResolver } from './provider';
import * as helpers from '../../lib/passport/PassportStrategyHelper';
import { PassportProfile } from '../../lib/passport/types';
import { OAuthResult } from '../../lib/oauth';
import { getVoidLogger } from '@backstage/backend-common';
import { TokenIssuer } from '../../identity';
import { CatalogIdentityClient } from '../../lib/catalog';

const mockFrameHandler = jest.spyOn(
  helpers,
  'executeFrameHandlerStrategy',
) as unknown as jest.MockedFunction<() => Promise<{ result: OAuthResult }>>;

describe('GitlabAuthProvider', () => {
  const tokenIssuer = {
    issueToken: jest.fn(),
    listPublicKeys: jest.fn(),
  };
  const catalogIdentityClient = {
    findUser: jest.fn(),
  };

  const provider = new GitlabAuthProvider({
    clientId: 'mock',
    clientSecret: 'mock',
    callbackUrl: 'mock',
    baseUrl: 'mock',
    catalogIdentityClient:
      catalogIdentityClient as unknown as CatalogIdentityClient,
    tokenIssuer: tokenIssuer as unknown as TokenIssuer,
    authHandler: async ({ fullProfile }) => ({
      profile: {
        email: fullProfile.emails![0]!.value,
        displayName: fullProfile.displayName,
        picture: 'http://gitlab.com/lols',
      },
    }),
    signInResolver: gitlabDefaultSignInResolver,
    logger: getVoidLogger(),
  });

  it('should transform to type OAuthResponse', async () => {
    const tests = [
      {
        input: {
          result: {
            accessToken: '19xasczxcm9n7gacn9jdgm19me',
            fullProfile: {
              id: 'uid-123',
              username: 'jimmymarkum',
              provider: 'gitlab',
              displayName: 'Jimmy Markum',
              emails: [
                {
                  value: 'jimmymarkum@gmail.com',
                },
              ],
              avatarUrl:
                'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
            },
            params: {
              scope: 'user_read write_repository',
              expires_in: 100,
            },
          },
          privateInfo: {
            refreshToken: 'gacn9jdgm19me19xasczxcm9n7',
          },
        },
        expect: {
          backstageIdentity: {
            id: 'jimmymarkum',
          },
          providerInfo: {
            accessToken: '19xasczxcm9n7gacn9jdgm19me',
            expiresInSeconds: 100,
            scope: 'user_read write_repository',
            idToken: undefined,
          },
          profile: {
            email: 'jimmymarkum@gmail.com',
            displayName: 'Jimmy Markum',
            picture: 'http://gitlab.com/lols',
          },
        },
      },
      {
        input: {
          result: {
            accessToken:
              'ajakljsdoiahoawxbrouawucmbawe.awkxjemaneasdxwe.sodijxqeqwexeqwxe',
            fullProfile: {
              id: 'ipd12039',
              username: 'daveboyle',
              provider: 'gitlab',
              displayName: 'Dave Boyle',
              emails: [
                {
                  value: 'daveboyle@gitlab.org',
                },
              ],
            },
            params: {
              scope: 'read_repository',
              expires_in: 200,
            },
          },
          privateInfo: {
            refreshToken: 'gacn96f3y6y5jdgm19mec348nqrty719xasczf356yxcm9n7',
          },
        },
        expect: {
          backstageIdentity: {
            id: 'daveboyle',
          },
          providerInfo: {
            accessToken:
              'ajakljsdoiahoawxbrouawucmbawe.awkxjemaneasdxwe.sodijxqeqwexeqwxe',
            expiresInSeconds: 200,
            idToken: undefined,
            scope: 'read_repository',
          },
          profile: {
            displayName: 'Dave Boyle',
            email: 'daveboyle@gitlab.org',
            picture: 'http://gitlab.com/lols',
          },
        },
      },
    ];

    for (const test of tests) {
      mockFrameHandler.mockResolvedValueOnce(test.input);
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(test.expect);
    }
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
      provider: 'gitlab',
      displayName: 'Mocked User',
      emails: [
        {
          value: 'mockuser@gmail.com',
        },
      ],
    });

    const response = await provider.refresh({} as any);

    expect(response).toEqual({
      backstageIdentity: {
        id: 'mockuser',
      },
      profile: {
        displayName: 'Mocked User',
        email: 'mockuser@gmail.com',
        picture: 'http://gitlab.com/lols',
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
