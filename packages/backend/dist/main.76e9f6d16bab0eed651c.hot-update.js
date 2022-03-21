"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "main";
exports.ids = null;
exports.modules = {

/***/ "../catalog-model/src/entity/ref.ts":
/*!******************************************!*\
  !*** ../catalog-model/src/entity/ref.ts ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getEntityName\": () => (/* binding */ getEntityName),\n/* harmony export */   \"getCompoundEntityRef\": () => (/* binding */ getCompoundEntityRef),\n/* harmony export */   \"parseEntityRef\": () => (/* binding */ parseEntityRef),\n/* harmony export */   \"stringifyEntityRef\": () => (/* binding */ stringifyEntityRef)\n/* harmony export */ });\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"../catalog-model/src/entity/constants.ts\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () { var enterModule = (__webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule); enterModule && enterModule(module); })();/*\n * Copyright 2020 The Backstage Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n\nfunction parseRefString(ref)\n\n\n\n {\n  let colonI = ref.indexOf(':');\n  const slashI = ref.indexOf('/');\n\n  // If the / is ahead of the :, treat the rest as the name\n  if (slashI !== -1 && slashI < colonI) {\n    colonI = -1;\n  }\n\n  const kind = colonI === -1 ? undefined : ref.slice(0, colonI);\n  const namespace = slashI === -1 ? undefined : ref.slice(colonI + 1, slashI);\n  const name = ref.slice(Math.max(colonI + 1, slashI + 1));\n\n  if (kind === '' || namespace === '' || name === '') {\n    throw new TypeError(\n      `Entity reference \"${ref}\" was not on the form [<kind>:][<namespace>/]<name>`,\n    );\n  }\n\n  return { kind, namespace, name };\n}\n\n/**\n * Extracts the kind, namespace and name that form the compound entity ref\n * triplet of the given entity.\n *\n * @public\n * @deprecated Use getCompoundEntityRef instead\n * @param entity - An entity\n * @returns The compound entity ref\n */\nconst getEntityName = getCompoundEntityRef;\n\n/**\n * Extracts the kind, namespace and name that form the compound entity ref\n * triplet of the given entity.\n *\n * @public\n * @param entity - An entity\n * @returns The compound entity ref\n */\nfunction getCompoundEntityRef(entity) {\n  return {\n    kind: entity.kind,\n    namespace: entity.metadata.namespace || _constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_NAMESPACE,\n    name: entity.metadata.name,\n  };\n}\n\n/**\n * Parses an entity reference, either on string or compound form, and returns\n * a structure with a name, and optional kind and namespace.\n *\n * @remarks\n *\n * The context object can contain default values for the kind and namespace,\n * that will be used if the input reference did not specify any.\n *\n * @public\n * @param ref - The reference to parse\n * @param context - The context of defaults that the parsing happens within\n * @returns The compound form of the reference\n */\nfunction parseEntityRef(\n  ref,\n  context\n\n\n\n\n,\n) {\n  // console.log('#######################');\n  // console.log(ref);\n  // console.log('#######################');\n  if (!ref) {\n    throw new Error(`Entity reference must not be empty (got \"${ref}\")`);\n  }\n\n  const defaultKind = context?.defaultKind;\n  const defaultNamespace = context?.defaultNamespace || _constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_NAMESPACE;\n\n  let kind;\n  let namespace;\n  let name;\n\n  if (typeof ref === 'string') {\n    const parsed = parseRefString(ref);\n    kind = parsed.kind ?? defaultKind;\n    namespace = parsed.namespace ?? defaultNamespace;\n    name = parsed.name;\n  } else {\n    kind = ref.kind ?? defaultKind;\n    namespace = ref.namespace ?? defaultNamespace;\n    name = ref.name;\n  }\n\n  if (!kind) {\n    const textual = JSON.stringify(ref);\n    throw new Error(\n      `Entity reference ${textual} had missing or empty kind (e.g. did not start with \"component:\" or similar)`,\n    );\n  } else if (!namespace) {\n    const textual = JSON.stringify(ref);\n    throw new Error(\n      `Entity reference ${textual} had missing or empty namespace`,\n    );\n  } else if (!name) {\n    const textual = JSON.stringify(ref);\n    throw new Error(`Entity reference ${textual} had missing or empty name`);\n  }\n\n  return { kind, namespace, name };\n}\n\n/**\n * Takes an entity or entity name/reference, and returns the string form of an\n * entity ref.\n *\n * @remarks\n *\n * This function creates a canonical and unique reference to the entity, converting\n * all parts of the name to lowercase and inserts the default namespace if needed.\n * It is typically not the best way to represent the entity reference to the user.\n *\n * @public\n * @param ref - The reference to serialize\n * @returns The same reference on either string or compound form\n */\nfunction stringifyEntityRef(\n  ref,\n) {\n  let kind;\n  let namespace;\n  let name;\n\n  if ('metadata' in ref) {\n    kind = ref.kind;\n    namespace = ref.metadata.namespace ?? _constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_NAMESPACE;\n    name = ref.metadata.name;\n  } else {\n    kind = ref.kind;\n    namespace = ref.namespace ?? _constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_NAMESPACE;\n    name = ref.name;\n  }\n\n  return `${kind.toLocaleLowerCase('en-US')}:${namespace.toLocaleLowerCase(\n    'en-US',\n  )}/${name.toLocaleLowerCase('en-US')}`;\n}\n\n;(function () {\n  var reactHotLoader = (__webpack_require__(/*! react-hot-loader */ \"react-hot-loader\")[\"default\"]);\n  var leaveModule = (__webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule);\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(parseRefString, \"parseRefString\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/catalog-model/src/entity/ref.ts\");\n  reactHotLoader.register(getEntityName, \"getEntityName\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/catalog-model/src/entity/ref.ts\");\n  reactHotLoader.register(getCompoundEntityRef, \"getCompoundEntityRef\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/catalog-model/src/entity/ref.ts\");\n  reactHotLoader.register(parseEntityRef, \"parseEntityRef\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/catalog-model/src/entity/ref.ts\");\n  reactHotLoader.register(stringifyEntityRef, \"stringifyEntityRef\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/catalog-model/src/entity/ref.ts\");\n  leaveModule(module);\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vY2F0YWxvZy1tb2RlbC9zcmMvZW50aXR5L3JlZi50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJmaWxlOi8vLy9Vc2Vycy9tYXVyb3NhbGEvRGV2L2dpdGh1Yi9rcmF0ZW9wbGF0Zm9ybW9wcy9rcmF0ZW8tZGFzaGJvYXJkLWJhY2tlbmQvcGFja2FnZXMvY2F0YWxvZy1tb2RlbC9zcmMvZW50aXR5L3JlZi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkgeyB2YXIgZW50ZXJNb2R1bGUgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykuZW50ZXJNb2R1bGU7IGVudGVyTW9kdWxlICYmIGVudGVyTW9kdWxlKG1vZHVsZSk7IH0pKCk7LypcbiAqIENvcHlyaWdodCAyMDIwIFRoZSBCYWNrc3RhZ2UgQXV0aG9yc1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBERUZBVUxUX05BTUVTUEFDRSB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuXG5cbmZ1bmN0aW9uIHBhcnNlUmVmU3RyaW5nKHJlZilcblxuXG5cbiB7XG4gIGxldCBjb2xvbkkgPSByZWYuaW5kZXhPZignOicpO1xuICBjb25zdCBzbGFzaEkgPSByZWYuaW5kZXhPZignLycpO1xuXG4gIC8vIElmIHRoZSAvIGlzIGFoZWFkIG9mIHRoZSA6LCB0cmVhdCB0aGUgcmVzdCBhcyB0aGUgbmFtZVxuICBpZiAoc2xhc2hJICE9PSAtMSAmJiBzbGFzaEkgPCBjb2xvbkkpIHtcbiAgICBjb2xvbkkgPSAtMTtcbiAgfVxuXG4gIGNvbnN0IGtpbmQgPSBjb2xvbkkgPT09IC0xID8gdW5kZWZpbmVkIDogcmVmLnNsaWNlKDAsIGNvbG9uSSk7XG4gIGNvbnN0IG5hbWVzcGFjZSA9IHNsYXNoSSA9PT0gLTEgPyB1bmRlZmluZWQgOiByZWYuc2xpY2UoY29sb25JICsgMSwgc2xhc2hJKTtcbiAgY29uc3QgbmFtZSA9IHJlZi5zbGljZShNYXRoLm1heChjb2xvbkkgKyAxLCBzbGFzaEkgKyAxKSk7XG5cbiAgaWYgKGtpbmQgPT09ICcnIHx8IG5hbWVzcGFjZSA9PT0gJycgfHwgbmFtZSA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgYEVudGl0eSByZWZlcmVuY2UgXCIke3JlZn1cIiB3YXMgbm90IG9uIHRoZSBmb3JtIFs8a2luZD46XVs8bmFtZXNwYWNlPi9dPG5hbWU+YCxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHsga2luZCwgbmFtZXNwYWNlLCBuYW1lIH07XG59XG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIGtpbmQsIG5hbWVzcGFjZSBhbmQgbmFtZSB0aGF0IGZvcm0gdGhlIGNvbXBvdW5kIGVudGl0eSByZWZcbiAqIHRyaXBsZXQgb2YgdGhlIGdpdmVuIGVudGl0eS5cbiAqXG4gKiBAcHVibGljXG4gKiBAZGVwcmVjYXRlZCBVc2UgZ2V0Q29tcG91bmRFbnRpdHlSZWYgaW5zdGVhZFxuICogQHBhcmFtIGVudGl0eSAtIEFuIGVudGl0eVxuICogQHJldHVybnMgVGhlIGNvbXBvdW5kIGVudGl0eSByZWZcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEVudGl0eU5hbWUgPSBnZXRDb21wb3VuZEVudGl0eVJlZjtcblxuLyoqXG4gKiBFeHRyYWN0cyB0aGUga2luZCwgbmFtZXNwYWNlIGFuZCBuYW1lIHRoYXQgZm9ybSB0aGUgY29tcG91bmQgZW50aXR5IHJlZlxuICogdHJpcGxldCBvZiB0aGUgZ2l2ZW4gZW50aXR5LlxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSBlbnRpdHkgLSBBbiBlbnRpdHlcbiAqIEByZXR1cm5zIFRoZSBjb21wb3VuZCBlbnRpdHkgcmVmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb3VuZEVudGl0eVJlZihlbnRpdHkpIHtcbiAgcmV0dXJuIHtcbiAgICBraW5kOiBlbnRpdHkua2luZCxcbiAgICBuYW1lc3BhY2U6IGVudGl0eS5tZXRhZGF0YS5uYW1lc3BhY2UgfHwgREVGQVVMVF9OQU1FU1BBQ0UsXG4gICAgbmFtZTogZW50aXR5Lm1ldGFkYXRhLm5hbWUsXG4gIH07XG59XG5cbi8qKlxuICogUGFyc2VzIGFuIGVudGl0eSByZWZlcmVuY2UsIGVpdGhlciBvbiBzdHJpbmcgb3IgY29tcG91bmQgZm9ybSwgYW5kIHJldHVybnNcbiAqIGEgc3RydWN0dXJlIHdpdGggYSBuYW1lLCBhbmQgb3B0aW9uYWwga2luZCBhbmQgbmFtZXNwYWNlLlxuICpcbiAqIEByZW1hcmtzXG4gKlxuICogVGhlIGNvbnRleHQgb2JqZWN0IGNhbiBjb250YWluIGRlZmF1bHQgdmFsdWVzIGZvciB0aGUga2luZCBhbmQgbmFtZXNwYWNlLFxuICogdGhhdCB3aWxsIGJlIHVzZWQgaWYgdGhlIGlucHV0IHJlZmVyZW5jZSBkaWQgbm90IHNwZWNpZnkgYW55LlxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSByZWYgLSBUaGUgcmVmZXJlbmNlIHRvIHBhcnNlXG4gKiBAcGFyYW0gY29udGV4dCAtIFRoZSBjb250ZXh0IG9mIGRlZmF1bHRzIHRoYXQgdGhlIHBhcnNpbmcgaGFwcGVucyB3aXRoaW5cbiAqIEByZXR1cm5zIFRoZSBjb21wb3VuZCBmb3JtIG9mIHRoZSByZWZlcmVuY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRW50aXR5UmVmKFxuICByZWYsXG4gIGNvbnRleHRcblxuXG5cblxuLFxuKSB7XG4gIC8vIGNvbnNvbGUubG9nKCcjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIycpO1xuICAvLyBjb25zb2xlLmxvZyhyZWYpO1xuICAvLyBjb25zb2xlLmxvZygnIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMnKTtcbiAgaWYgKCFyZWYpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVudGl0eSByZWZlcmVuY2UgbXVzdCBub3QgYmUgZW1wdHkgKGdvdCBcIiR7cmVmfVwiKWApO1xuICB9XG5cbiAgY29uc3QgZGVmYXVsdEtpbmQgPSBjb250ZXh0Py5kZWZhdWx0S2luZDtcbiAgY29uc3QgZGVmYXVsdE5hbWVzcGFjZSA9IGNvbnRleHQ/LmRlZmF1bHROYW1lc3BhY2UgfHwgREVGQVVMVF9OQU1FU1BBQ0U7XG5cbiAgbGV0IGtpbmQ7XG4gIGxldCBuYW1lc3BhY2U7XG4gIGxldCBuYW1lO1xuXG4gIGlmICh0eXBlb2YgcmVmID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlUmVmU3RyaW5nKHJlZik7XG4gICAga2luZCA9IHBhcnNlZC5raW5kID8/IGRlZmF1bHRLaW5kO1xuICAgIG5hbWVzcGFjZSA9IHBhcnNlZC5uYW1lc3BhY2UgPz8gZGVmYXVsdE5hbWVzcGFjZTtcbiAgICBuYW1lID0gcGFyc2VkLm5hbWU7XG4gIH0gZWxzZSB7XG4gICAga2luZCA9IHJlZi5raW5kID8/IGRlZmF1bHRLaW5kO1xuICAgIG5hbWVzcGFjZSA9IHJlZi5uYW1lc3BhY2UgPz8gZGVmYXVsdE5hbWVzcGFjZTtcbiAgICBuYW1lID0gcmVmLm5hbWU7XG4gIH1cblxuICBpZiAoIWtpbmQpIHtcbiAgICBjb25zdCB0ZXh0dWFsID0gSlNPTi5zdHJpbmdpZnkocmVmKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRW50aXR5IHJlZmVyZW5jZSAke3RleHR1YWx9IGhhZCBtaXNzaW5nIG9yIGVtcHR5IGtpbmQgKGUuZy4gZGlkIG5vdCBzdGFydCB3aXRoIFwiY29tcG9uZW50OlwiIG9yIHNpbWlsYXIpYCxcbiAgICApO1xuICB9IGVsc2UgaWYgKCFuYW1lc3BhY2UpIHtcbiAgICBjb25zdCB0ZXh0dWFsID0gSlNPTi5zdHJpbmdpZnkocmVmKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRW50aXR5IHJlZmVyZW5jZSAke3RleHR1YWx9IGhhZCBtaXNzaW5nIG9yIGVtcHR5IG5hbWVzcGFjZWAsXG4gICAgKTtcbiAgfSBlbHNlIGlmICghbmFtZSkge1xuICAgIGNvbnN0IHRleHR1YWwgPSBKU09OLnN0cmluZ2lmeShyZWYpO1xuICAgIHRocm93IG5ldyBFcnJvcihgRW50aXR5IHJlZmVyZW5jZSAke3RleHR1YWx9IGhhZCBtaXNzaW5nIG9yIGVtcHR5IG5hbWVgKTtcbiAgfVxuXG4gIHJldHVybiB7IGtpbmQsIG5hbWVzcGFjZSwgbmFtZSB9O1xufVxuXG4vKipcbiAqIFRha2VzIGFuIGVudGl0eSBvciBlbnRpdHkgbmFtZS9yZWZlcmVuY2UsIGFuZCByZXR1cm5zIHRoZSBzdHJpbmcgZm9ybSBvZiBhblxuICogZW50aXR5IHJlZi5cbiAqXG4gKiBAcmVtYXJrc1xuICpcbiAqIFRoaXMgZnVuY3Rpb24gY3JlYXRlcyBhIGNhbm9uaWNhbCBhbmQgdW5pcXVlIHJlZmVyZW5jZSB0byB0aGUgZW50aXR5LCBjb252ZXJ0aW5nXG4gKiBhbGwgcGFydHMgb2YgdGhlIG5hbWUgdG8gbG93ZXJjYXNlIGFuZCBpbnNlcnRzIHRoZSBkZWZhdWx0IG5hbWVzcGFjZSBpZiBuZWVkZWQuXG4gKiBJdCBpcyB0eXBpY2FsbHkgbm90IHRoZSBiZXN0IHdheSB0byByZXByZXNlbnQgdGhlIGVudGl0eSByZWZlcmVuY2UgdG8gdGhlIHVzZXIuXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHJlZiAtIFRoZSByZWZlcmVuY2UgdG8gc2VyaWFsaXplXG4gKiBAcmV0dXJucyBUaGUgc2FtZSByZWZlcmVuY2Ugb24gZWl0aGVyIHN0cmluZyBvciBjb21wb3VuZCBmb3JtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlFbnRpdHlSZWYoXG4gIHJlZixcbikge1xuICBsZXQga2luZDtcbiAgbGV0IG5hbWVzcGFjZTtcbiAgbGV0IG5hbWU7XG5cbiAgaWYgKCdtZXRhZGF0YScgaW4gcmVmKSB7XG4gICAga2luZCA9IHJlZi5raW5kO1xuICAgIG5hbWVzcGFjZSA9IHJlZi5tZXRhZGF0YS5uYW1lc3BhY2UgPz8gREVGQVVMVF9OQU1FU1BBQ0U7XG4gICAgbmFtZSA9IHJlZi5tZXRhZGF0YS5uYW1lO1xuICB9IGVsc2Uge1xuICAgIGtpbmQgPSByZWYua2luZDtcbiAgICBuYW1lc3BhY2UgPSByZWYubmFtZXNwYWNlID8/IERFRkFVTFRfTkFNRVNQQUNFO1xuICAgIG5hbWUgPSByZWYubmFtZTtcbiAgfVxuXG4gIHJldHVybiBgJHtraW5kLnRvTG9jYWxlTG93ZXJDYXNlKCdlbi1VUycpfToke25hbWVzcGFjZS50b0xvY2FsZUxvd2VyQ2FzZShcbiAgICAnZW4tVVMnLFxuICApfS8ke25hbWUudG9Mb2NhbGVMb3dlckNhc2UoJ2VuLVVTJyl9YDtcbn1cblxuOyhmdW5jdGlvbiAoKSB7XG4gIHZhciByZWFjdEhvdExvYWRlciA9IHJlcXVpcmUoJ3JlYWN0LWhvdC1sb2FkZXInKS5kZWZhdWx0O1xuICB2YXIgbGVhdmVNb2R1bGUgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykubGVhdmVNb2R1bGU7XG4gIGlmICghcmVhY3RIb3RMb2FkZXIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVhY3RIb3RMb2FkZXIucmVnaXN0ZXIocGFyc2VSZWZTdHJpbmcsIFwicGFyc2VSZWZTdHJpbmdcIiwgXCIvVXNlcnMvbWF1cm9zYWxhL0Rldi9naXRodWIva3JhdGVvcGxhdGZvcm1vcHMva3JhdGVvLWRhc2hib2FyZC1iYWNrZW5kL3BhY2thZ2VzL2NhdGFsb2ctbW9kZWwvc3JjL2VudGl0eS9yZWYudHNcIik7XG4gIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKGdldEVudGl0eU5hbWUsIFwiZ2V0RW50aXR5TmFtZVwiLCBcIi9Vc2Vycy9tYXVyb3NhbGEvRGV2L2dpdGh1Yi9rcmF0ZW9wbGF0Zm9ybW9wcy9rcmF0ZW8tZGFzaGJvYXJkLWJhY2tlbmQvcGFja2FnZXMvY2F0YWxvZy1tb2RlbC9zcmMvZW50aXR5L3JlZi50c1wiKTtcbiAgcmVhY3RIb3RMb2FkZXIucmVnaXN0ZXIoZ2V0Q29tcG91bmRFbnRpdHlSZWYsIFwiZ2V0Q29tcG91bmRFbnRpdHlSZWZcIiwgXCIvVXNlcnMvbWF1cm9zYWxhL0Rldi9naXRodWIva3JhdGVvcGxhdGZvcm1vcHMva3JhdGVvLWRhc2hib2FyZC1iYWNrZW5kL3BhY2thZ2VzL2NhdGFsb2ctbW9kZWwvc3JjL2VudGl0eS9yZWYudHNcIik7XG4gIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKHBhcnNlRW50aXR5UmVmLCBcInBhcnNlRW50aXR5UmVmXCIsIFwiL1VzZXJzL21hdXJvc2FsYS9EZXYvZ2l0aHViL2tyYXRlb3BsYXRmb3Jtb3BzL2tyYXRlby1kYXNoYm9hcmQtYmFja2VuZC9wYWNrYWdlcy9jYXRhbG9nLW1vZGVsL3NyYy9lbnRpdHkvcmVmLnRzXCIpO1xuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihzdHJpbmdpZnlFbnRpdHlSZWYsIFwic3RyaW5naWZ5RW50aXR5UmVmXCIsIFwiL1VzZXJzL21hdXJvc2FsYS9EZXYvZ2l0aHViL2tyYXRlb3BsYXRmb3Jtb3BzL2tyYXRlby1kYXNoYm9hcmQtYmFja2VuZC9wYWNrYWdlcy9jYXRhbG9nLW1vZGVsL3NyYy9lbnRpdHkvcmVmLnRzXCIpO1xuICBsZWF2ZU1vZHVsZShtb2R1bGUpO1xufSkoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../catalog-model/src/entity/ref.ts\n");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("444072331ef61860e883")
/******/ })();
/******/ 
/******/ }
;