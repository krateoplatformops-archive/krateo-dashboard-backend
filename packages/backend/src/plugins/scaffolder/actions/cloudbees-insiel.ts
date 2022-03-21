/*
 * Copyright 2022 The Backstage Authors
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
import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { resolveSafeChildPath } from '@backstage/backend-common';
import { AppConfig, Config, ConfigReader } from '@backstage/config';

const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

import axios from 'axios';
import * as https from 'https';
import { v4 as uuidv4 } from 'uuid';

// const util = require('util');

export const createCloudbeesInsielAction = (options: { config: Config }) => {
  const { config } = options;

  return createTemplateAction<{
    host: string;
    component_id: string;
    masterName: string;
  }>({
    id: 'krateo:cloudbees-insiel',
    schema: {
      input: {
        required: ['host', 'component_id', 'masterName'],
        type: 'object',
        properties: {
          host: {
            type: 'string',
            title: 'Host',
            description: 'Host',
          },
          component_id: {
            type: 'string',
            title: 'Component Id',
            description: 'Component Id',
          },
          masterName: {
            type: 'string',
            title: 'Cloudbees node name',
            description: 'node name',
          },
          gitHubUrl: {
            type: 'string',
            title: 'GitHub Url',
            description: 'GitHub Url',
          },
        },
      },
    },
    async handler(ctx) {
      const fullUrl = `https://${ctx.input.host}`;
      const url = new URL(fullUrl);
      const owner = url.searchParams.get('owner');
      const repo = url.searchParams.get('repo');
      const base = url.origin;
      const repoURL = `${base}/${owner}/${repo}`;

      const templateUrl = ctx.templateInfo?.baseUrl.replace('/tree/main/', '');

      const workDir = await ctx.createTemporaryDirectory();
      const cbDir = resolveSafeChildPath(workDir, 'cloudbees');

      ctx.logger.info(`Created temporary directory: ${workDir}`);
      ctx.logger.info(`Cloudbees directory: ${cbDir}`);

      await git.clone({
        fs,
        http,
        dir: workDir,
        url: templateUrl,
        onAuth: () => ({ username: process.env.GITHUB_TOKEN }),
        ref: 'main',
        singleBranch: true,
        depth: 1,
      });

      nunjucks.configure(cbDir, {
        noCache: true,
        autoescape: true,
        tags: { variableStart: '${{' },
      });

      const appXml = path.join(cbDir, 'app.xml');
      const helmXml = path.join(cbDir, 'helm-chart.xml');

      // App
      const appModified = nunjucks.render(appXml, {
        owner,
        repo,
        gitHubUrl: ctx.input.gitHubUrl,
        guid: uuidv4(),
      });
      fs.writeFileSync(appXml, appModified, { encoding: 'utf-8' });
      ctx.logger.info(`Created app.xml`);

      // Helm Chart
      const helmModified = nunjucks.render(helmXml, {
        owner,
        gitHubUrl: ctx.input.gitHubUrl,
        repo: `${repo}-hc`,
        guid: uuidv4(),
      });
      fs.writeFileSync(helmXml, helmModified, { encoding: 'utf-8' });
      ctx.logger.info(`Created helm-chart.xml`);

      // calls
      const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      const instances = config.get('jenkins.instances');
      const cb = instances.find(i => i.name === ctx.input.masterName);

      const token = `${cb.username}:${cb.apiKey}`;
      // app
      //  data: Buffer.from(fs.readFileSync(appXml)),

      // ctx.logger.info(
      //   `${JSON.stringify(
      //     {
      //       Accept: '*/*',
      //       'Content-Type': `text/xml`,
      //       Authorization: `Basic ${Buffer.from(token).toString('base64')}`,
      //     },
      //     null,
      //     4,
      //   )}`,
      // );

      // ctx.logger.info(`token: ${token}`);
      ctx.logger.info(
        `url: ${cb.baseUrl}/createItem?name=${ctx.input.component_id}`,
      );
      await axiosInstance({
        method: 'post',
        url: `${cb.baseUrl}/createItem?name=${ctx.input.component_id}`,
        data: Buffer.from(fs.readFileSync(appXml)),
        headers: {
          Accept: '*/*',
          'Content-Type': `text/xml`,
          Authorization: `Basic ${Buffer.from(token).toString('base64')}`,
        },
      });
      ctx.logger.info(`App pipeline created`);
      // helm
      await axiosInstance({
        method: 'post',
        url: `${cb.baseUrl}/createItem?name=${ctx.input.component_id}-hc`,
        data: Buffer.from(fs.readFileSync(helmXml)),
        headers: {
          Accept: '*/*',
          'Content-Type': `text/xml`,
          Authorization: `Basic ${Buffer.from(token).toString('base64')}`,
        },
      });
      ctx.logger.info(`Helm Chart pipeline created`);

      ctx.logger.info(`All done successfully!`);
    },
  });
};
