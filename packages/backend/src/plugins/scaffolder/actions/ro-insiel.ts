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
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const { Octokit } = require('@octokit/rest');

const util = require('util');

const getAllFiles = (dirPath: string, arrayOfFiles: any[] | null) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file: string) => {
    if (file !== '.git') {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, '/', file));
      }
    }
  });

  return arrayOfFiles;
};

export const createRoInsielAction = () => {
  return createTemplateAction<{
    host: string;
    component_id: string;
    gitHubUrl: string;
  }>({
    id: 'krateo:ro-insiel',
    schema: {
      input: {
        required: ['host', 'component_id', 'gitHubUrl'],
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

      const templateUrl = ctx.baseUrl.replace('/tree/main/', '');

      const workDir = await ctx.createTemporaryDirectory();
      const helmDir = resolveSafeChildPath(workDir, 'helm-chart');

      ctx.logger.info(`Created temporary directory: ${workDir}`);
      ctx.logger.info(`Helm directory: ${helmDir}`);

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

      // template
      const files = getAllFiles(helmDir, null);
      nunjucks.configure(helmDir, {
        noCache: true,
        autoescape: true,
        tags: { variableStart: '${{' },
      });
      files.forEach((f: any) => {
        const original = fs.readFileSync(f, { encoding: 'base64' });

        if (original.length > 0) {
          ctx.logger.info(`Processing file: ${f}`);
          const modified = nunjucks.render(f.replace(`${helmDir}/`, ''), {
            component_id: ctx.input.component_id,
          });

          if (original !== Buffer.from(modified, 'utf-8').toString('base64')) {
            fs.writeFileSync(f, modified, { encoding: 'utf-8' });
          }
        }
      });

      // check if is organization
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
        baseUrl: ctx.input.gitHubUrl,
      });
      let isOrganization = false;
      try {
        await octokit.rest.repos.listForOrg({
          org: owner,
        });
        isOrganization = true;
        ctx.logger.info(`Destination repo is org`);
      } catch (err) {
        ctx.logger.info(`Destination repo is not org`);
      }

      // push repo
      ctx.logger.info(`${repoURL}-hc`);
      if (isOrganization) {
        await octokit.rest.repos.createInOrg({
          org: owner,
          name: `${repo}-hc`,
        });
        await octokit.rest.repos.createInOrg({
          org: owner,
          name: `${repo}-keptn`,
        });
      } else {
        await octokit.rest.repos.createForAuthenticatedUser({
          name: `${repo}-hc`,
        });
        await octokit.rest.repos.createForAuthenticatedUser({
          name: `${repo}-keptn`,
        });
      }
      ctx.logger.info(`Created repository: ${repoURL}-hc`);
      ctx.logger.info(`Created repository: ${repoURL}-keptn`);

      await git.init({ fs, dir: helmDir, defaultBranch: 'main' });
      ctx.logger.info(`✅ Init`);
      await git.add({ fs, dir: helmDir, filepath: '.' });
      ctx.logger.info(`✅ Add *`);
      await git.commit({
        fs,
        dir: helmDir,
        author: {
          name: 'Scaffolder',
          email: '',
        },
        message: 'initial commit',
      });
      ctx.logger.info(`✅ Commit`);
      await git.addRemote({
        fs,
        dir: helmDir,
        remote: 'origin',
        url: `${repoURL}-hc.git`,
      });
      ctx.logger.info(`✅ Add remote ${repoURL}-hc.git`);
      await git.push({
        fs,
        http,
        dir: helmDir,
        remote: 'origin',
        ref: 'main',
        onAuth: () => ({ username: process.env.GITHUB_TOKEN }),
      });
      ctx.logger.info(`✅ Push`);

      ctx.logger.info(`Well done, pushed successfully!`);
    },
  });
};
