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

export * from './Reader';
export * from './TechDocsPage';
export * from './TechDocsPageHeader';
export * from './TechDocsStateIndicator';

/**
 * Note: this component is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this component will continue to be
 * exported by the package in the future!
 *
 * Why is this comment here instead of above the component itself? It's a
 * workaround for some kind of bug in @microsoft/api-extractor.
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */
export { TechDocsSearch } from './TechDocsSearch';
