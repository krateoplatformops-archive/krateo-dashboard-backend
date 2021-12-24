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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { TokenIssuer } from '../identity/types';
import { OAuthStartRequest } from '../lib/oauth/types';
import { CatalogIdentityClient } from '../lib/catalog';

export type AuthProviderConfig = {
  /**
   * The protocol://domain[:port] where the app is hosted. This is used to construct the
   * callbackURL to redirect to once the user signs in to the auth provider.
   */
  baseUrl: string;

  /**
   * The base URL of the app as provided by app.baseUrl
   */
  appUrl: string;

  /**
   * A function that is called to check whether an origin is allowed to receive the authentication result.
   */
  isOriginAllowed: (origin: string) => boolean;
};

export type RedirectInfo = {
  /**
   * URL to redirect to
   */
  url: string;
  /**
   * Status code to use for the redirect
   */
  status?: number;
};

/**
 * Any Auth provider needs to implement this interface which handles the routes in the
 * auth backend. Any auth API requests from the frontend reaches these methods.
 *
 * The routes in the auth backend API are tied to these methods like below
 *
 * /auth/[provider]/start -> start
 * /auth/[provider]/handler/frame -> frameHandler
 * /auth/[provider]/refresh -> refresh
 * /auth/[provider]/logout -> logout
 */
export interface AuthProviderRouteHandlers {
  /**
   * Handles the start route of the API. This initiates a sign in request with an auth provider.
   *
   * Request
   * - scopes for the auth request (Optional)
   * Response
   * - redirect to the auth provider for the user to sign in or consent.
   * - sets a nonce cookie and also pass the nonce as 'state' query parameter in the redirect request
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  start(req: express.Request, res: express.Response): Promise<void>;

  /**
   * Once the user signs in or consents in the OAuth screen, the auth provider redirects to the
   * callbackURL which is handled by this method.
   *
   * Request
   * - to contain a nonce cookie and a 'state' query parameter
   * Response
   * - postMessage to the window with a payload that contains accessToken, expiryInSeconds?, idToken? and scope.
   * - sets a refresh token cookie if the auth provider supports refresh tokens
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  frameHandler(req: express.Request, res: express.Response): Promise<void>;

  /**
   * (Optional) If the auth provider supports refresh tokens then this method handles
   * requests to get a new access token.
   *
   * Request
   * - to contain a refresh token cookie and scope (Optional) query parameter.
   * Response
   * - payload with accessToken, expiryInSeconds?, idToken?, scope and user profile information.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  refresh?(req: express.Request, res: express.Response): Promise<void>;

  /**
   * (Optional) Handles sign out requests
   *
   * Response
   * - removes the refresh token cookie
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  logout?(req: express.Request, res: express.Response): Promise<void>;
}

export type AuthProviderFactoryOptions = {
  providerId: string;
  globalConfig: AuthProviderConfig;
  config: Config;
  logger: Logger;
  tokenIssuer: TokenIssuer;
  discovery: PluginEndpointDiscovery;
  catalogApi: CatalogApi;
};

export type AuthProviderFactory = (
  options: AuthProviderFactoryOptions,
) => AuthProviderRouteHandlers;

export type AuthResponse<ProviderInfo> = {
  providerInfo: ProviderInfo;
  profile: ProfileInfo;
  backstageIdentity?: BackstageIdentityResponse;
};

/**
 * User identity information within Backstage.
 *
 * @public
 */
export type BackstageUserIdentity = {
  /**
   * The type of identity that this structure represents. In the frontend app
   * this will currently always be 'user'.
   */
  type: 'user';

  /**
   * The entityRef of the user in the catalog.
   * For example User:default/sandra
   */
  userEntityRef: string;

  /**
   * The user and group entities that the user claims ownership through
   */
  ownershipEntityRefs: string[];
};

/**
 * A representation of a successful Backstage sign-in.
 *
 * Compared to the {@link BackstageIdentityResponse} this type omits
 * the decoded identity information embedded in the token.
 *
 * @public
 */
export interface BackstageSignInResult {
  /**
   * An opaque ID that uniquely identifies the user within Backstage.
   *
   * This is typically the same as the user entity `metadata.name`.
   *
   * @deprecated Use the `identity` field instead
   */
  id: string;

  /**
   * The entity that the user is represented by within Backstage.
   *
   * This entity may or may not exist within the Catalog, and it can be used
   * to read and store additional metadata about the user.
   *
   * @deprecated Use the `identity` field instead.
   */
  entity?: Entity;

  /**
   * The token used to authenticate the user within Backstage.
   */
  token: string;
}

/**
 * The old exported symbol for {@link BackstageSignInResult}.
 * @public
 * @deprecated Use the `BackstageSignInResult` type instead.
 */
export type BackstageIdentity = BackstageSignInResult;

/**
 * Response object containing the {@link BackstageUserIdentity} and the token from the authentication provider.
 * @public
 */
export interface BackstageIdentityResponse extends BackstageSignInResult {
  /**
   * A plaintext description of the identity that is encapsulated within the token.
   */
  identity: BackstageUserIdentity;
}

/**
 * Used to display login information to user, i.e. sidebar popup.
 *
 * It is also temporarily used as the profile of the signed-in user's Backstage
 * identity, but we want to replace that with data from identity and/org catalog service
 *
 * @public
 */
export type ProfileInfo = {
  /**
   * Email ID of the signed in user.
   */
  email?: string;
  /**
   * Display name that can be presented to the signed in user.
   */
  displayName?: string;
  /**
   * URL to an image that can be used as the display image or avatar of the
   * signed in user.
   */
  picture?: string;
};

/**
 * type of sign in information context, includes the profile information and authentication result which contains auth. related information
 * @public
 */
export type SignInInfo<AuthResult> = {
  /**
   * The simple profile passed down for use in the frontend.
   */
  profile: ProfileInfo;

  /**
   * The authentication result that was received from the authentication provider.
   */
  result: AuthResult;
};

/**
 * Sign in resolver type describes the function which handles the result of a successful authentication
 * and it must return a valid {@link BackstageSignInResult}
 * @public
 */
export type SignInResolver<AuthResult> = (
  info: SignInInfo<AuthResult>,
  context: {
    tokenIssuer: TokenIssuer;
    catalogIdentityClient: CatalogIdentityClient;
    logger: Logger;
  },
) => Promise<BackstageSignInResult>;

/**
 * The return type of authentication handler which must contain a valid profile information
 * @public
 */
export type AuthHandlerResult = { profile: ProfileInfo };

/**
 * The AuthHandler function is called every time the user authenticates using the provider.
 *
 * The handler should return a profile that represents the session for the user in the frontend.
 *
 * Throwing an error in the function will cause the authentication to fail, making it
 * possible to use this function as a way to limit access to a certain group of users.
 *
 * @public
 */
export type AuthHandler<AuthResult> = (
  input: AuthResult,
) => Promise<AuthHandlerResult>;

export type StateEncoder = (
  req: OAuthStartRequest,
) => Promise<{ encodedState: string }>;
