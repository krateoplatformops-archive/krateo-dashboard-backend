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
export {
  Filters,
  FiltersButton,
  SearchBar,
  SearchContextProvider,
  SearchFilter,
  SearchFilterNext,
  SearchModal,
  SearchPage as Router,
  SearchResultPager,
  SearchType,
  SidebarSearch,
  useSearch,
} from './components';
export type { SearchModalProps } from './components';
export type { FiltersState } from './components';
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
