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

import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Modal,
  Tooltip,
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import { Alert } from '@material-ui/lab';
import React, { Fragment, useEffect, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { codeCoverageApiRef } from '../../api';
import { FileEntry } from '../../types';
import { FileContent } from './FileContent';
import {
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

type FileStructureObject = Record<string, any>;

type CoverageTableRow = {
  filename?: string;
  files: CoverageTableRow[];
  coverage: number;
  missing: number;
  tracked: number;
  path: string;
  tableData?: { id: number };
};

export const groupByPath = (files: CoverageTableRow[]) => {
  const acc: FileStructureObject = {};
  files.forEach(file => {
    const filename = file.filename;
    if (!file.filename) return;
    const pathArray = filename?.split('/').filter(el => el !== '');
    if (pathArray) {
      if (!acc.hasOwnProperty(pathArray[0])) {
        acc[pathArray[0]] = [];
      }
      acc[pathArray[0]].push(file);
    }
  });
  return acc;
};

const removeVisitedPathGroup = (
  files: CoverageTableRow[],
  pathGroup: string,
) => {
  return files.map(file => {
    return {
      ...file,
      filename: file.filename
        ? file.filename.substring(
            file.filename?.indexOf(pathGroup) + pathGroup.length + 1,
          )
        : file.filename,
    };
  });
};

export const buildFileStructure = (row: CoverageTableRow) => {
  const dataGroupedByPath: FileStructureObject = groupByPath(row.files);
  row.files = Object.keys(dataGroupedByPath).map(pathGroup => {
    return buildFileStructure({
      path: pathGroup,
      files: dataGroupedByPath.hasOwnProperty('files')
        ? removeVisitedPathGroup(dataGroupedByPath.files, pathGroup)
        : removeVisitedPathGroup(dataGroupedByPath[pathGroup], pathGroup),
      coverage:
        dataGroupedByPath[pathGroup].reduce(
          (acc: number, cur: CoverageTableRow) => acc + cur.coverage,
          0,
        ) / dataGroupedByPath[pathGroup].length,
      missing: dataGroupedByPath[pathGroup].reduce(
        (acc: number, cur: CoverageTableRow) => acc + cur.missing,
        0,
      ),
      tracked: dataGroupedByPath[pathGroup].reduce(
        (acc: number, cur: CoverageTableRow) => acc + cur.tracked,
        0,
      ),
    });
  });
  return row;
};

const formatInitialData = (value: any) => {
  return buildFileStructure({
    path: '',
    coverage: value.aggregate.line.percentage,
    missing: value.aggregate.line.missed,
    tracked: value.aggregate.line.available,
    files: value.files.map((fc: FileEntry) => {
      return {
        path: '',
        filename: fc.filename,
        coverage: Math.floor(
          (Object.values(fc.lineHits).filter((hits: number) => hits > 0)
            .length /
            Object.values(fc.lineHits).length) *
            100,
        ),
        missing: Object.values(fc.lineHits).filter(hits => !hits).length,
        tracked: Object.values(fc.lineHits).length,
      };
    }),
  });
};

export const getObjectsAtPath = (
  curData: CoverageTableRow | undefined,
  path: string[],
): CoverageTableRow[] | undefined => {
  let data = curData?.files;
  for (const fragment of path) {
    data = data?.find(d => d.path === fragment)?.files;
  }
  return data;
};

export const FileExplorer = () => {
  const { entity } = useEntity();
  const [curData, setCurData] = useState<CoverageTableRow | undefined>();
  const [tableData, setTableData] = useState<CoverageTableRow[] | undefined>();
  const [curPath, setCurPath] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [curFile, setCurFile] = useState('');
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const { loading, error, value } = useAsync(
    async () =>
      await codeCoverageApi.getCoverageForEntity({
        kind: entity.kind,
        namespace: entity.metadata.namespace || 'default',
        name: entity.metadata.name,
      }),
  );

  useEffect(() => {
    if (!value) return;
    const data = formatInitialData(value);
    setCurData(data);
    if (data.files) setTableData(data.files);
  }, [value]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  if (!value) {
    return (
      <Alert severity="warning">No code coverage found for ${entity}</Alert>
    );
  }

  const moveDownIntoPath = (path: string) => {
    const nextPathData = tableData!.find(
      (d: CoverageTableRow) => d.path === path,
    );
    if (nextPathData && nextPathData.files) {
      setTableData(nextPathData.files);
    }
  };

  const moveUpIntoPath = (idx: number) => {
    const path = curPath.split('/').slice(0, idx + 1);
    setCurPath(path.join('/'));
    setTableData(getObjectsAtPath(curData, path.slice(1)));
  };

  const columns: TableColumn<CoverageTableRow>[] = [
    {
      title: 'Path',
      type: 'string',
      field: 'path',
      render: (row: CoverageTableRow) => {
        if (row.files?.length) {
          return (
            <div
              role="button"
              tabIndex={row.tableData!.id}
              style={{ color: 'lightblue', cursor: 'pointer' }}
              onKeyDown={() => {
                setCurPath(`${curPath}/${row.path}`);
                moveDownIntoPath(row.path);
              }}
              onClick={() => {
                setCurPath(`${curPath}/${row.path}`);
                moveDownIntoPath(row.path);
              }}
            >
              {row.path}
            </div>
          );
        }

        return (
          <Box display="flex" alignItems="center">
            {row.path}
            <Tooltip title="View file content">
              <DescriptionIcon
                fontSize="small"
                style={{ color: 'lightblue', cursor: 'pointer' }}
                onClick={() => {
                  setCurFile(`${curPath.slice(1)}/${row.path}`);
                  setModalOpen(true);
                }}
              />
            </Tooltip>
          </Box>
        );
      },
    },
    {
      title: 'Coverage',
      type: 'numeric',
      field: 'coverage',
      render: (row: CoverageTableRow) => `${row.coverage.toFixed(2)}%`,
    },
    {
      title: 'Missing lines',
      type: 'numeric',
      field: 'missing',
    },
    {
      title: 'Tracked lines',
      type: 'numeric',
      field: 'tracked',
    },
  ];

  const pathArray = curPath.split('/');
  const lastPathElementIndex = pathArray.length - 1;
  const fileCoverage = value.files.find((f: FileEntry) =>
    f.filename.endsWith(curFile),
  );

  if (!fileCoverage) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Explore Files" />
      <CardContent>
        <Box mb={2} display="flex">
          {pathArray.map((pathElement, idx) => (
            <Fragment key={pathElement || 'root'}>
              <div
                role="button"
                tabIndex={idx}
                style={{
                  color: `${idx !== lastPathElementIndex && 'lightblue'}`,
                  cursor: `${idx !== lastPathElementIndex && 'pointer'}`,
                }}
                onKeyDown={() => moveUpIntoPath(idx)}
                onClick={() => moveUpIntoPath(idx)}
              >
                {pathElement || 'root'}
              </div>
              <div>{'\u00A0/\u00A0'}</div>
            </Fragment>
          ))}
        </Box>
        <Table
          emptyContent={<>No files found</>}
          data={tableData || []}
          columns={columns}
        />
        <Modal
          open={modalOpen}
          onClick={event => event.stopPropagation()}
          onClose={() => setModalOpen(false)}
          style={{ overflow: 'scroll' }}
        >
          <FileContent filename={curFile} coverage={fileCoverage} />
        </Modal>
      </CardContent>
    </Card>
  );
};
