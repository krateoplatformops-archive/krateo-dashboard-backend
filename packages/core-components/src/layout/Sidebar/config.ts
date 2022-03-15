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

import { createContext, Dispatch, SetStateAction } from 'react';

const drawerWidthClosed = 72;
const iconPadding = 24;
const userBadgePadding = 18;

export const sidebarConfig = {
  drawerWidthClosed,
  drawerWidthOpen: 224,
  // As per NN/g's guidance on timing for exposing hidden content
  // See https://www.nngroup.com/articles/timing-exposing-content/
  defaultOpenDelayMs: 100,
  defaultCloseDelayMs: 0,
  defaultFadeDuration: 200,
  logoHeight: 32,
  iconContainerWidth: drawerWidthClosed,
  iconSize: drawerWidthClosed - iconPadding * 2,
  iconPadding,
  selectedIndicatorWidth: 3,
  userBadgePadding,
  userBadgeDiameter: drawerWidthClosed - userBadgePadding * 2,
  mobileSidebarHeight: 56,
};

export const submenuConfig = {
  drawerWidthClosed: 0,
  drawerWidthOpen: 202,
  defaultOpenDelayMs: sidebarConfig.defaultOpenDelayMs + 200,
};

export const SIDEBAR_INTRO_LOCAL_STORAGE =
  '@backstage/core/sidebar-intro-dismissed';

/**
 * Types for the `SidebarContext`
 */
export type SidebarContextType = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

/**
 * Context wether the `Sidebar` is open
 */
export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setOpen: () => {},
});

export type SidebarItemWithSubmenuContextType = {
  isHoveredOn: boolean;
  setIsHoveredOn: Dispatch<SetStateAction<boolean>>;
};

export const SidebarItemWithSubmenuContext =
  createContext<SidebarItemWithSubmenuContextType>({
    isHoveredOn: false,
    setIsHoveredOn: () => {},
  });
