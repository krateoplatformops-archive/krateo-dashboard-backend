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

import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';
import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import { useEntityListProvider } from '../../hooks/useEntityListProvider';
import { EntityTextFilter } from '../../filters';

const useStyles = makeStyles(
  _theme => ({
    searchToolbar: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    input: {},
  }),
  {
    name: 'CatalogReactEntitySearchBar',
  },
);

export const EntitySearchBar = () => {
  const classes = useStyles();

  const { filters, updateFilters } = useEntityListProvider();
  const [search, setSearch] = useState(filters.text?.value ?? '');

  useDebounce(
    () => {
      updateFilters({
        text: search.length ? new EntityTextFilter(search) : undefined,
      });
    },
    250,
    [search, updateFilters],
  );

  return (
    <Toolbar className={classes.searchToolbar}>
      <FormControl>
        <Input
          id="input-with-icon-adornment"
          className={classes.input}
          placeholder="Search"
          autoComplete="off"
          onChange={event => setSearch(event.target.value)}
          value={search}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={() => setSearch('')}
                edge="end"
                disabled={search.length === 0}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Toolbar>
  );
};
