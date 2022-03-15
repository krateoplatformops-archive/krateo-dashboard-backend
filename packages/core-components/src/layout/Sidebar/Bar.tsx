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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import classnames from 'classnames';

import React, { useState, useContext, useRef } from 'react';
import Button from '@material-ui/core/Button';

import { sidebarConfig, SidebarContext } from './config';
import { BackstageTheme } from '@backstage/theme';
import { SidebarPinStateContext, useContent } from './Page';
import { MobileSidebar } from './MobileSidebar';

/** @public */
export type SidebarClassKey = 'drawer' | 'drawerOpen';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    drawer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'flex-start',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: theme.zIndex.appBar,
      background: theme.palette.navigation.background,
      overflowX: 'hidden',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      width: sidebarConfig.drawerWidthClosed,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shortest,
      }),
      '& > *': {
        flexShrink: 0,
      },
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    drawerOpen: {
      width: sidebarConfig.drawerWidthOpen,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    },
    visuallyHidden: {
      top: 0,
      position: 'absolute',
      zIndex: 1000,
      transform: 'translateY(-200%)',
      '&:focus': {
        transform: 'translateY(5px)',
      },
    },
  }),
  { name: 'BackstageSidebar' },
);

enum State {
  Closed,
  Idle,
  Open,
}

/** @public */
export type SidebarProps = {
  openDelayMs?: number;
  closeDelayMs?: number;
  disableExpandOnHover?: boolean;
  children?: React.ReactNode;
};

/**
 * Places the Sidebar & wraps the children providing context weather the `Sidebar` is open or not.
 *
 * Handles & delays hover events for expanding the `Sidebar`
 *
 * @param props `disableExpandOnHover` disables the default hover behaviour;
 * `openDelayMs` & `closeDelayMs` set delay until sidebar will open/close on hover
 * @returns
 * @internal
 */
const DesktopSidebar = (props: SidebarProps) => {
  const {
    openDelayMs = sidebarConfig.defaultOpenDelayMs,
    closeDelayMs = sidebarConfig.defaultCloseDelayMs,
    disableExpandOnHover,
    children,
  } = props;
  const classes = useStyles();
  const isSmallScreen = useMediaQuery<BackstageTheme>(
    theme => theme.breakpoints.down('md'),
    { noSsr: true },
  );
  const [state, setState] = useState(State.Closed);
  const hoverTimerRef = useRef<number>();
  const { isPinned, toggleSidebarPinState } = useContext(
    SidebarPinStateContext,
  );

  const handleOpen = () => {
    if (isPinned || disableExpandOnHover) {
      return;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = undefined;
    }
    if (state !== State.Open && !isSmallScreen) {
      hoverTimerRef.current = window.setTimeout(() => {
        hoverTimerRef.current = undefined;
        setState(State.Open);
      }, openDelayMs);

      setState(State.Idle);
    }
  };

  const handleClose = () => {
    if (isPinned || disableExpandOnHover) {
      return;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = undefined;
    }
    if (state === State.Idle) {
      setState(State.Closed);
    } else if (state === State.Open) {
      hoverTimerRef.current = window.setTimeout(() => {
        hoverTimerRef.current = undefined;
        setState(State.Closed);
      }, closeDelayMs);
    }
  };

  const isOpen = (state === State.Open && !isSmallScreen) || isPinned;

  /**
   * Close/Open Sidebar directily without delays. Also toggles `SidebarPinState` to avoid hidden content behind Sidebar.
   */
  const setOpen = (open: boolean) => {
    if (open) {
      setState(State.Open);
      toggleSidebarPinState();
    } else {
      setState(State.Closed);
      toggleSidebarPinState();
    }
  };

  return (
    <div style={{}}>
      <A11ySkipSidebar />
      <SidebarContext.Provider
        value={{
          isOpen,
          setOpen,
        }}
      >
        <div
          className={classes.root}
          data-testid="sidebar-root"
          onMouseEnter={disableExpandOnHover ? () => {} : handleOpen}
          onFocus={disableExpandOnHover ? () => {} : handleOpen}
          onMouseLeave={disableExpandOnHover ? () => {} : handleClose}
          onBlur={disableExpandOnHover ? () => {} : handleClose}
        >
          <div
            className={classnames(classes.drawer, {
              [classes.drawerOpen]: isOpen,
            })}
          >
            {children}
          </div>
        </div>
      </SidebarContext.Provider>
    </div>
  );
};

/**
 * Passing children into the desktop or mobile sidebar depending on the context
 *
 * @public
 */
export const Sidebar = (props: SidebarProps) => {
  const { children, openDelayMs, closeDelayMs, disableExpandOnHover } = props;
  const { isMobile } = useContext(SidebarPinStateContext);

  return isMobile ? (
    <MobileSidebar>{children}</MobileSidebar>
  ) : (
    <DesktopSidebar
      openDelayMs={openDelayMs}
      closeDelayMs={closeDelayMs}
      disableExpandOnHover={disableExpandOnHover}
    >
      {children}
    </DesktopSidebar>
  );
};

function A11ySkipSidebar() {
  const { focusContent, contentRef } = useContent();
  const classes = useStyles();

  if (!contentRef?.current) {
    return null;
  }
  return (
    <Button
      onClick={focusContent}
      variant="contained"
      className={classnames(classes.visuallyHidden)}
    >
      Skip to content
    </Button>
  );
}
