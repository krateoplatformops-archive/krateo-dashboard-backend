/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import { DismissableBanner } from './DismissableBanner';
import Typography from '@material-ui/core/Typography';
import { WebStorage } from '@backstage/core-app-api';
import {
  ErrorApi,
  storageApiRef,
  StorageApi,
} from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { Link } from '../Link';

export default {
  title: 'Feedback/DismissableBanner',
  component: DismissableBanner,
};

let errorApi: ErrorApi;
const containerStyle = { width: '70%' };

const createWebStorage = (): StorageApi => {
  return WebStorage.create({ errorApi });
};

const apis = [[storageApiRef, createWebStorage()] as const];

export const Default = () => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner
        message="This is a dismissable banner"
        variant="info"
        id="default_dismissable"
      />
    </TestApiProvider>
  </div>
);

export const Error = () => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner
        message="This is a dismissable banner with an error message"
        variant="error"
        id="error_dismissable"
      />
    </TestApiProvider>
  </div>
);

export const EmojisIncluded = () => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner
        message="This is a dismissable banner with emojis: 🚀 💚 😆 "
        variant="info"
        id="emojis_dismissable"
      />
    </TestApiProvider>
  </div>
);

export const WithLink = () => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner
        message={
          <Typography>
            This is a dismissable banner with a link:{' '}
            <Link to="http://example.com" color="textPrimary">
              example.com
            </Link>
          </Typography>
        }
        variant="info"
        id="linked_dismissable"
      />
    </TestApiProvider>
  </div>
);

export const Fixed = () => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner
        message="This is a dismissable banner with a fixed position fixed at the bottom of the page"
        variant="info"
        id="fixed_dismissable"
        fixed
      />
    </TestApiProvider>
  </div>
);

export const Warning = () => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner
        message="This is a dismissable banner with a warning message"
        variant="warning"
        id="warning_dismissable"
      />
    </TestApiProvider>
  </div>
);
