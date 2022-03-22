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
import axios from 'axios';
import * as https from 'https';

export const createGbpEnterpriseAction = () => {
  return createTemplateAction<{}>({
    id: 'krateo:gbp-enterprise',
    schema: {
      input: {
        required: [],
        type: 'object',
        properties: {
          host: {
            type: 'string',
            title: 'Host',
            description: 'Host',
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
      ctx.logger.info(JSON.stringify(ctx.input, null, 4));

      const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      const config = {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      };
      // ctx.logger.info(JSON.stringify(config));

      ctx.logger.info(`Setting GitHub branch protection`);

      const fullUrl = `https://${ctx.input.host}`;
      const url = new URL(fullUrl);
      const owner = url.searchParams.get('owner');
      const repo = url.searchParams.get('repo');

      ctx.logger.info(
        `${ctx.input.gitHubUrl}/repos/${owner}/${repo}/branches/main/protection`,
      );

      await axiosInstance.delete(
        `${ctx.input.gitHubUrl}/repos/${owner}/${repo}/branches/main/protection`,
        config,
      );

      ctx.logger.info(`Project settings applied successfully! 👍`);
    },
  });
};
