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

import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown, { Options } from 'react-markdown';
import gfm from 'remark-gfm';
import React from 'react';
import { BackstageTheme } from '@backstage/theme';
import { CodeSnippet } from '../CodeSnippet';

export type MarkdownContentClassKey = 'markdown';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    markdown: {
      '& table': {
        borderCollapse: 'collapse',
        border: `1px solid ${theme.palette.border}`,
      },
      '& th, & td': {
        border: `1px solid ${theme.palette.border}`,
        padding: theme.spacing(1),
      },
      '& td': {
        wordBreak: 'break-word',
        overflow: 'hidden',
        verticalAlign: 'middle',
        lineHeight: '1',
        margin: 0,
        padding: theme.spacing(3, 2, 3, 2.5),
        borderBottom: 0,
      },
      '& th': {
        backgroundColor: theme.palette.background.paper,
      },
      '& tr': {
        backgroundColor: theme.palette.background.paper,
      },
      '& tr:nth-child(odd)': {
        backgroundColor: theme.palette.background.default,
      },

      '& a': {
        color: theme.palette.link,
      },
      '& img': {
        maxWidth: '100%',
      },
    },
  }),
  { name: 'BackstageMarkdownContent' },
);

type Props = {
  content: string;
  dialect?: 'gfm' | 'common-mark';
  linkTarget?: Options['linkTarget'];
};

const components: Options['components'] = {
  code: ({ inline, className, children, ...props }) => {
    const text = String(children).replace(/\n+$/, '');
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodeSnippet language={match[1]} text={text} />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

/**
 * MarkdownContent
 * --
 * Renders markdown with the default dialect [gfm - GitHub flavored Markdown](https://github.github.com/gfm/) to backstage theme styled HTML.
 * If you just want to render to plain [CommonMark](https://commonmark.org/), set the dialect to `'common-mark'`
 */
export function MarkdownContent(props: Props) {
  const { content, dialect = 'gfm', linkTarget } = props;
  const classes = useStyles();
  return (
    <ReactMarkdown
      remarkPlugins={dialect === 'gfm' ? [gfm] : []}
      className={classes.markdown}
      children={content}
      components={components}
      linkTarget={linkTarget}
    />
  );
}
