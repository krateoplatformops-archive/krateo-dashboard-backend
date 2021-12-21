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
          pathRepoSubfolder: {
            type: 'bool',
            title: 'Path Repo Subfolder',
            description: 'Path Repo Subfolder',
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
      const keptnApiToken = 'WjVrlc8cM1AahXgcP78CK6RPA1xinXBIBGcufOmH150h3';

      // ctx.logger.info(`Get Keptn Cli`);
      // await exec('curl -sL https://get.keptn.sh | KEPTN_VERSION=0.11.3 bash');

      ctx.logger.info(`Authenticate`);
      await exec(
        `keptn auth --endpoint=http://keptn.krateoplatformops.io/api --api-token=${keptnApiToken}`,
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
        `keptn trigger delivery --project=${repo} --service=demo --image=docker.io/maurosala/rv-demo --tag=1.0.0`,
      );

      ctx.logger.info(`Project created successfully! 👍`);
    },
  });
};

// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
