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

export const createSonarQubeAction = () => {
  return createTemplateAction<{}>({
    id: 'krateo:sonarqube',
    schema: {
      input: {
        required: ['host', 'alm'],
        type: 'object',
        properties: {
          host: {
            type: 'string',
            title: 'Host',
            description: 'Host',
          },
          alm: {
            type: 'string',
            title: 'Alm',
            description: 'Alm Settings',
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
      const sonarToken = Buffer.from(`${process.env.SONARQUBE_AUTH}:`).toString(
        'base64',
      );
      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${sonarToken}`,
        },
      };

      // curl -u ${SONARQUBE_AUTH}: -X POST https://xxx/api/projects/create -d "name=kaakaa-test&project=kaakaa-test&organization=org" -vk

      const fullUrl = `https://${ctx.input.host}`;
      const url = new URL(fullUrl);
      const owner = url.searchParams.get('owner');
      const repo = url.searchParams.get('repo');

      // Create project on sonarqube
      ctx.logger.info(`Creating project "${repo}" on SonarQube.`);
      const configData = new URLSearchParams();
      configData.append('almSetting', ctx.input.alm);
      configData.append('organization', owner);
      configData.append('repositoryKey', `${owner}/${repo}`);

      // ctx.logger.info(`${process.env.SONARQUBE_URL}/api/alm_integrations/import_github_project`)
      // ctx.logger.info(JSON.stringify(config))
      // ctx.logger.info(configData)

      await axiosInstance.post(
        `${process.env.SONARQUBE_URL}/api/alm_integrations/import_github_project`,
        configData,
        config,
      );

      ctx.logger.info(`Project on SonarQube created successfully! 👍`);
    },
  });
};
