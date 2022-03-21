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
        required: ['host'],
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

      // Get GitHub repository Id
      ctx.logger.info(`Setting GitHub branch protection`);

      await axiosInstance.delete(
        `https://${ctx.input.gitHubUrl}/repos/${owner}/${repo}/branches/main/protection`,
        config,
      );

      ctx.logger.info(`Project settings applied successfully! 👍`);
    },
  });
};
