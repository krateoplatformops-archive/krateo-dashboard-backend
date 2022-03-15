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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { Client, errors } from '@elastic/elasticsearch';
import Mock from '@elastic/elasticsearch-mock';
import {
  ConcreteElasticSearchQuery,
  decodePageCursor,
  ElasticSearchSearchEngine,
  encodePageCursor,
} from './ElasticSearchSearchEngine';
import { ElasticSearchSearchEngineIndexer } from './ElasticSearchSearchEngineIndexer';

class ElasticSearchSearchEngineForTranslatorTests extends ElasticSearchSearchEngine {
  getTranslator() {
    return this.translator;
  }
}

const mock = new Mock();
const options = {
  node: 'http://localhost:9200',
  Connection: mock.getConnection(),
};

const indexerMock = {
  on: jest.fn(),
  indexName: 'expected-index-name',
};
jest.mock('./ElasticSearchSearchEngineIndexer', () => ({
  ElasticSearchSearchEngineIndexer: jest
    .fn()
    .mockImplementation(() => indexerMock),
}));

describe('ElasticSearchSearchEngine', () => {
  let testSearchEngine: ElasticSearchSearchEngine;
  let inspectableSearchEngine: ElasticSearchSearchEngineForTranslatorTests;
  let client: Client;

  beforeEach(() => {
    testSearchEngine = new ElasticSearchSearchEngine(
      options,
      'search',
      '',
      getVoidLogger(),
    );
    inspectableSearchEngine = new ElasticSearchSearchEngineForTranslatorTests(
      options,
      'search',
      '',
      getVoidLogger(),
    );
    // eslint-disable-next-line dot-notation
    client = testSearchEngine['elasticSearchClient'];
  });

  describe('queryTranslator', () => {
    beforeAll(() => {
      mock.clearAll();
      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => ({
          hits: {
            total: { value: 0, relation: 'eq' },
            hits: [],
          },
        }),
      );
    });
    it('should invoke the query translator', async () => {
      const translatorSpy = jest.fn().mockReturnValue({
        elasticSearchQuery: () => ({
          toJSON: () =>
            JSON.stringify({
              query: {
                match_all: {},
              },
            }),
        }),
        documentTypes: [],
      });
      testSearchEngine.setTranslator(translatorSpy);

      await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(translatorSpy).toHaveBeenCalledWith({
        term: 'testTerm',
        filters: {},
      });
    });

    it('should return translated query with 1 filter', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        filters: { kind: 'testKind' },
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
              },
            },
            filter: {
              match: {
                kind: 'testKind',
              },
            },
          },
        },
        from: 0,
        size: 25,
      });
    });

    it('should pass page cursor', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        pageCursor: 'MQ==',
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            filter: [],
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
              },
            },
          },
        },
        from: 25,
        size: 25,
      });
    });

    it('should return translated query with multiple filters', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        filters: { kind: 'testKind', namespace: 'testNameSpace' },
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
              },
            },
            filter: [
              {
                match: {
                  kind: 'testKind',
                },
              },
              {
                match: {
                  namespace: 'testNameSpace',
                },
              },
            ],
          },
        },
        from: 0,
        size: 25,
      });
    });

    it('should return translated query with filter with multiple values', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();

      const actualTranslatedQuery = translatorUnderTest({
        types: ['indexName'],
        term: 'testTerm',
        filters: { kind: ['testKind', 'kastTeint'] },
      }) as ConcreteElasticSearchQuery;

      expect(actualTranslatedQuery).toMatchObject({
        documentTypes: ['indexName'],
        elasticSearchQuery: expect.any(Object),
      });

      const queryBody = actualTranslatedQuery.elasticSearchQuery;

      expect(queryBody).toEqual({
        query: {
          bool: {
            must: {
              multi_match: {
                query: 'testTerm',
                fields: ['*'],
                fuzziness: 'auto',
                minimum_should_match: 1,
              },
            },
            filter: {
              bool: {
                should: [
                  {
                    match: {
                      kind: 'testKind',
                    },
                  },
                  {
                    match: {
                      kind: 'kastTeint',
                    },
                  },
                ],
              },
            },
          },
        },
        from: 0,
        size: 25,
      });
    });

    it('should throw if unsupported filter shapes passed in', async () => {
      const translatorUnderTest = inspectableSearchEngine.getTranslator();
      const actualTranslatedQuery = () =>
        translatorUnderTest({
          types: ['indexName'],
          term: 'testTerm',
          filters: { kind: { a: 'b' } },
        }) as ConcreteElasticSearchQuery;
      expect(actualTranslatedQuery).toThrow();
    });
  });

  describe('query functionality', () => {
    beforeEach(() => {
      mock.clearAll();
      mock.add(
        {
          method: 'GET',
          path: '/_cat/aliases/test-index__search',
        },
        () => [
          {
            alias: 'test-index__search',
            index: 'test-index-index__1626850643538',
            filter: '-',
            'routing.index': '-',
            'routing.search': '-',
            is_write_index: '-',
          },
        ],
      );
      mock.add(
        {
          method: 'POST',
          path: ['/_bulk'],
        },
        () => ({
          took: 30,
          errors: false,
          items: [
            {
              index: {
                _index: 'test',
                _type: '_doc',
                _id: '1',
                _version: 1,
                result: 'created',
                _shards: {
                  total: 2,
                  successful: 1,
                  failed: 0,
                },
                status: 201,
                _seq_no: 0,
                _primary_term: 1,
              },
            },
          ],
        }),
      );

      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => ({
          hits: {
            total: { value: 0, relation: 'eq' },
            hits: [],
          },
        }),
      );
    });

    // Mostly useless test since we are more or less testing the mock, runs through the whole flow though
    // We might want to spin up ES test container to run against the real engine.
    // That container eats GBs of memory so opting out of that for now...
    it('should perform search query and return 0 results on empty index', async () => {
      const mockedSearchResult = await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      // Should return 0 results as nothing is indexed here
      expect(mockedSearchResult).toMatchObject({
        results: [],
        nextPageCursor: undefined,
      });
    });

    it('should perform search query with more results than one page', async () => {
      mock.clear({
        method: 'POST',
        path: '/*__search/_search',
      });
      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => {
          return {
            hits: {
              total: { value: 30, relation: 'eq' },
              hits: Array(25)
                .fill(null)
                .map((_, i) => ({
                  _index: 'mytype-index__',
                  _source: {
                    value: `${i}`,
                  },
                })),
            },
          };
        },
      );

      const mockedSearchResult = await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(mockedSearchResult).toMatchObject({
        results: expect.arrayContaining(
          Array(25)
            .fill(null)
            .map((_, i) => ({
              type: 'mytype',
              document: { value: `${i}` },
            })),
        ),
        nextPageCursor: 'MQ==',
      });
    });

    it('should perform search query for second page', async () => {
      mock.clear({
        method: 'POST',
        path: '/*__search/_search',
      });
      mock.add(
        {
          method: 'POST',
          path: '/*__search/_search',
        },
        () => {
          return {
            hits: {
              total: { value: 30, relation: 'eq' },
              hits: Array(30)
                .fill(null)
                .map((_, i) => ({
                  _index: 'mytype-index__',
                  _source: {
                    value: `${i}`,
                  },
                }))
                .slice(25),
            },
          };
        },
      );

      const mockedSearchResult = await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
        pageCursor: 'MQ==',
      });

      expect(mockedSearchResult).toMatchObject({
        results: expect.arrayContaining(
          Array(30)
            .fill(null)
            .map((_, i) => ({
              type: 'mytype',
              document: { value: `${i}` },
            }))
            .slice(25),
        ),
        previousPageCursor: 'MA==',
      });
    });

    it('should handle index/search type filtering correctly', async () => {
      const elasticSearchQuerySpy = jest.spyOn(client, 'search');
      await testSearchEngine.query({
        term: 'testTerm',
        filters: {},
      });

      expect(elasticSearchQuerySpy).toHaveBeenCalled();
      expect(elasticSearchQuerySpy).toHaveBeenCalledWith({
        body: {
          query: {
            bool: {
              must: {
                multi_match: {
                  query: 'testTerm',
                  fields: ['*'],
                  fuzziness: 'auto',
                  minimum_should_match: 1,
                },
              },
              filter: [],
            },
          },
          from: 0,
          size: 25,
        },
        index: '*__search',
      });

      elasticSearchQuerySpy.mockClear();
    });

    it('should create matchAll query if no term defined', async () => {
      const elasticSearchQuerySpy = jest.spyOn(client, 'search');
      await testSearchEngine.query({
        term: '',
        filters: {},
      });

      expect(elasticSearchQuerySpy).toHaveBeenCalled();
      expect(elasticSearchQuerySpy).toHaveBeenCalledWith({
        body: {
          query: {
            bool: {
              must: {
                match_all: {},
              },
              filter: [],
            },
          },
          from: 0,
          size: 25,
        },
        index: '*__search',
      });

      elasticSearchQuerySpy.mockClear();
    });

    it('should query only specified indices if defined', async () => {
      const elasticSearchQuerySpy = jest.spyOn(client, 'search');
      await testSearchEngine.query({
        term: '',
        filters: {},
        types: ['test-type'],
      });

      expect(elasticSearchQuerySpy).toHaveBeenCalled();
      expect(elasticSearchQuerySpy).toHaveBeenCalledWith({
        body: {
          query: {
            bool: {
              must: {
                match_all: {},
              },
              filter: [],
            },
          },
          from: 0,
          size: 25,
        },
        index: ['test-type__search'],
      });

      elasticSearchQuerySpy.mockClear();
    });
  });

  describe('indexer', () => {
    it('should get indexer', async () => {
      const indexer = await testSearchEngine.getIndexer('test-index');

      expect(indexer).toStrictEqual(indexerMock);
      expect(ElasticSearchSearchEngineIndexer).toHaveBeenCalledWith(
        expect.objectContaining({
          alias: 'test-index__search',
          type: 'test-index',
          indexPrefix: '',
          indexSeparator: '-index__',
          elasticSearchClient: client,
        }),
      );
      expect(indexerMock.on).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
      );
    });

    describe('onError', () => {
      let errorHandler: Function;
      const error = new Error('some error');

      beforeEach(async () => {
        mock.clearAll();
        await testSearchEngine.getIndexer('test-index');
        errorHandler = indexerMock.on.mock.calls[0][1];
      });

      it('should check for and delete expected index', async () => {
        const existsSpy = jest.fn().mockReturnValue('truthy value');
        const deleteSpy = jest.fn().mockReturnValue({});
        mock.add({ method: 'HEAD', path: '/expected-index-name' }, existsSpy);
        mock.add({ method: 'DELETE', path: '/expected-index-name' }, deleteSpy);

        await errorHandler(error);

        // Check and delete HTTP requests were made.
        expect(existsSpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
      });

      it('should not delete index if none exists', async () => {
        // Exists call returns 404 on no index.
        const existsSpy = jest.fn().mockReturnValue(
          new errors.ResponseError({
            statusCode: 404,
            body: { status: 404 },
          } as unknown as any),
        );
        const deleteSpy = jest.fn().mockReturnValue({});
        mock.add({ method: 'HEAD', path: '/expected-index-name' }, existsSpy);
        mock.add({ method: 'DELETE', path: '/expected-index-name' }, deleteSpy);

        await errorHandler(error);

        // Check request was made, but no delete request was made.
        expect(existsSpy).toHaveBeenCalled();
        expect(deleteSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('ElasticSearchSearchEngine.fromConfig', () => {
    it('accesses the clientOptions config', async () => {
      const esOptions = {
        clientOptions: {
          ssl: {
            rejectUnauthorized: true,
          },
        },
        node: 'http://test-node',
        auth: {
          apiKey: 'key',
        },
      };

      const config = new ConfigReader({});
      const esConfig = new ConfigReader(esOptions);
      jest.spyOn(config, 'getConfig').mockImplementation(() => esConfig);
      const getOptionalConfig = jest.spyOn(esConfig, 'getOptionalConfig');

      await ElasticSearchSearchEngine.fromConfig({
        logger: getVoidLogger(),
        config,
      });

      expect(getOptionalConfig.mock.calls[0][0]).toEqual('clientOptions');
    });

    it('does not require the clientOptions config', async () => {
      const config = new ConfigReader({
        search: {
          elasticsearch: {
            node: 'http://test-node',
            auth: {
              apiKey: 'test-key',
            },
          },
        },
      });

      expect(
        async () =>
          await ElasticSearchSearchEngine.fromConfig({
            logger: getVoidLogger(),
            config,
          }),
      ).not.toThrowError();
    });
  });
});

describe('decodePageCursor', () => {
  test('should decode page', () => {
    expect(decodePageCursor('MQ==')).toEqual({ page: 1 });
  });

  test('should fallback to first page if empty', () => {
    expect(decodePageCursor()).toEqual({ page: 0 });
  });
});

describe('encodePageCursor', () => {
  test('should encode page', () => {
    expect(encodePageCursor({ page: 1 })).toEqual('MQ==');
  });
});
