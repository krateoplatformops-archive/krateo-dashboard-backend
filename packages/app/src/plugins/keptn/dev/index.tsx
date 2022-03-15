import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { keptnPlugin, KeptnPage } from '../src/plugin';

createDevApp()
  .registerPlugin(keptnPlugin)
  .addPage({
    element: <KeptnPage />,
    title: 'Root Page',
    path: '/keptn'
  })
  .render();
