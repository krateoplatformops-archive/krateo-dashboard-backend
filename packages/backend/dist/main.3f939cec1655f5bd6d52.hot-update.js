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

/***/ "./src/plugins/scaffolder/actions/ro-insiel.ts":
/*!*****************************************************!*\
  !*** ./src/plugins/scaffolder/actions/ro-insiel.ts ***!
  \*****************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createRoInsielAction\": () => (/* binding */ createRoInsielAction)\n/* harmony export */ });\n/* harmony import */ var _backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @backstage/plugin-scaffolder-backend */ \"../../plugins/scaffolder-backend/src/index.ts\");\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @backstage/backend-common */ \"../backend-common/src/index.ts\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () { var enterModule = (__webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule); enterModule && enterModule(module); })();/*\n * Copyright 2022 The Backstage Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\nconst git = __webpack_require__(/*! isomorphic-git */ \"isomorphic-git?7761\");\nconst http = __webpack_require__(/*! isomorphic-git/http/node */ \"isomorphic-git/http/node?5755\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst nunjucks = __webpack_require__(/*! nunjucks */ \"nunjucks\");\nconst { Octokit } = __webpack_require__(/*! @octokit/rest */ \"@octokit/rest?e034\");\n\nconst util = __webpack_require__(/*! util */ \"util\");\n\nconst getAllFiles = (dirPath, arrayOfFiles) => {\n  const files = fs.readdirSync(dirPath);\n\n  arrayOfFiles = arrayOfFiles || [];\n\n  files.forEach((file) => {\n    if (file !== '.git') {\n      if (fs.statSync(dirPath + '/' + file).isDirectory()) {\n        arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);\n      } else {\n        arrayOfFiles.push(path.join(dirPath, '/', file));\n      }\n    }\n  });\n\n  return arrayOfFiles;\n};\n\nconst createRoInsielAction = () => {\n  return (0,_backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_0__.createTemplateAction)\n\n\n\n({\n    id: 'krateo:ro-insiel',\n    schema: {\n      input: {\n        required: ['host', 'component_id', 'gitHubUrl'],\n        type: 'object',\n        properties: {\n          host: {\n            type: 'string',\n            title: 'Host',\n            description: 'Host',\n          },\n          component_id: {\n            type: 'string',\n            title: 'Component Id',\n            description: 'Component Id',\n          },\n          gitHubUrl: {\n            type: 'string',\n            title: 'GitHub Url',\n            description: 'GitHub Url',\n          },\n        },\n      },\n    },\n    async handler(ctx) {\n      const fullUrl = `https://${ctx.input.host}`;\n      const url = new URL(fullUrl);\n      const owner = url.searchParams.get('owner');\n      const repo = url.searchParams.get('repo');\n      const base = url.origin;\n      const repoURL = `${base}/${owner}/${repo}`;\n\n      const templateUrl = ctx.baseUrl.replace('/tree/main/', '');\n\n      const workDir = await ctx.createTemporaryDirectory();\n      const helmDir = (0,_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__.resolveSafeChildPath)(workDir, 'helm-chart');\n\n      ctx.logger.info(`Created temporary directory: ${workDir}`);\n      ctx.logger.info(`Helm directory: ${helmDir}`);\n\n      await git.clone({\n        fs,\n        http,\n        dir: workDir,\n        url: templateUrl,\n        onAuth: () => ({ username: process.env.GITHUB_TOKEN }),\n        ref: 'main',\n        singleBranch: true,\n        depth: 1,\n      });\n\n      // template\n      const files = getAllFiles(helmDir, null);\n      nunjucks.configure(helmDir, {\n        noCache: true,\n        autoescape: true,\n        tags: { variableStart: '${{' },\n      });\n      files.forEach((f) => {\n        const original = fs.readFileSync(f, { encoding: 'base64' });\n\n        if (original.length > 0) {\n          ctx.logger.info(`Processing file: ${f}`);\n          const modified = nunjucks.render(f.replace(`${helmDir}/`, ''), {\n            component_id: ctx.input.component_id,\n          });\n\n          if (original !== Buffer.from(modified, 'utf-8').toString('base64')) {\n            fs.writeFileSync(f, modified, { encoding: 'utf-8' });\n          }\n        }\n      });\n\n      // check if is organization\n      const octokit = new Octokit({\n        auth: process.env.GITHUB_TOKEN,\n        baseUrl: ctx.input.gitHubUrl,\n      });\n      let isOrganization = false;\n      try {\n        await octokit.rest.repos.listForOrg({\n          org: owner,\n        });\n        isOrganization = true;\n        ctx.logger.info(`Destination repo is org`);\n      } catch (err) {\n        ctx.logger.info(`Destination repo is not org`);\n      }\n\n      // push repo\n      ctx.logger.info(`${repoURL}-hc`);\n      if (isOrganization) {\n        await octokit.rest.repos.createInOrg({\n          org: owner,\n          name: `${repo}-hc`,\n        });\n        await octokit.rest.repos.createInOrg({\n          org: owner,\n          name: `${repo}-keptn`,\n        });\n      } else {\n        await octokit.rest.repos.createForAuthenticatedUser({\n          name: `${repo}-hc`,\n        });\n        await octokit.rest.repos.createForAuthenticatedUser({\n          name: `${repo}-keptn`,\n        });\n      }\n      ctx.logger.info(`Created repository: ${repoURL}-hc`);\n      ctx.logger.info(`Created repository: ${repoURL}-keptn`);\n\n      await git.init({ fs, dir: helmDir, defaultBranch: 'main' });\n      ctx.logger.info(`Init`);\n      await git.add({ fs, dir: helmDir, filepath: '.' });\n      ctx.logger.info(`Add *`);\n      await git.commit({\n        fs,\n        dir: helmDir,\n        author: {\n          name: 'Scaffolder',\n          email: '',\n        },\n        message: 'initial commit',\n      });\n      ctx.logger.info(`Commit`);\n      await git.addRemote({\n        fs,\n        dir: helmDir,\n        remote: 'origin',\n        url: `${repoURL}-hc.git`,\n      });\n      ctx.logger.info(`Add remote ${repoURL}-hc.git`);\n      await git\n        .push({\n          fs,\n          http,\n          dir: helmDir,\n          remote: 'origin',\n          ref: 'main',\n          onAuth: () => ({ username: process.env.GITHUB_TOKEN }),\n          onProgress: (state) => {\n            try {\n              ctx.logger.info(`Pushing ${state.phase}`);\n            } catch (e) {\n              ctx.logger.error(e);\n            }\n          },\n        })\n        .catch((err) => {\n          ctx.logger.error(`❌ Push progress failed: ${err}`);\n        });\n      ctx.logger.info(`Push`);\n\n      ctx.logger.info(`Well done, pushed successfully!`);\n    },\n  });\n};\n\n;(function () {\n  var reactHotLoader = (__webpack_require__(/*! react-hot-loader */ \"react-hot-loader\")[\"default\"]);\n  var leaveModule = (__webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule);\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(git, \"git\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  reactHotLoader.register(http, \"http\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  reactHotLoader.register(fs, \"fs\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  reactHotLoader.register(path, \"path\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  reactHotLoader.register(nunjucks, \"nunjucks\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  reactHotLoader.register(Octokit, \"Octokit\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  reactHotLoader.register(util, \"util\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  reactHotLoader.register(getAllFiles, \"getAllFiles\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  reactHotLoader.register(createRoInsielAction, \"createRoInsielAction\", \"/Users/maurosala/Dev/github/krateoplatformops/krateo-dashboard-backend/packages/backend/src/plugins/scaffolder/actions/ro-insiel.ts\");\n  leaveModule(module);\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy9zY2FmZm9sZGVyL2FjdGlvbnMvcm8taW5zaWVsLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiZmlsZTovLy8vVXNlcnMvbWF1cm9zYWxhL0Rldi9naXRodWIva3JhdGVvcGxhdGZvcm1vcHMva3JhdGVvLWRhc2hib2FyZC1iYWNrZW5kL3BhY2thZ2VzL2JhY2tlbmQvc3JjL3BsdWdpbnMvc2NhZmZvbGRlci9hY3Rpb25zL3JvLWluc2llbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkgeyB2YXIgZW50ZXJNb2R1bGUgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykuZW50ZXJNb2R1bGU7IGVudGVyTW9kdWxlICYmIGVudGVyTW9kdWxlKG1vZHVsZSk7IH0pKCk7LypcbiAqIENvcHlyaWdodCAyMDIyIFRoZSBCYWNrc3RhZ2UgQXV0aG9yc1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBjcmVhdGVUZW1wbGF0ZUFjdGlvbiB9IGZyb20gJ0BiYWNrc3RhZ2UvcGx1Z2luLXNjYWZmb2xkZXItYmFja2VuZCc7XG5pbXBvcnQgeyByZXNvbHZlU2FmZUNoaWxkUGF0aCB9IGZyb20gJ0BiYWNrc3RhZ2UvYmFja2VuZC1jb21tb24nO1xuY29uc3QgZ2l0ID0gcmVxdWlyZSgnaXNvbW9ycGhpYy1naXQnKTtcbmNvbnN0IGh0dHAgPSByZXF1aXJlKCdpc29tb3JwaGljLWdpdC9odHRwL25vZGUnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBudW5qdWNrcyA9IHJlcXVpcmUoJ251bmp1Y2tzJyk7XG5jb25zdCB7IE9jdG9raXQgfSA9IHJlcXVpcmUoJ0BvY3Rva2l0L3Jlc3QnKTtcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxuY29uc3QgZ2V0QWxsRmlsZXMgPSAoZGlyUGF0aCwgYXJyYXlPZkZpbGVzKSA9PiB7XG4gIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoZGlyUGF0aCk7XG5cbiAgYXJyYXlPZkZpbGVzID0gYXJyYXlPZkZpbGVzIHx8IFtdO1xuXG4gIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICBpZiAoZmlsZSAhPT0gJy5naXQnKSB7XG4gICAgICBpZiAoZnMuc3RhdFN5bmMoZGlyUGF0aCArICcvJyArIGZpbGUpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgYXJyYXlPZkZpbGVzID0gZ2V0QWxsRmlsZXMoZGlyUGF0aCArICcvJyArIGZpbGUsIGFycmF5T2ZGaWxlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheU9mRmlsZXMucHVzaChwYXRoLmpvaW4oZGlyUGF0aCwgJy8nLCBmaWxlKSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gYXJyYXlPZkZpbGVzO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJvSW5zaWVsQWN0aW9uID0gKCkgPT4ge1xuICByZXR1cm4gY3JlYXRlVGVtcGxhdGVBY3Rpb25cblxuXG5cbih7XG4gICAgaWQ6ICdrcmF0ZW86cm8taW5zaWVsJyxcbiAgICBzY2hlbWE6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIHJlcXVpcmVkOiBbJ2hvc3QnLCAnY29tcG9uZW50X2lkJywgJ2dpdEh1YlVybCddLFxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGhvc3Q6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgdGl0bGU6ICdIb3N0JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSG9zdCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb21wb25lbnRfaWQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgdGl0bGU6ICdDb21wb25lbnQgSWQnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDb21wb25lbnQgSWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2l0SHViVXJsOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIHRpdGxlOiAnR2l0SHViIFVybCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dpdEh1YiBVcmwnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXN5bmMgaGFuZGxlcihjdHgpIHtcbiAgICAgIGNvbnN0IGZ1bGxVcmwgPSBgaHR0cHM6Ly8ke2N0eC5pbnB1dC5ob3N0fWA7XG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGZ1bGxVcmwpO1xuICAgICAgY29uc3Qgb3duZXIgPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgnb3duZXInKTtcbiAgICAgIGNvbnN0IHJlcG8gPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgncmVwbycpO1xuICAgICAgY29uc3QgYmFzZSA9IHVybC5vcmlnaW47XG4gICAgICBjb25zdCByZXBvVVJMID0gYCR7YmFzZX0vJHtvd25lcn0vJHtyZXBvfWA7XG5cbiAgICAgIGNvbnN0IHRlbXBsYXRlVXJsID0gY3R4LmJhc2VVcmwucmVwbGFjZSgnL3RyZWUvbWFpbi8nLCAnJyk7XG5cbiAgICAgIGNvbnN0IHdvcmtEaXIgPSBhd2FpdCBjdHguY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5KCk7XG4gICAgICBjb25zdCBoZWxtRGlyID0gcmVzb2x2ZVNhZmVDaGlsZFBhdGgod29ya0RpciwgJ2hlbG0tY2hhcnQnKTtcblxuICAgICAgY3R4LmxvZ2dlci5pbmZvKGBDcmVhdGVkIHRlbXBvcmFyeSBkaXJlY3Rvcnk6ICR7d29ya0Rpcn1gKTtcbiAgICAgIGN0eC5sb2dnZXIuaW5mbyhgSGVsbSBkaXJlY3Rvcnk6ICR7aGVsbURpcn1gKTtcblxuICAgICAgYXdhaXQgZ2l0LmNsb25lKHtcbiAgICAgICAgZnMsXG4gICAgICAgIGh0dHAsXG4gICAgICAgIGRpcjogd29ya0RpcixcbiAgICAgICAgdXJsOiB0ZW1wbGF0ZVVybCxcbiAgICAgICAgb25BdXRoOiAoKSA9PiAoeyB1c2VybmFtZTogcHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOIH0pLFxuICAgICAgICByZWY6ICdtYWluJyxcbiAgICAgICAgc2luZ2xlQnJhbmNoOiB0cnVlLFxuICAgICAgICBkZXB0aDogMSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0ZW1wbGF0ZVxuICAgICAgY29uc3QgZmlsZXMgPSBnZXRBbGxGaWxlcyhoZWxtRGlyLCBudWxsKTtcbiAgICAgIG51bmp1Y2tzLmNvbmZpZ3VyZShoZWxtRGlyLCB7XG4gICAgICAgIG5vQ2FjaGU6IHRydWUsXG4gICAgICAgIGF1dG9lc2NhcGU6IHRydWUsXG4gICAgICAgIHRhZ3M6IHsgdmFyaWFibGVTdGFydDogJyR7eycgfSxcbiAgICAgIH0pO1xuICAgICAgZmlsZXMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICBjb25zdCBvcmlnaW5hbCA9IGZzLnJlYWRGaWxlU3luYyhmLCB7IGVuY29kaW5nOiAnYmFzZTY0JyB9KTtcblxuICAgICAgICBpZiAob3JpZ2luYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGN0eC5sb2dnZXIuaW5mbyhgUHJvY2Vzc2luZyBmaWxlOiAke2Z9YCk7XG4gICAgICAgICAgY29uc3QgbW9kaWZpZWQgPSBudW5qdWNrcy5yZW5kZXIoZi5yZXBsYWNlKGAke2hlbG1EaXJ9L2AsICcnKSwge1xuICAgICAgICAgICAgY29tcG9uZW50X2lkOiBjdHguaW5wdXQuY29tcG9uZW50X2lkLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKG9yaWdpbmFsICE9PSBCdWZmZXIuZnJvbShtb2RpZmllZCwgJ3V0Zi04JykudG9TdHJpbmcoJ2Jhc2U2NCcpKSB7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGYsIG1vZGlmaWVkLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNoZWNrIGlmIGlzIG9yZ2FuaXphdGlvblxuICAgICAgY29uc3Qgb2N0b2tpdCA9IG5ldyBPY3Rva2l0KHtcbiAgICAgICAgYXV0aDogcHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOLFxuICAgICAgICBiYXNlVXJsOiBjdHguaW5wdXQuZ2l0SHViVXJsLFxuICAgICAgfSk7XG4gICAgICBsZXQgaXNPcmdhbml6YXRpb24gPSBmYWxzZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IG9jdG9raXQucmVzdC5yZXBvcy5saXN0Rm9yT3JnKHtcbiAgICAgICAgICBvcmc6IG93bmVyLFxuICAgICAgICB9KTtcbiAgICAgICAgaXNPcmdhbml6YXRpb24gPSB0cnVlO1xuICAgICAgICBjdHgubG9nZ2VyLmluZm8oYERlc3RpbmF0aW9uIHJlcG8gaXMgb3JnYCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY3R4LmxvZ2dlci5pbmZvKGBEZXN0aW5hdGlvbiByZXBvIGlzIG5vdCBvcmdgKTtcbiAgICAgIH1cblxuICAgICAgLy8gcHVzaCByZXBvXG4gICAgICBjdHgubG9nZ2VyLmluZm8oYCR7cmVwb1VSTH0taGNgKTtcbiAgICAgIGlmIChpc09yZ2FuaXphdGlvbikge1xuICAgICAgICBhd2FpdCBvY3Rva2l0LnJlc3QucmVwb3MuY3JlYXRlSW5Pcmcoe1xuICAgICAgICAgIG9yZzogb3duZXIsXG4gICAgICAgICAgbmFtZTogYCR7cmVwb30taGNgLFxuICAgICAgICB9KTtcbiAgICAgICAgYXdhaXQgb2N0b2tpdC5yZXN0LnJlcG9zLmNyZWF0ZUluT3JnKHtcbiAgICAgICAgICBvcmc6IG93bmVyLFxuICAgICAgICAgIG5hbWU6IGAke3JlcG99LWtlcHRuYCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBvY3Rva2l0LnJlc3QucmVwb3MuY3JlYXRlRm9yQXV0aGVudGljYXRlZFVzZXIoe1xuICAgICAgICAgIG5hbWU6IGAke3JlcG99LWhjYCxcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IG9jdG9raXQucmVzdC5yZXBvcy5jcmVhdGVGb3JBdXRoZW50aWNhdGVkVXNlcih7XG4gICAgICAgICAgbmFtZTogYCR7cmVwb30ta2VwdG5gLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGN0eC5sb2dnZXIuaW5mbyhgQ3JlYXRlZCByZXBvc2l0b3J5OiAke3JlcG9VUkx9LWhjYCk7XG4gICAgICBjdHgubG9nZ2VyLmluZm8oYENyZWF0ZWQgcmVwb3NpdG9yeTogJHtyZXBvVVJMfS1rZXB0bmApO1xuXG4gICAgICBhd2FpdCBnaXQuaW5pdCh7IGZzLCBkaXI6IGhlbG1EaXIsIGRlZmF1bHRCcmFuY2g6ICdtYWluJyB9KTtcbiAgICAgIGN0eC5sb2dnZXIuaW5mbyhgSW5pdGApO1xuICAgICAgYXdhaXQgZ2l0LmFkZCh7IGZzLCBkaXI6IGhlbG1EaXIsIGZpbGVwYXRoOiAnLicgfSk7XG4gICAgICBjdHgubG9nZ2VyLmluZm8oYEFkZCAqYCk7XG4gICAgICBhd2FpdCBnaXQuY29tbWl0KHtcbiAgICAgICAgZnMsXG4gICAgICAgIGRpcjogaGVsbURpcixcbiAgICAgICAgYXV0aG9yOiB7XG4gICAgICAgICAgbmFtZTogJ1NjYWZmb2xkZXInLFxuICAgICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZTogJ2luaXRpYWwgY29tbWl0JyxcbiAgICAgIH0pO1xuICAgICAgY3R4LmxvZ2dlci5pbmZvKGBDb21taXRgKTtcbiAgICAgIGF3YWl0IGdpdC5hZGRSZW1vdGUoe1xuICAgICAgICBmcyxcbiAgICAgICAgZGlyOiBoZWxtRGlyLFxuICAgICAgICByZW1vdGU6ICdvcmlnaW4nLFxuICAgICAgICB1cmw6IGAke3JlcG9VUkx9LWhjLmdpdGAsXG4gICAgICB9KTtcbiAgICAgIGN0eC5sb2dnZXIuaW5mbyhgQWRkIHJlbW90ZSAke3JlcG9VUkx9LWhjLmdpdGApO1xuICAgICAgYXdhaXQgZ2l0XG4gICAgICAgIC5wdXNoKHtcbiAgICAgICAgICBmcyxcbiAgICAgICAgICBodHRwLFxuICAgICAgICAgIGRpcjogaGVsbURpcixcbiAgICAgICAgICByZW1vdGU6ICdvcmlnaW4nLFxuICAgICAgICAgIHJlZjogJ21haW4nLFxuICAgICAgICAgIG9uQXV0aDogKCkgPT4gKHsgdXNlcm5hbWU6IHByb2Nlc3MuZW52LkdJVEhVQl9UT0tFTiB9KSxcbiAgICAgICAgICBvblByb2dyZXNzOiAoc3RhdGUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGN0eC5sb2dnZXIuaW5mbyhgUHVzaGluZyAke3N0YXRlLnBoYXNlfWApO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBjdHgubG9nZ2VyLmVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgY3R4LmxvZ2dlci5lcnJvcihg4p2MIFB1c2ggcHJvZ3Jlc3MgZmFpbGVkOiAke2Vycn1gKTtcbiAgICAgICAgfSk7XG4gICAgICBjdHgubG9nZ2VyLmluZm8oYFB1c2hgKTtcblxuICAgICAgY3R4LmxvZ2dlci5pbmZvKGBXZWxsIGRvbmUsIHB1c2hlZCBzdWNjZXNzZnVsbHkhYCk7XG4gICAgfSxcbiAgfSk7XG59O1xuXG47KGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlYWN0SG90TG9hZGVyID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmRlZmF1bHQ7XG4gIHZhciBsZWF2ZU1vZHVsZSA9IHJlcXVpcmUoJ3JlYWN0LWhvdC1sb2FkZXInKS5sZWF2ZU1vZHVsZTtcbiAgaWYgKCFyZWFjdEhvdExvYWRlcikge1xuICAgIHJldHVybjtcbiAgfVxuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihnaXQsIFwiZ2l0XCIsIFwiL1VzZXJzL21hdXJvc2FsYS9EZXYvZ2l0aHViL2tyYXRlb3BsYXRmb3Jtb3BzL2tyYXRlby1kYXNoYm9hcmQtYmFja2VuZC9wYWNrYWdlcy9iYWNrZW5kL3NyYy9wbHVnaW5zL3NjYWZmb2xkZXIvYWN0aW9ucy9yby1pbnNpZWwudHNcIik7XG4gIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKGh0dHAsIFwiaHR0cFwiLCBcIi9Vc2Vycy9tYXVyb3NhbGEvRGV2L2dpdGh1Yi9rcmF0ZW9wbGF0Zm9ybW9wcy9rcmF0ZW8tZGFzaGJvYXJkLWJhY2tlbmQvcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9zY2FmZm9sZGVyL2FjdGlvbnMvcm8taW5zaWVsLnRzXCIpO1xuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihmcywgXCJmc1wiLCBcIi9Vc2Vycy9tYXVyb3NhbGEvRGV2L2dpdGh1Yi9rcmF0ZW9wbGF0Zm9ybW9wcy9rcmF0ZW8tZGFzaGJvYXJkLWJhY2tlbmQvcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9zY2FmZm9sZGVyL2FjdGlvbnMvcm8taW5zaWVsLnRzXCIpO1xuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihwYXRoLCBcInBhdGhcIiwgXCIvVXNlcnMvbWF1cm9zYWxhL0Rldi9naXRodWIva3JhdGVvcGxhdGZvcm1vcHMva3JhdGVvLWRhc2hib2FyZC1iYWNrZW5kL3BhY2thZ2VzL2JhY2tlbmQvc3JjL3BsdWdpbnMvc2NhZmZvbGRlci9hY3Rpb25zL3JvLWluc2llbC50c1wiKTtcbiAgcmVhY3RIb3RMb2FkZXIucmVnaXN0ZXIobnVuanVja3MsIFwibnVuanVja3NcIiwgXCIvVXNlcnMvbWF1cm9zYWxhL0Rldi9naXRodWIva3JhdGVvcGxhdGZvcm1vcHMva3JhdGVvLWRhc2hib2FyZC1iYWNrZW5kL3BhY2thZ2VzL2JhY2tlbmQvc3JjL3BsdWdpbnMvc2NhZmZvbGRlci9hY3Rpb25zL3JvLWluc2llbC50c1wiKTtcbiAgcmVhY3RIb3RMb2FkZXIucmVnaXN0ZXIoT2N0b2tpdCwgXCJPY3Rva2l0XCIsIFwiL1VzZXJzL21hdXJvc2FsYS9EZXYvZ2l0aHViL2tyYXRlb3BsYXRmb3Jtb3BzL2tyYXRlby1kYXNoYm9hcmQtYmFja2VuZC9wYWNrYWdlcy9iYWNrZW5kL3NyYy9wbHVnaW5zL3NjYWZmb2xkZXIvYWN0aW9ucy9yby1pbnNpZWwudHNcIik7XG4gIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKHV0aWwsIFwidXRpbFwiLCBcIi9Vc2Vycy9tYXVyb3NhbGEvRGV2L2dpdGh1Yi9rcmF0ZW9wbGF0Zm9ybW9wcy9rcmF0ZW8tZGFzaGJvYXJkLWJhY2tlbmQvcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9zY2FmZm9sZGVyL2FjdGlvbnMvcm8taW5zaWVsLnRzXCIpO1xuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihnZXRBbGxGaWxlcywgXCJnZXRBbGxGaWxlc1wiLCBcIi9Vc2Vycy9tYXVyb3NhbGEvRGV2L2dpdGh1Yi9rcmF0ZW9wbGF0Zm9ybW9wcy9rcmF0ZW8tZGFzaGJvYXJkLWJhY2tlbmQvcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9zY2FmZm9sZGVyL2FjdGlvbnMvcm8taW5zaWVsLnRzXCIpO1xuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihjcmVhdGVSb0luc2llbEFjdGlvbiwgXCJjcmVhdGVSb0luc2llbEFjdGlvblwiLCBcIi9Vc2Vycy9tYXVyb3NhbGEvRGV2L2dpdGh1Yi9rcmF0ZW9wbGF0Zm9ybW9wcy9rcmF0ZW8tZGFzaGJvYXJkLWJhY2tlbmQvcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9zY2FmZm9sZGVyL2FjdGlvbnMvcm8taW5zaWVsLnRzXCIpO1xuICBsZWF2ZU1vZHVsZShtb2R1bGUpO1xufSkoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/plugins/scaffolder/actions/ro-insiel.ts\n");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("1aa85d5d5f72b1d78749")
/******/ })();
/******/ 
/******/ }
;