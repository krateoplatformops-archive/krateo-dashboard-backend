import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import axios from 'axios';
import * as https from 'https';

export const creategitHubProtectionAction = () => {
  return createTemplateAction<{}>({
    id: 'kerberus:githubprotection',
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
      const config = {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      };

      // ctx.logger.info(JSON.stringify(config, null, 2));

      const fullUrl = `https://${ctx.input.host.substring(1)}`;
      const url = new URL(fullUrl);
      const owner = url.searchParams.get('owner');
      const repo = url.searchParams.get('repo');

      // Get GitHub repository Id
      ctx.logger.info(`Setting GitHub branch protection`);

      await axiosInstance.delete(
        `https://api.github.com/repos/${owner}/${repo}/branches/main/protection`,
        config,
      );

      ctx.logger.info(`Project settings applied successfully! 👍`);
    },
  });
};
