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

import express from 'express';
import LdapStrategy from 'passport-ldapauth';
import { executeFrameHandlerStrategy } from '../../lib/passport';
import { AuthProviderFactory, AuthProviderRouteHandlers } from '../types';
import { Logger } from 'winston';

export type LdapProviderOptions = {
  url: string;
  bindDN: string;
  bindCredentials: string;
  searchBase: string;
  searchFilter: string;
  logger: Logger;
};

export class LdapAuthProvider implements AuthProviderRouteHandlers {
  private readonly _strategy: LdapStrategy;

  constructor(options: LdapProviderOptions) {
    this._strategy = new LdapStrategy({
      server: {
        url: options.url,
        bindDN: options.bindDN,
        bindCredentials: options.bindCredentials,
        searchBase: options.searchBase,
        searchFilter: options.searchFilter,
      },
    });
  }

  async start(req: express.Request, res: express.Response): Promise<void> {
    const resp = await executeFrameHandlerStrategy(req, this._strategy);
    // const { url } = await executeRedirectStrategy(req, this.strategy, {});
    // res.redirect(url);
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    // console.log(resp);
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    res.send(resp.result);
  }

  async frameHandler() {}
  async logout() {}
  // async refresh() {}
}

export const createLdapProvider: AuthProviderFactory = () => {
  return ({ providerId, globalConfig, config, logger }) => {
    const url = config.getString('url');
    const bindDN = config.getString('bindDN');
    const bindCredentials = config.getString('bindCredentials');
    const searchBase = config.getString('searchBase');
    const searchFilter = config.getString('searchFilter');

    return new LdapAuthProvider({
      url,
      bindDN,
      bindCredentials,
      searchBase,
      searchFilter,
      logger,
    });
  };
};
