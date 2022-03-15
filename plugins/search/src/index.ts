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

/**
 * The Backstage plugin that provides your backstage app with search
 *
 * @packageDocumentation
 */

export { searchApiRef } from './apis';
export type { SearchApi } from './apis';

export { Filters, FiltersButton } from './components/Filters';
export type { FiltersState } from './components/Filters';
export type { HomePageSearchBarProps } from './components/HomePageComponent';
export { SearchBar, SearchBarBase } from './components/SearchBar';
export type {
  SearchBarBaseProps,
  SearchBarProps,
} from './components/SearchBar';
export { SearchContextProvider, useSearch } from './components/SearchContext';
export type { SearchContextState } from './components/SearchContext';
export { SearchFilter, SearchFilterNext } from './components/SearchFilter';
export type {
  SearchAutocompleteFilterProps,
  SearchFilterComponentProps,
  SearchFilterWrapperProps,
} from './components/SearchFilter';
export { SearchModal, useSearchModal } from './components/SearchModal';
export type { SearchModalProps } from './components/SearchModal';
export { SearchPage as Router } from './components/SearchPage';
export { SearchResultPager } from './components/SearchResultPager';
export { SearchType } from './components/SearchType';
export type {
  SearchTypeAccordionProps,
  SearchTypeTabsProps,
  SearchTypeProps,
} from './components/SearchType';
export { SidebarSearch } from './components/SidebarSearch';
export type { SidebarSearchProps } from './components/SidebarSearch';
export type { SidebarSearchModalProps } from './components/SidebarSearchModal';

export {
  DefaultResultListItem,
  HomePageSearchBar,
  SearchBarNext,
  SearchPage,
  SearchPageNext,
  searchPlugin as plugin,
  searchPlugin,
  SearchResult,
  SidebarSearchModal,
} from './plugin';
