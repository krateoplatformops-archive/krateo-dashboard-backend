/*
 * Copyright 2021 The Backstage Authors
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

import aws, { Credentials, S3 } from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  ReadTreeResponseFactory,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchResponse,
  UrlReader,
} from './types';
import getRawBody from 'raw-body';
import {
  AwsS3Integration,
  ScmIntegrations,
  AwsS3IntegrationConfig,
} from '@backstage/integration';
import { ForwardedError, NotModifiedError } from '@backstage/errors';
import { ListObjectsV2Output, ObjectList } from 'aws-sdk/clients/s3';

const parseURL = (
  url: string,
  config: AwsS3IntegrationConfig,
): { path: string; bucket: string; region: string } => {
  let { host, pathname } = new URL(url);

  /**
   * Removes the leading '/' from the pathname to be processed
   * as a parameter by AWS S3 SDK getObject method.
   */
  pathname = pathname.substr(1);

  let bucket;
  let region;

  /**
   * Path style URLs: https://s3.Region.amazonaws.com/bucket-name/key-name
   * Virtual hosted style URLs: https://bucket-name.s3.Region.amazonaws.com/key-name
   * See https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access
   */
  if (config.s3ForcePathStyle) {
    if (pathname.indexOf('/') < 0) {
      throw new Error(
        `invalid path-style AWS S3 URL, ${url} does not contain bucket in the path`,
      );
    }
    [bucket] = pathname.split('/');
    pathname = pathname.substr(bucket.length + 1);
  } else {
    if (host.indexOf('.') < 0) {
      throw new Error(
        `invalid virtual hosted-style AWS S3 URL, ${url} does not contain bucket prefix in the host`,
      );
    }
    [bucket] = host.split('.');
    host = host.substr(bucket.length + 1);
  }

  // Only extract region from *.amazonaws.com hosts
  if (config.host === 'amazonaws.com') {
    // At this point bucket prefix is removed from host for virtual hosted URLs
    const match = host.match(/^s3\.([a-z\d-]+)\.amazonaws\.com$/);
    if (!match) {
      throw new Error(
        `invalid AWS S3 URL, cannot parse region from host in ${url}`,
      );
    }
    region = match[1];
  } else {
    region = '';
  }

  return {
    path: pathname,
    bucket: bucket,
    region: region,
  };
};

/**
 * Implements a {@link UrlReader} for AWS S3 buckets.
 *
 * @public
 */
export class AwsS3UrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);

    return integrations.awsS3.list().map(integration => {
      const creds = AwsS3UrlReader.buildCredentials(integration);

      const s3 = new S3({
        apiVersion: '2006-03-01',
        credentials: creds,
        endpoint: integration.config.endpoint,
        s3ForcePathStyle: integration.config.s3ForcePathStyle,
      });
      const reader = new AwsS3UrlReader(integration, {
        s3,
        treeResponseFactory,
      });
      const predicate = (url: URL) =>
        url.host.endsWith(integration.config.host);
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: AwsS3Integration,
    private readonly deps: {
      s3: S3;
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {}

  /**
   * If accessKeyId and secretAccessKey are missing, the standard credentials provider chain will be used:
   * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
   */
  private static buildCredentials(
    integration?: AwsS3Integration,
  ): Credentials | CredentialsOptions | undefined {
    if (!integration) {
      return undefined;
    }

    const accessKeyId = integration.config.accessKeyId;
    const secretAccessKey = integration.config.secretAccessKey;
    let explicitCredentials: Credentials | undefined;

    if (accessKeyId && secretAccessKey) {
      explicitCredentials = new Credentials({
        accessKeyId,
        secretAccessKey,
      });
    }

    const roleArn = integration.config.roleArn;
    if (roleArn) {
      return new aws.ChainableTemporaryCredentials({
        masterCredentials: explicitCredentials,
        params: {
          RoleSessionName: 'backstage-aws-s3-url-reader',
          RoleArn: roleArn,
        },
      });
    }

    return explicitCredentials;
  }

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    try {
      const { path, bucket, region } = parseURL(url, this.integration.config);
      aws.config.update({ region: region });

      let params;
      if (options?.etag) {
        params = {
          Bucket: bucket,
          Key: path,
          IfNoneMatch: options.etag,
        };
      } else {
        params = {
          Bucket: bucket,
          Key: path,
        };
      }

      const request = this.deps.s3.getObject(params);
      options?.signal?.addEventListener('abort', () => request.abort());
      const buffer = await getRawBody(request.createReadStream());
      const etag = (await request.promise()).ETag;

      return {
        buffer: async () => buffer,
        etag: etag,
      };
    } catch (e) {
      if (e.statusCode === 304) {
        throw new NotModifiedError();
      }

      throw new ForwardedError('Could not retrieve file from S3', e);
    }
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    try {
      const { path, bucket, region } = parseURL(url, this.integration.config);
      const allObjects: ObjectList = [];
      const responses = [];
      let continuationToken: string | undefined;
      let output: ListObjectsV2Output;
      do {
        aws.config.update({ region: region });
        const request = this.deps.s3.listObjectsV2({
          Bucket: bucket,
          ContinuationToken: continuationToken,
          Prefix: path,
        });
        options?.signal?.addEventListener('abort', () => request.abort());
        output = await request.promise();
        if (output.Contents) {
          output.Contents.forEach(contents => {
            allObjects.push(contents);
          });
        }
        continuationToken = output.NextContinuationToken;
      } while (continuationToken);

      for (let i = 0; i < allObjects.length; i++) {
        const object = this.deps.s3.getObject({
          Bucket: bucket,
          Key: String(allObjects[i].Key),
        });
        responses.push({
          data: object.createReadStream(),
          path: String(allObjects[i].Key),
        });
      }

      return await this.deps.treeResponseFactory.fromReadableArray(responses);
    } catch (e) {
      throw new ForwardedError('Could not retrieve file tree from S3', e);
    }
  }

  async search(): Promise<SearchResponse> {
    throw new Error('AwsS3Reader does not implement search');
  }

  toString() {
    const secretAccessKey = this.integration.config.secretAccessKey;
    return `awsS3{host=${this.integration.config.host},authed=${Boolean(
      secretAccessKey,
    )}}`;
  }
}
