import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import axios from 'axios';
import * as https from 'https';

export const createSonarCloudAction = () => {
  return createTemplateAction<{}>({
    id: 'kerberus:sonarcloud',
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
        },
      },
    },
    async handler(ctx) {
      const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      const sonarToken = Buffer.from(`${process.env.SONARQUBE_AUTH}`).toString(
        'base64',
      );
      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${sonarToken}`,
        },
      };

      const fullUrl = `https://${ctx.input.host.substring(1)}`;
      const url = new URL(fullUrl);
      const owner = url.searchParams.get('owner');
      const repo = url.searchParams.get('repo');

      // Get GitHub repository Id
      ctx.logger.info(`Getting repository id`);
      const ghRepo = await axiosInstance.get(
        `https://api.github.com/repos/${owner}/${repo}`,
      );
      ctx.logger.info(`Repository id on GitHub is ${ghRepo.data.id}`);

      // Create project on sonarcloud
      ctx.logger.info(`Creating project "${repo}" on SonarCloud.`);
      const configData = new URLSearchParams();
      configData.append(
        'installationKeys',
        `${owner}/${repo}|${ghRepo.data.id}`,
      );
      configData.append('organization', `${owner}`);
      await axiosInstance.post(
        'https://sonarcloud.io/api/alm_integration/provision_projects',
        configData,
        config,
      );
      ctx.logger.info(`Project "${repo}" created successfully.`);

      // Update project key
      // const newKey = ctx.input.component_id.substring(1);
      // ctx.logger.info(
      //   `Now change the project key (was ${createRepo.data.projects[0].projectKey}).`,
      // );
      // const updateData = new URLSearchParams();
      // updateData.append('from', `${createRepo.data.projects[0].projectKey}`);
      // updateData.append('to', `${newKey}`);
      // await axiosInstance.post(
      //   'https://sonarcloud.io/api/projects/update_key',
      //   updateData,
      //   config,
      // );
      // ctx.logger.info(`Project key updated successfully to "${newKey}".`);

      ctx.logger.info(`Project on SonarCloud created successfully! 👍`);
    },
  });
};
