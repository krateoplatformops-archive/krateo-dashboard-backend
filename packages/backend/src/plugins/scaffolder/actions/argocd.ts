import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import axios from 'axios';
import * as https from 'https';

export const createArgoCDAction = () => {
  return createTemplateAction<{}>({
    id: 'kerberus:argocd',
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
          pathRepoSubfolder: {
            type: 'bool',
            title: 'Path Repo Subfolder',
            description: 'Path Repo Subfolder',
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

      // ctx.logger.info(`Waiting for repository creation`);
      // await delay(7000);
      // ctx.logger.info(`We assume it was created`);

      const fullUrl = `https://${ctx.input.host.substring(1)}`;
      const url = new URL(fullUrl);
      const owner = url.searchParams.get('owner');
      const repo = url.searchParams.get('repo');
      const base = url.origin;

      const payload = {
        metadata: {
          name: repo,
        },
        spec: {
          source: {
            repoURL: `${base}/${owner}/${repo}.git`,
            path: `charts/${
              ctx.input.pathRepoSubfolder === 'true' ? `${repo}/` : ''
            }`,
          },
          destination: {
            namespace: repo,
            server: 'https://kubernetes.default.svc',
          },
          syncPolicy: {
            syncOptions: ['CreateNamespace=true'],
            automated: {
              allowEmpty: true,
              prune: false,
              selfHeal: false,
            },
          },
        },
      };

      ctx.logger.info(`Creating application on ArgoCD whit this payload:`);
      ctx.logger.info(`${JSON.stringify(payload, null, 4)}`);

      await axiosInstance.post(
        `http://argocd-server.argo-system.svc/api/v1/applications`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Cookie: `${process.env.ARGOCD_AUTH_TOKEN}`,
          },
        },
      );
      ctx.logger.info(`Application created successfully! 👍`);
    },
  });
};

// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
