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

const util = require('util');
const exec = util.promisify(require('child_process').exec);

export const createKeptnProjectAction = () => {
  return createTemplateAction<{}>({
    id: 'krateo:keptn',
    schema: {
      input: {
        required: ['host'],
        type: 'object',
        properties: {
          host: {
            type: 'string',
            title: 'Host',
            description: 'Host',
          },
          keptnHost: {
            type: 'string',
            title: 'Keptn Host',
            description: 'Keptn Host',
          },
          keptnToken: {
            type: 'string',
            title: 'Keptn Host',
            description: 'Keptn Host',
          },
          keptnImage: {
            type: 'string',
            title: 'Keptn Image',
            description: 'Keptn Image',
          },
          keptnImageTag: {
            type: 'string',
            title: 'Keptn Image Tag',
            description: 'Keptn Image Tag',
          },
        },
      },
    },
    async handler(ctx) {
      const fullUrl = `https://${ctx.input.host.substring(1)}`;
      const url = new URL(fullUrl);
      const owner = url.searchParams.get('owner');
      const repo = url.searchParams.get('repo');
      const base = url.origin;
      const repoURL = `${base}/${owner}/${repo}`;

      const keptnHost = ctx.input.keptnHost;
      const keptnApiToken = ctx.input.keptnToken;
      const keptnImage = ctx.input.keptnImage;
      const keptnImageTag = ctx.input.keptnImageTag;

      // ctx.logger.info(`Get Keptn Cli`);
      // await exec('curl -sL https://get.keptn.sh | KEPTN_VERSION=0.11.3 bash');

      ctx.logger.info(`Authenticate`);
      await exec(
        `keptn auth --endpoint=http://${keptnHost}/api --api-token=${keptnApiToken}`,
      );

      ctx.logger.info(`Create Project`);
      await exec(
        `keptn create project ${repo} --shipyard=https://raw.githubusercontent.com/${owner}/${repo}/main/shipyard.yaml --git-user=maurosala --git-token=${process.env.GITHUB_TOKEN} --git-remote-url=${repoURL}.git`,
      );

      ctx.logger.info(`Create Service`);
      await exec(`keptn create service demo --project=${repo}`);

      ctx.logger.info(`Download Helm Chart`);
      await exec(
        `wget ${base}/${owner}/${repo}/blob/main/demo.tgz?raw=true -O /tmp/demo.tgz`,
      );

      ctx.logger.info(`Upload Helm Chart`);
      await exec(
        `keptn add-resource --project=${repo} --service=demo --all-stages --resource=/tmp/demo.tgz --resourceUri=helm/demo.tgz`,
      );

      ctx.logger.info(`Keptn first deploy`);
      await exec(
        `keptn trigger delivery --project=${repo} --service=demo --image=${keptnImage} --tag=${keptnImageTag}`,
      );

      ctx.logger.info(`Project created successfully! 👍`);
    },
  });
};

// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
