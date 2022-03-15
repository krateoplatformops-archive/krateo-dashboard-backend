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

import { ConfigReader } from '@backstage/config';
import {
  AuthorizeDecision,
  AuthorizeResult,
  PermissionAuthorizer,
} from '@backstage/plugin-permission-common';
import {
  DocumentTypeInfo,
  IndexableDocument,
  SearchEngine,
} from '@backstage/plugin-search-common';
import {
  encodePageCursor,
  decodePageCursor,
  AuthorizedSearchEngine,
} from './AuthorizedSearchEngine';

describe('AuthorizedSearchEngine', () => {
  const typeUsers = 'users';
  const typeTemplates = 'templates';
  const typeServices = 'services';
  const typeGroups = 'groups';

  function generateSampleResults(type: string, withAuthorization?: boolean) {
    return Array(10)
      .fill(0)
      .map((_, index) => ({
        type,
        document: {
          title: `${type}_doc_${index}`,
          authorization: withAuthorization
            ? { resourceRef: `${type}_doc_${index}` }
            : undefined,
        } as IndexableDocument,
      }));
  }

  const allUsers = generateSampleResults(typeUsers);
  const allTemplates = generateSampleResults(typeTemplates);

  const results = allUsers.concat(allTemplates);

  const mockedQuery: jest.MockedFunction<SearchEngine['query']> = jest.fn();

  const searchEngine: SearchEngine = {
    setTranslator: () => {
      throw new Error('Function not implemented. 1');
    },
    getIndexer: () => {
      throw new Error('Function not implemented.2');
    },
    query: mockedQuery,
  };

  const mockedAuthorize: jest.MockedFunction<
    PermissionAuthorizer['authorize']
  > = jest.fn();

  const permissionAuthorizer: PermissionAuthorizer = {
    authorize: mockedAuthorize,
  };

  const defaultTypes: Record<string, DocumentTypeInfo> = {
    [typeUsers]: {
      visibilityPermission: {
        name: 'search.users.read',
        attributes: { action: 'read' },
      },
    },
    [typeTemplates]: {
      visibilityPermission: {
        name: 'search.templates.read',
        attributes: { action: 'read' },
      },
    },
    [typeServices]: {
      visibilityPermission: {
        name: 'search.services.read',
        attributes: { action: 'read' },
      },
    },
    [typeGroups]: {
      visibilityPermission: {
        name: 'search.groups.read',
        attributes: { action: 'read' },
      },
    },
  };

  const authorizedSearchEngine = new AuthorizedSearchEngine(
    searchEngine,
    defaultTypes,
    permissionAuthorizer,
    new ConfigReader({}),
  );

  const options = { token: 'token' };

  const allowAll: PermissionAuthorizer['authorize'] = async queries => {
    return queries.map(() => ({
      result: AuthorizeResult.ALLOW,
    }));
  };

  beforeEach(() => {
    mockedQuery.mockReset();
    mockedAuthorize.mockClear();
  });

  it('should forward the parameters correctly', async () => {
    mockedQuery.mockImplementation(async () => ({ results }));
    mockedAuthorize.mockImplementation(allowAll);
    const filters = { just: 1, a: 2, filter: 3 };
    await authorizedSearchEngine.query(
      { term: 'term', filters, types: ['one', 'two'] },
      options,
    );
    expect(mockedQuery).toHaveBeenCalledWith(
      {
        term: 'term',
        types: ['one', 'two'],
        filters,
      },
      { token: 'token' },
    );
  });

  it('should forward the default types if none are passed', async () => {
    mockedQuery.mockImplementation(async () => ({ results }));
    mockedAuthorize.mockImplementation(allowAll);
    await authorizedSearchEngine.query({ term: '' }, options);
    expect(mockedQuery).toHaveBeenCalledWith(
      { term: '', types: ['users', 'templates', 'services', 'groups'] },
      { token: 'token' },
    );
  });

  it('should return all the results if all queries are allowed', async () => {
    mockedQuery.mockImplementation(async () => ({ results }));
    mockedAuthorize.mockImplementation(allowAll);

    await expect(
      authorizedSearchEngine.query({ term: '' }, options),
    ).resolves.toEqual({ results });
    expect(mockedAuthorize).toHaveBeenCalledTimes(1);
  });

  it('should batch authorized requests', async () => {
    mockedQuery.mockImplementation(async () => ({ results }));
    mockedAuthorize.mockImplementation(allowAll);

    await authorizedSearchEngine.query(
      { term: '', types: [typeUsers, typeTemplates] },
      options,
    );
    expect(mockedQuery).toHaveBeenCalledWith(
      { term: '', types: ['users', 'templates'] },
      { token: 'token' },
    );
    expect(mockedAuthorize).toHaveBeenCalledTimes(1);
    expect(mockedAuthorize).toHaveBeenLastCalledWith(
      [
        { permission: defaultTypes[typeUsers].visibilityPermission },
        { permission: defaultTypes[typeTemplates].visibilityPermission },
      ],
      { token: 'token' },
    );
  });

  it('should skip sending request for types that are not allowed', async () => {
    mockedQuery.mockImplementation(async () => ({ results }));
    mockedAuthorize.mockImplementation(async queries => {
      return queries.map(query => {
        if (
          query.permission.name ===
          defaultTypes.users.visibilityPermission?.name
        ) {
          return {
            result: AuthorizeResult.DENY,
          };
        }
        return {
          result: AuthorizeResult.ALLOW,
        };
      });
    });

    await authorizedSearchEngine.query({ term: '' }, options);

    expect(mockedQuery).toHaveBeenCalledWith(
      { term: '', types: ['templates', 'services', 'groups'] },
      { token: 'token' },
    );

    expect(mockedAuthorize).toHaveBeenCalledTimes(1);
  });

  it('should perform result-by-result filtering', async () => {
    const usersWithAuth = generateSampleResults(typeUsers, true);
    const templatesWithAuth = generateSampleResults(typeTemplates, true);

    const resultsWithAuth = usersWithAuth.concat(templatesWithAuth);

    mockedQuery.mockImplementation(async () => ({
      results: resultsWithAuth,
    }));

    const userToBeReturned = 8;

    mockedAuthorize.mockImplementation(async queries =>
      queries.map(query => {
        if (
          query.permission.name ===
          defaultTypes.users.visibilityPermission?.name
        ) {
          if (query.resourceRef) {
            return {
              result: query.resourceRef.endsWith(userToBeReturned.toString())
                ? AuthorizeResult.ALLOW
                : AuthorizeResult.DENY,
            };
          }
          return {
            result: AuthorizeResult.CONDITIONAL,
          } as AuthorizeDecision;
        }

        return {
          result: AuthorizeResult.DENY,
        };
      }),
    );

    await expect(
      authorizedSearchEngine.query({ term: '' }, options),
    ).resolves.toEqual({ results: [usersWithAuth[userToBeReturned]] });

    expect(mockedQuery).toHaveBeenCalledWith(
      { term: '', types: ['users'] },
      { token: 'token' },
    );
  });

  it('should deduplicate authorization queries when resourceRefs match', async () => {
    const searchResults = [
      {
        type: 'templates',
        document: {
          title: `doc_0_a`,
          authorization: { resourceRef: `template_doc_0` },
        } as IndexableDocument,
      },
      {
        type: 'templates',
        document: {
          title: `doc_0_b`,
          authorization: { resourceRef: `template_doc_0` },
        } as IndexableDocument,
      },
    ];

    mockedQuery.mockImplementation(async () => ({
      results: searchResults,
    }));

    mockedAuthorize.mockImplementation(async queries =>
      queries.map(query => {
        if (query.resourceRef) {
          return {
            result: AuthorizeResult.ALLOW,
          };
        }

        return {
          result: AuthorizeResult.CONDITIONAL,
        } as AuthorizeDecision;
      }),
    );

    await expect(
      authorizedSearchEngine.query({ term: '', types: ['templates'] }, options),
    ).resolves.toEqual({ results: searchResults });

    expect(mockedAuthorize).toHaveBeenCalledTimes(2);
    expect(mockedAuthorize).toHaveBeenNthCalledWith(
      1,
      [
        {
          permission: expect.objectContaining({
            name: 'search.templates.read',
          }),
        },
      ],
      { token: 'token' },
    );
    expect(mockedAuthorize).toHaveBeenNthCalledWith(
      2,
      [
        {
          permission: expect.objectContaining({
            name: 'search.templates.read',
          }),
          resourceRef: 'template_doc_0',
        },
      ],
      { token: 'token' },
    );
  });

  it('should perform search until the target number of results is reached', async () => {
    mockedAuthorize.mockImplementation(async queries =>
      queries.map(query => {
        if (query.resourceRef) {
          return {
            result: AuthorizeResult.ALLOW,
          };
        }
        return { result: AuthorizeResult.CONDITIONAL } as AuthorizeDecision;
      }),
    );

    const usersWithAuth = generateSampleResults(typeUsers, true);
    const templatesWithAuth = generateSampleResults(typeTemplates, true);
    const servicesWithAuth = generateSampleResults(typeServices, true);

    const allDocuments = [
      ...usersWithAuth,
      ...templatesWithAuth,
      ...servicesWithAuth,
    ];

    mockedQuery
      .mockImplementationOnce(async () => ({
        results: allDocuments.slice(0, 10),
        nextPageCursor: encodePageCursor({ page: 1 }),
      }))
      .mockImplementationOnce(async () => ({
        results: allDocuments.slice(10, 20),
        nextPageCursor: encodePageCursor({ page: 2 }),
      }))
      .mockImplementationOnce(async () => ({
        results: allDocuments.slice(20, 30),
      }));

    const result = await authorizedSearchEngine.query(
      { term: '', types: ['users', 'templates', 'services'] },
      options,
    );

    expect(mockedQuery).toHaveBeenCalledTimes(3);
    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,
      { term: '', types: ['users', 'templates', 'services'] },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,
      {
        term: '',
        types: ['users', 'templates', 'services'],
        pageCursor: 'MQ==',
      },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      3,
      {
        term: '',
        types: ['users', 'templates', 'services'],
        pageCursor: 'Mg==',
      },
      { token: 'token' },
    );

    const expectedResult = allDocuments.slice(0, 25);

    const expectedFirstRequestCursor = 'MQ==';
    expect(result).toEqual({
      results: expectedResult,
      nextPageCursor: expectedFirstRequestCursor,
    });
  });

  it('should perform search until the target number of results is reached, excluding unauthorized results', async () => {
    mockedAuthorize.mockImplementation(async queries =>
      queries.map(query => {
        if (query.resourceRef) {
          return {
            result:
              query.permission.name === 'search.services.read'
                ? AuthorizeResult.DENY
                : AuthorizeResult.ALLOW,
          };
        }
        return { result: AuthorizeResult.CONDITIONAL } as AuthorizeDecision;
      }),
    );

    const usersWithAuth = generateSampleResults(typeUsers, true);
    const templatesWithAuth = generateSampleResults(typeTemplates, true);
    const servicesWithAuth = generateSampleResults(typeServices, true);
    const groupsWithAuth = generateSampleResults(typeGroups, true);

    const allDocuments = [
      ...usersWithAuth,
      ...templatesWithAuth,
      ...servicesWithAuth,
      ...groupsWithAuth,
    ].sort(() => Math.floor(Math.random() * 3 - 1));

    mockedQuery
      .mockImplementationOnce(async () => ({
        results: allDocuments.slice(0, 10),
        nextPageCursor: encodePageCursor({ page: 1 }),
      }))
      .mockImplementationOnce(async () => ({
        results: allDocuments.slice(10, 20),
        nextPageCursor: encodePageCursor({ page: 2 }),
      }))
      .mockImplementationOnce(async () => ({
        results: allDocuments.slice(20, 30),
        nextPageCursor: encodePageCursor({ page: 3 }),
      }))
      .mockImplementationOnce(async () => ({
        results: allDocuments.slice(30, 40),
      }));

    const result = await authorizedSearchEngine.query({ term: '' }, options);

    // check if a fourth request is needed for retrieving all results
    const fourthRequestNeeded =
      allDocuments.slice(0, 30).filter(d => d.type !== typeServices).length <
      25;

    expect(mockedQuery).toHaveBeenCalledTimes(fourthRequestNeeded ? 4 : 3);
    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,
      { term: '', types: ['users', 'templates', 'services', 'groups'] },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,
      {
        term: '',
        types: ['users', 'templates', 'services', 'groups'],
        pageCursor: 'MQ==',
      },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      3,
      {
        term: '',
        types: ['users', 'templates', 'services', 'groups'],
        pageCursor: 'Mg==',
      },
      { token: 'token' },
    );

    const expectedResult = allDocuments
      .filter(d => d.type !== typeServices)
      .slice(0, 25);

    const expectedFirstRequestCursor = 'MQ==';
    expect(result).toEqual({
      results: expectedResult,
      nextPageCursor: expectedFirstRequestCursor,
    });
  });

  it('should discard results until the target cursor is reached', async () => {
    mockedAuthorize.mockImplementation(async queries =>
      queries.map(query => {
        if (query.resourceRef) {
          return { result: AuthorizeResult.ALLOW };
        }
        return { result: AuthorizeResult.CONDITIONAL } as AuthorizeDecision;
      }),
    );

    const usersWithAuth = generateSampleResults(typeUsers, true);
    const templatesWithAuth = generateSampleResults(typeTemplates, true);
    const servicesWithAuth = generateSampleResults(typeServices, true);

    mockedQuery
      .mockImplementationOnce(async () => ({
        results: usersWithAuth,
        nextPageCursor: encodePageCursor({ page: 1 }),
      }))
      .mockImplementationOnce(async () => ({
        results: templatesWithAuth,
        nextPageCursor: encodePageCursor({ page: 2 }),
      }))
      .mockImplementationOnce(async () => ({
        results: servicesWithAuth,
      }));

    const startingFromCursor = encodePageCursor({ page: 1 });

    const result = await authorizedSearchEngine.query(
      {
        term: '',
        pageCursor: startingFromCursor,
        types: ['users', 'templates', 'services'],
      },
      options,
    );
    expect(mockedQuery).toHaveBeenCalledTimes(3);
    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,
      { term: '', types: ['users', 'templates', 'services'] },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,
      {
        term: '',
        types: ['users', 'templates', 'services'],
        pageCursor: 'MQ==',
      },
      { token: 'token' },
    );
    expect(mockedQuery).toHaveBeenNthCalledWith(
      3,
      {
        term: '',
        types: ['users', 'templates', 'services'],
        pageCursor: 'Mg==',
      },
      { token: 'token' },
    );

    expect(result).toEqual({
      results: servicesWithAuth.slice(5),
      previousPageCursor: encodePageCursor({ page: 0 }),
    });
  });
});

describe('decodePageCursor', () => {
  it('should correctly decode the cursor', () => {
    expect(decodePageCursor()).toEqual({ page: 0 });
    expect(decodePageCursor(encodePageCursor({ page: 1 }))).toEqual({
      page: 1,
    });
    expect(decodePageCursor('Mg==')).toEqual({
      page: 2,
    });
    expect(decodePageCursor(encodePageCursor({ page: 0 }))).toEqual({
      page: 0,
    });
    expect(decodePageCursor(encodePageCursor({ page: 100 }))).toEqual({
      page: 100,
    });
  });

  it('should throw an error if the cursor is not valid', () => {
    expect(() => decodePageCursor(encodePageCursor({ page: -100 }))).toThrow();
    expect(() => decodePageCursor('something')).toThrow();
  });
});
