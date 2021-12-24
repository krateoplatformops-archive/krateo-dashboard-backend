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

import React, { ReactNode } from 'react';
import { IndexableDocument } from '@backstage/search-common';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';

type Props = {
  icon?: ReactNode;
  secondaryAction?: ReactNode;
  result: IndexableDocument;
};

export const DefaultResultListItem = ({
  result,
  icon,
  secondaryAction,
}: Props) => {
  return (
    <Link to={result.location}>
      <ListItem alignItems="center">
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={result.text}
        />
        {secondaryAction && <Box alignItems="flex-end">{secondaryAction}</Box>}
      </ListItem>
      <Divider />
    </Link>
  );
};
