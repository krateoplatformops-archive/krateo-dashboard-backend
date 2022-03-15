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

import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  Paper,
  useTheme,
} from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import { makeStyles } from '@material-ui/core/styles';
import { SearchBar } from '../SearchBar';
import { DefaultResultListItem } from '../DefaultResultListItem';
import { SearchResult } from '../SearchResult';
import { SearchContextProvider, useSearch } from '../SearchContext';
import { SearchResultPager } from '../SearchResultPager';
import { useRouteRef } from '@backstage/core-plugin-api';
import { Link, useContent } from '@backstage/core-components';
import { rootRouteRef } from '../../plugin';

export interface SearchModalProps {
  /**
   * If true, it renders the modal.
   */
  open?: boolean;
  /**
   * This is supposed to be used together with the open prop.
   * If `hidden` is true, it hides the modal.
   * If `open` is false, the value of `hidden` has no effect on the modal.
   * Use `open` for controlling whether the modal should be rendered or not.
   */
  hidden?: boolean;
  /**
   * a function invoked when a search item is pressed or when the dialog
   * should be closed.
   */
  toggleModal: () => void;
}

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: 30,
    display: 'flex',
    height: '2.4em',
  },
  input: {
    flex: 1,
  },
  // Reduces default height of the modal, keeping a gap of 128px between the top and bottom of the page.
  paperFullWidth: { height: 'calc(100% - 128px)' },
  dialogActionsContainer: { padding: theme.spacing(1, 3) },
  viewResultsLink: { verticalAlign: '0.5em' },
}));

export const Modal = ({ toggleModal }: SearchModalProps) => {
  const getSearchLink = useRouteRef(rootRouteRef);
  const classes = useStyles();

  const { term } = useSearch();
  const { focusContent } = useContent();
  const { transitions } = useTheme();

  const handleResultClick = () => {
    toggleModal();
    setTimeout(focusContent, transitions.duration.leavingScreen);
  };

  const handleKeyPress = () => {
    handleResultClick();
  };

  return (
    <>
      <DialogTitle>
        <Paper className={classes.container}>
          <SearchBar className={classes.input} />
        </Paper>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row-reverse"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Link
              onClick={() => {
                toggleModal();
                setTimeout(focusContent, transitions.duration.leavingScreen);
              }}
              to={`${getSearchLink()}?query=${term}`}
            >
              <span className={classes.viewResultsLink}>View Full Results</span>
              <LaunchIcon color="primary" />
            </Link>
          </Grid>
        </Grid>
        <Divider />
        <SearchResult>
          {({ results }) => (
            <List>
              {results.map(({ document }) => (
                <div
                  role="button"
                  tabIndex={0}
                  key={`${document.location}-btn`}
                  onClick={handleResultClick}
                  onKeyPress={handleKeyPress}
                >
                  <DefaultResultListItem
                    key={document.location}
                    result={document}
                  />
                </div>
              ))}
            </List>
          )}
        </SearchResult>
      </DialogContent>
      <DialogActions className={classes.dialogActionsContainer}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchResultPager />
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

export const SearchModal = ({
  open = true,
  hidden,
  toggleModal,
}: SearchModalProps) => {
  const classes = useStyles();

  return (
    <Dialog
      classes={{
        paperFullWidth: classes.paperFullWidth,
      }}
      onClose={toggleModal}
      aria-labelledby="search-modal-title"
      fullWidth
      maxWidth="lg"
      open={open}
      hidden={hidden}
    >
      {open && (
        <SearchContextProvider>
          <Modal toggleModal={toggleModal} />
        </SearchContextProvider>
      )}
    </Dialog>
  );
};
