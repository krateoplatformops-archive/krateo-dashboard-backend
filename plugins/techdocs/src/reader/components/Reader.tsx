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

import React, {
  PropsWithChildren,
  ComponentType,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, makeStyles, useTheme } from '@material-ui/core';

import { EntityName } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { BackstageTheme } from '@backstage/theme';

import { techdocsStorageApiRef } from '../../api';

import {
  addBaseUrl,
  addGitFeedbackLink,
  addLinkClickListener,
  injectCss,
  onCssReady,
  removeMkdocsHeader,
  rewriteDocLinks,
  sanitizeDOM,
  simplifyMkdocsFooter,
  scrollIntoAnchor,
  transform as transformer,
} from '../transformers';

import { TechDocsSearch } from './TechDocsSearch';
import { TechDocsStateIndicator } from './TechDocsStateIndicator';
import { useReaderState } from './useReaderState';

type Props = {
  entityRef: EntityName;
  withSearch?: boolean;
  onReady?: () => void;
};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  searchBar: {
    marginLeft: '20rem',
    maxWidth: 'calc(100% - 20rem * 2 - 3rem)',
    marginTop: theme.spacing(1),
    '@media screen and (max-width: 76.1875em)': {
      marginLeft: '10rem',
      maxWidth: 'calc(100% - 10rem)',
    },
  },
}));

type TechDocsReaderValue = ReturnType<typeof useReaderState>;

const TechDocsReaderContext = createContext<TechDocsReaderValue>(
  {} as TechDocsReaderValue,
);

const TechDocsReaderProvider = ({
  children,
  entityRef,
}: PropsWithChildren<{ entityRef: EntityName }>) => {
  const { '*': path } = useParams();
  const { kind, namespace, name } = entityRef;
  const value = useReaderState(kind, namespace, name, path);
  return (
    <TechDocsReaderContext.Provider value={value}>
      {children}
    </TechDocsReaderContext.Provider>
  );
};

/**
 * Note: this HOC is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this HOC will continue to be
 * exported by the package in the future!
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */
export const withTechDocsReaderProvider =
  <T extends {}>(Component: ComponentType<T>, entityRef: EntityName) =>
  (props: T) =>
    (
      <TechDocsReaderProvider entityRef={entityRef}>
        <Component {...props} />
      </TechDocsReaderProvider>
    );

/**
 * Note: this hook is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this hook will continue to be
 * exported by the package in the future!
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */
export const useTechDocsReader = () => useContext(TechDocsReaderContext);

/**
 * Hook that encapsulates the behavior of getting raw HTML and applying
 * transforms to it in order to make it function at a basic level in the
 * Backstage UI.
 *
 * Note: this hook is currently being exported so that we can rapidly iterate
 * on alternative <Reader /> implementations that extend core functionality.
 * There is no guarantee that this hook will continue to be exported by the
 * package in the future!
 *
 * todo: Make public or stop exporting (see others: "altReaderExperiments")
 * @internal
 */
export const useTechDocsReaderDom = (entityRef: EntityName): Element | null => {
  const navigate = useNavigate();
  const theme = useTheme<BackstageTheme>();
  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const { namespace = '', kind = '', name = '' } = entityRef;
  const { state, path, content: rawPage } = useTechDocsReader();

  const [sidebars, setSidebars] = useState<HTMLElement[]>();
  const [dom, setDom] = useState<HTMLElement | null>(null);

  const updateSidebarPosition = useCallback(() => {
    if (!dom || !sidebars) return;
    // set sidebar height so they don't initially render in wrong position
    const mdTabs = dom.querySelector('.md-container > .md-tabs');
    sidebars.forEach(sidebar => {
      const newTop = Math.max(dom.getBoundingClientRect().top, 0);
      sidebar.style.top = mdTabs
        ? `${newTop + mdTabs.getBoundingClientRect().height}px`
        : `${newTop}px`;
    });
  }, [dom, sidebars]);

  useEffect(() => {
    updateSidebarPosition();
    window.addEventListener('scroll', updateSidebarPosition, true);
    window.addEventListener('resize', updateSidebarPosition);
    return () => {
      window.removeEventListener('scroll', updateSidebarPosition, true);
      window.removeEventListener('resize', updateSidebarPosition);
    };
    // an update to "state" might lead to an updated UI so we include it as a trigger
  }, [updateSidebarPosition, state]);

  // a function that performs transformations that are executed prior to adding it to the DOM
  const preRender = useCallback(
    (rawContent: string, contentPath: string) =>
      transformer(rawContent, [
        sanitizeDOM(),
        addBaseUrl({
          techdocsStorageApi,
          entityId: {
            kind,
            name,
            namespace,
          },
          path: contentPath,
        }),
        rewriteDocLinks(),
        removeMkdocsHeader(),
        simplifyMkdocsFooter(),
        addGitFeedbackLink(scmIntegrationsApi),
        injectCss({
          css: `
          body {
            font-family: ${theme.typography.fontFamily};
            --md-text-color: ${theme.palette.text.primary};
            --md-text-link-color: ${theme.palette.primary.main};

            --md-code-fg-color: ${theme.palette.text.primary};
            --md-code-bg-color: ${theme.palette.background.paper};
          }
          .md-main__inner { margin-top: 0; }
          .md-sidebar {  position: fixed; bottom: 100px; width: 20rem; }
          .md-sidebar--secondary { right: 2rem; }
          .md-content { margin-bottom: 50px }
          .md-footer { position: fixed; bottom: 0px; width: 100vw; }
          .md-footer-nav__link { width: 20rem;}
          .md-content { margin-left: 20rem; max-width: calc(100% - 20rem * 2 - 3rem); }
          .md-typeset { font-size: 1rem; }
          .md-typeset h1, .md-typeset h2, .md-typeset h3 { font-weight: bold; }
          .md-nav { font-size: 1rem; }
          .md-grid { max-width: 90vw; margin: 0 }
          .md-typeset table:not([class]) {
            font-size: 1rem;
            border: 1px solid ${theme.palette.text.primary};
            border-bottom: none;
            border-collapse: collapse;
          }
          .md-typeset table:not([class]) td, .md-typeset table:not([class]) th {
            border-bottom: 1px solid ${theme.palette.text.primary};
          }
          .md-typeset table:not([class]) th { font-weight: bold; }
          .md-typeset .admonition, .md-typeset details {
            font-size: 1rem;
          }
          
          /* style the checkmarks of the task list */
          .md-typeset .task-list-control .task-list-indicator::before {
            background-color: ${theme.palette.action.disabledBackground};
          }
          .md-typeset .task-list-control [type="checkbox"]:checked + .task-list-indicator:before {
            background-color: ${theme.palette.success.main};
          }
          /**/

          @media screen and (max-width: 76.1875em) {
            .md-nav {
              background-color: ${theme.palette.background.default};
              transition: none !important
            }
            .md-sidebar--secondary { display: none; }
            .md-sidebar--primary { left: 72px; width: 10rem }
            .md-content { margin-left: 10rem; max-width: calc(100% - 10rem); }
            .md-content__inner { font-size: 0.9rem }
            .md-footer {
              position: static;
              margin-left: 10rem;
              width: calc(100% - 10rem);
            }
            .md-nav--primary .md-nav__title {
              white-space: normal;
              height: auto;
              line-height: 1rem;
              cursor: auto;
            }
            .md-nav--primary > .md-nav__title [for="none"] {
              padding-top: 0;
            }
          }
        `,
        }),
        injectCss({
          // Disable CSS animations on link colors as they lead to issues in dark
          // mode. The dark mode color theme is applied later and theirfore there
          // is always an animation from light to dark mode when navigation
          // between pages.
          css: `
            .md-nav__link, .md-typeset a, .md-typeset a::before, .md-typeset .headerlink {
              transition: none;
            }
          `,
        }),
        injectCss({
          // Properly style code blocks.
          css: `
            .md-typeset pre > code::-webkit-scrollbar-thumb {
              background-color: hsla(0, 0%, 0%, 0.32);
            }
            .md-typeset pre > code::-webkit-scrollbar-thumb:hover {
              background-color: hsla(0, 0%, 0%, 0.87);
            }
        `,
        }),
        injectCss({
          // Admonitions and others are using SVG masks to define icons. These
          // masks are defined as CSS variables.
          // As the MkDocs output is rendered in shadow DOM, the CSS variable
          // definitions on the root selector are not applied. Instead, the have
          // to be applied on :host.
          // As there is no way to transform the served main*.css yet (for
          // example in the backend), we have to copy from main*.css and modify
          // them.
          css: `
            :host {
              --md-admonition-icon--note: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/></svg>');
              --md-admonition-icon--abstract: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 5h16v2H4V5m0 4h16v2H4V9m0 4h16v2H4v-2m0 4h10v2H4v-2z"/></svg>');
              --md-admonition-icon--info: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z"/></svg>');
              --md-admonition-icon--tip: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.55 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66C13.3 7.26 13 4.85 13.91 3c-.91.23-1.75.75-2.45 1.32-2.54 2.08-3.54 5.75-2.34 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12a.83.83 0 01-.15-.17c-1.1-1.43-1.28-3.48-.53-5.12C5.89 10 5 12.3 5.14 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.32 1.5-6.6l-.13-.26c-.2-.46-.47-.87-.8-1.25l.05-.01m-3.1 6.3c-.28.24-.73.5-1.08.6-1.1.4-2.2-.16-2.87-.82 1.19-.28 1.89-1.16 2.09-2.05.17-.8-.14-1.46-.27-2.23-.12-.74-.1-1.37.18-2.06.17.38.37.76.6 1.06.76 1 1.95 1.44 2.2 2.8.04.14.06.28.06.43.03.82-.32 1.72-.92 2.27h.01z"/></svg>');
              --md-admonition-icon--success: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
              --md-admonition-icon--question: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.07 11.25l-.9.92C13.45 12.89 13 13.5 13 15h-2v-.5c0-1.11.45-2.11 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41a2 2 0 00-2-2 2 2 0 00-2 2H8a4 4 0 014-4 4 4 0 014 4 3.2 3.2 0 01-.93 2.25M13 19h-2v-2h2M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10c0-5.53-4.5-10-10-10z"/></svg>');
              --md-admonition-icon--warning: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 14h-2v-4h2m0 8h-2v-2h2M1 21h22L12 2 1 21z"/></svg>');
              --md-admonition-icon--failure: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12 6.47 2 12 2m3.59 5L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41 15.59 7z"/></svg>');
              --md-admonition-icon--danger: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.5 20l4.86-9.73H13V4l-5 9.73h3.5V20M12 2c2.75 0 5.1 1 7.05 2.95C21 6.9 22 9.25 22 12s-1 5.1-2.95 7.05C17.1 21 14.75 22 12 22s-5.1-1-7.05-2.95C3 17.1 2 14.75 2 12s1-5.1 2.95-7.05C6.9 3 9.25 2 12 2z"/></svg>');
              --md-admonition-icon--bug: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 12h-4v-2h4m0 6h-4v-2h4m6-6h-2.81a5.985 5.985 0 00-1.82-1.96L17 4.41 15.59 3l-2.17 2.17a6.002 6.002 0 00-2.83 0L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8z"/></svg>');
              --md-admonition-icon--example: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 13v-2h14v2H7m0 6v-2h14v2H7M7 7V5h14v2H7M3 8V5H2V4h2v4H3m-1 9v-1h3v4H2v-1h2v-.5H3v-1h1V17H2m2.25-7a.75.75 0 01.75.75c0 .2-.08.39-.21.52L3.12 13H5v1H2v-.92L4 11H2v-1h2.25z"/></svg>');
              --md-admonition-icon--quote: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3l-2 4z"/></svg>');
            }
            :host {
              --md-footnotes-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.42L5.83 13H21V7h-2z"/></svg>');
            }
            :host {
              --md-details-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/></svg>');
            }
            :host {
              --md-tasklist-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>');
              --md-tasklist-icon--checked: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
            }
        `,
        }),
      ]),
    [
      kind,
      name,
      namespace,
      scmIntegrationsApi,
      techdocsStorageApi,
      theme.palette.action.disabledBackground,
      theme.palette.background.default,
      theme.palette.background.paper,
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.text.primary,
      theme.typography.fontFamily,
    ],
  );

  // a function that performs transformations that are executed after adding it to the DOM
  const postRender = useCallback(
    async (transformedElement: Element) =>
      transformer(transformedElement, [
        scrollIntoAnchor(),
        addLinkClickListener({
          baseUrl: window.location.origin,
          onClick: (_: MouseEvent, url: string) => {
            const parsedUrl = new URL(url);
            // hash exists when anchor is clicked on secondary sidebar
            if (parsedUrl.hash) {
              navigate(`${parsedUrl.pathname}${parsedUrl.hash}`);
              // Scroll to hash if it's on the current page
              transformedElement
                ?.querySelector(`#${parsedUrl.hash.slice(1)}`)
                ?.scrollIntoView();
            } else {
              navigate(parsedUrl.pathname);
              // Scroll to top of reader if primary sidebar link is clicked
              transformedElement
                ?.querySelector('.md-content__inner')
                ?.scrollIntoView();
            }
          },
        }),
        onCssReady({
          docStorageUrl: await techdocsStorageApi.getApiOrigin(),
          onLoading: (renderedElement: Element) => {
            (renderedElement as HTMLElement).style.setProperty('opacity', '0');
          },
          onLoaded: (renderedElement: Element) => {
            (renderedElement as HTMLElement).style.removeProperty('opacity');
            // disable MkDocs drawer toggling ('for' attribute => checkbox mechanism)
            renderedElement
              .querySelector('.md-nav__title')
              ?.removeAttribute('for');
            setSidebars(
              Array.from(renderedElement.querySelectorAll('.md-sidebar')),
            );
          },
        }),
      ]),
    [navigate, techdocsStorageApi],
  );

  useEffect(() => {
    if (!rawPage) return () => {};

    // if false, there is already a newer execution of this effect
    let shouldReplaceContent = true;

    // Pre-render
    preRender(rawPage, path).then(async preTransformedDomElement => {
      if (!preTransformedDomElement?.innerHTML) {
        return; // An unexpected error occurred
      }

      // don't manipulate the shadow dom if this isn't the latest effect execution
      if (!shouldReplaceContent) {
        return;
      }

      // Scroll to top after render
      window.scroll({ top: 0 });

      // Post-render
      const postTransformedDomElement = await postRender(
        preTransformedDomElement,
      );
      setDom(postTransformedDomElement as HTMLElement);
    });

    // cancel this execution
    return () => {
      shouldReplaceContent = false;
    };
  }, [rawPage, path, preRender, postRender]);

  return dom;
};

const TheReader = ({
  entityRef,
  onReady = () => {},
  withSearch = true,
}: Props) => {
  const classes = useStyles();
  const dom = useTechDocsReaderDom(entityRef);
  const shadowDomRef = useRef<HTMLDivElement>(null);

  const onReadyRef = useRef<() => void>(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (!dom || !shadowDomRef.current) return;
    const shadowDiv = shadowDomRef.current;
    const shadowRoot =
      shadowDiv.shadowRoot || shadowDiv.attachShadow({ mode: 'open' });
    Array.from(shadowRoot.children).forEach(child =>
      shadowRoot.removeChild(child),
    );
    shadowRoot.appendChild(dom);
    onReadyRef.current();

    // this hook must ONLY be triggered by a changed dom
  }, [dom]);

  return (
    <>
      <TechDocsStateIndicator />
      {withSearch && shadowDomRef?.current?.shadowRoot?.innerHTML && (
        <Grid container className={classes.searchBar}>
          <TechDocsSearch entityId={entityRef} />
        </Grid>
      )}
      <div data-testid="techdocs-content-shadowroot" ref={shadowDomRef} />
    </>
  );
};

export const Reader = ({
  entityRef,
  onReady = () => {},
  withSearch = true,
}: Props) => (
  <TechDocsReaderProvider entityRef={entityRef}>
    <TheReader
      entityRef={entityRef}
      onReady={onReady}
      withSearch={withSearch}
    />
  </TechDocsReaderProvider>
);
