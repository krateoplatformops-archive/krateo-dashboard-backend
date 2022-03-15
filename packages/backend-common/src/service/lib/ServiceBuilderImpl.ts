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

import { Config } from '@backstage/config';
import compression from 'compression';
import cors from 'cors';
import express, { Router, ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { ContentSecurityPolicyOptions } from 'helmet/dist/types/middlewares/content-security-policy';
import * as http from 'http';
import stoppable from 'stoppable';
import { Logger } from 'winston';
import { useHotCleanup } from '../../hot';
import { getRootLogger } from '../../logging';
import {
  errorHandler as defaultErrorHandler,
  notFoundHandler,
  requestLoggingHandler as defaultRequestLoggingHandler,
} from '../../middleware';
import { RequestLoggingHandlerFactory, ServiceBuilder } from '../types';
import {
  CspOptions,
  HttpsSettings,
  readBaseOptions,
  readCorsOptions,
  readCspOptions,
  readHttpsSettings,
} from './config';
import { createHttpServer, createHttpsServer } from './hostFactory';

export const DEFAULT_PORT = 7007;
// '' is express default, which listens to all interfaces
const DEFAULT_HOST = '';

export class ServiceBuilderImpl implements ServiceBuilder {
  private port: number | undefined;
  private host: string | undefined;
  private logger: Logger | undefined;
  private corsOptions: cors.CorsOptions | undefined;
  private cspOptions: Record<string, string[] | false> | undefined;
  private httpsSettings: HttpsSettings | undefined;
  private routers: [string, Router][];
  private requestLoggingHandler: RequestLoggingHandlerFactory | undefined;
  private errorHandler: ErrorRequestHandler | undefined;
  private useDefaultErrorHandler: boolean;
  // Reference to the module where builder is created - needed for hot module
  // reloading
  private module: NodeModule;

  constructor(moduleRef: NodeModule) {
    this.routers = [];
    this.module = moduleRef;
    this.useDefaultErrorHandler = true;
  }

  loadConfig(config: Config): ServiceBuilder {
    const backendConfig = config.getOptionalConfig('backend');
    if (!backendConfig) {
      return this;
    }

    const baseOptions = readBaseOptions(backendConfig);
    if (baseOptions.listenPort) {
      this.port =
        typeof baseOptions.listenPort === 'string'
          ? parseInt(baseOptions.listenPort, 10)
          : baseOptions.listenPort;
    }
    if (baseOptions.listenHost) {
      this.host = baseOptions.listenHost;
    }

    const corsOptions = readCorsOptions(backendConfig);
    if (corsOptions) {
      this.corsOptions = corsOptions;
    }

    const cspOptions = readCspOptions(backendConfig);
    if (cspOptions) {
      this.cspOptions = cspOptions;
    }

    const httpsSettings = readHttpsSettings(backendConfig);
    if (httpsSettings) {
      this.httpsSettings = httpsSettings;
    }

    return this;
  }

  setPort(port: number): ServiceBuilder {
    this.port = port;
    return this;
  }

  setHost(host: string): ServiceBuilder {
    this.host = host;
    return this;
  }

  setLogger(logger: Logger): ServiceBuilder {
    this.logger = logger;
    return this;
  }

  setHttpsSettings(settings: HttpsSettings): ServiceBuilder {
    this.httpsSettings = settings;
    return this;
  }

  enableCors(options: cors.CorsOptions): ServiceBuilder {
    this.corsOptions = options;
    return this;
  }

  setCsp(options: CspOptions): ServiceBuilder {
    this.cspOptions = options;
    return this;
  }

  addRouter(root: string, router: Router): ServiceBuilder {
    this.routers.push([root, router]);
    return this;
  }

  setRequestLoggingHandler(
    requestLoggingHandler: RequestLoggingHandlerFactory,
  ) {
    this.requestLoggingHandler = requestLoggingHandler;
    return this;
  }

  setErrorHandler(errorHandler: ErrorRequestHandler) {
    this.errorHandler = errorHandler;
    return this;
  }

  disableDefaultErrorHandler() {
    this.useDefaultErrorHandler = false;
    return this;
  }

  async start(): Promise<http.Server> {
    const app = express();
    const { port, host, logger, corsOptions, httpsSettings, helmetOptions } =
      this.getOptions();

    app.use(helmet(helmetOptions));
    if (corsOptions) {
      app.use(cors(corsOptions));
    }
    app.use(compression());
    app.use(
      (this.requestLoggingHandler ?? defaultRequestLoggingHandler)(logger),
    );
    for (const [root, route] of this.routers) {
      app.use(root, route);
    }
    app.use(notFoundHandler());

    if (this.errorHandler) {
      app.use(this.errorHandler);
    }

    if (this.useDefaultErrorHandler) {
      app.use(defaultErrorHandler());
    }

    const server: http.Server = httpsSettings
      ? await createHttpsServer(app, httpsSettings, logger)
      : createHttpServer(app, logger);
    const stoppableServer = stoppable(server, 0);

    useHotCleanup(this.module, () =>
      stoppableServer.stop((e: any) => {
        if (e) console.error(e);
      }),
    );

    return new Promise((resolve, reject) => {
      function handleStartupError(e: unknown) {
        server.close();
        reject(e);
      }

      server.on('error', handleStartupError);

      server.listen(port, host, () => {
        server.off('error', handleStartupError);
        logger.info(`Listening on ${host}:${port}`);
        resolve(stoppableServer);
      });
    });
  }

  private getOptions() {
    return {
      port: this.port ?? DEFAULT_PORT,
      host: this.host ?? DEFAULT_HOST,
      logger: this.logger ?? getRootLogger(),
      corsOptions: this.corsOptions,
      httpsSettings: this.httpsSettings,
      helmetOptions: {
        contentSecurityPolicy: {
          useDefaults: false,
          directives: applyCspDirectives(this.cspOptions),
        },
        // These are all disabled in order to maintain backwards compatibility
        // when bumping helmet v5. We can't enable these by default because
        // there is no way for users to configure them.
        // TODO(Rugvip): We should give control of this setup to consumers
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        originAgentCluster: false,
      },
    };
  }
}

export function applyCspDirectives(
  directives: Record<string, string[] | false> | undefined,
): ContentSecurityPolicyOptions['directives'] {
  const result: ContentSecurityPolicyOptions['directives'] =
    helmet.contentSecurityPolicy.getDefaultDirectives();

  // TODO(Rugvip): We currently use non-precompiled AJV for validation in the frontend, which uses eval.
  //               It should be replaced by any other solution that doesn't require unsafe-eval.
  result['script-src'] = ["'self'", "'unsafe-eval'"];

  // TODO(Rugvip): This is removed so that we maintained backwards compatibility
  //               when bumping to helmet v5, we could remove this as well as
  //               skip setting `useDefaults: false` in the future.
  delete result['form-action'];

  if (directives) {
    for (const [key, value] of Object.entries(directives)) {
      if (value === false) {
        delete result[key];
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
