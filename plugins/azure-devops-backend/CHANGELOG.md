# @backstage/plugin-azure-devops-backend

## 0.2.5

### Patch Changes

- daf32e2c9b: Created some initial filters that can be used to create pull request columns:

  - All
  - AssignedToUser
  - AssignedToCurrentUser
  - AssignedToTeam
  - AssignedToTeams
  - AssignedToCurrentUsersTeams
  - CreatedByUser
  - CreatedByCurrentUser
  - CreatedByTeam
  - CreatedByTeams
  - CreatedByCurrentUsersTeams

  Example custom column creation:

  ```tsx
  const COLUMN_CONFIGS: PullRequestColumnConfig[] = [
    {
      title: 'Created by me',
      filters: [{ type: FilterType.CreatedByCurrentUser }],
    },
    {
      title: 'Created by Backstage Core',
      filters: [
        {
          type: FilterType.CreatedByTeam,
          teamName: 'Backstage Core',
        },
      ],
    },
    {
      title: 'Assigned to my teams',
      filters: [{ type: FilterType.AssignedToCurrentUsersTeams }],
    },
    {
      title: 'Other PRs',
      filters: [{ type: FilterType.All }],
      simplified: true,
    },
  ];

  <Route
    path="/azure-pull-requests"
    element={
      <AzurePullRequestsPage
        projectName="{PROJECT_NAME}"
        defaultColumnConfigs={COLUMN_CONFIGS}
      />
    }
  />;
  ```

- Updated dependencies
  - @backstage/backend-common@0.9.14
  - @backstage/plugin-azure-devops-common@0.1.3

## 0.2.4

### Patch Changes

- a77526afcd: Added getting builds by definition name
- Updated dependencies
  - @backstage/backend-common@0.9.13
  - @backstage/plugin-azure-devops-common@0.1.2

## 0.2.3

### Patch Changes

- 82cd709fdb: **Backend**

  - Created new `/dashboard-pull-requests/:projectName` endpoint
  - Created new `/all-teams` endpoint
  - Implemented pull request policy evaluation conversion

  **Frontend**

  - Refactored `PullRequestsPage` and added new properties for `projectName` and `pollingInterval`
  - Fixed spacing issue between repo link and creation date in `PullRequestCard`
  - Added missing condition to `PullRequestCardPolicy` for `RequiredReviewers`
  - Updated `useDashboardPullRequests` hook to implement long polling for pull requests

- Updated dependencies
  - @backstage/plugin-azure-devops-common@0.1.1
  - @backstage/backend-common@0.9.12

## 0.2.2

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/backend-common@0.9.11

## 0.2.1

### Patch Changes

- 2b5ccd2964: Improved Date handling for the Azure DevOps set of plugins by using strings and letting the frontend handle the conversion to DateTime
- Updated dependencies
  - @backstage/backend-common@0.9.10
  - @backstage/plugin-azure-devops-common@0.1.0

## 0.2.0

### Minor Changes

- b85acc8c35: refactor(`@backstage/plugin-azure-devops`): Consume types from `@backstage/plugin-azure-devops-common`.
  Stop re-exporting types from `@backstage/plugin-azure-devops-backend`.
  Added new types to `@backstage/plugin-azure-devops-common`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/plugin-azure-devops-common@0.0.2

## 0.1.4

### Patch Changes

- 2eebc9bac3: Added duration (startTime and finishTime) and identity (uniqueName) to the RepoBuild results. Also did a bit of refactoring to help finish up the backend items in issue #7641
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/backend-common@0.9.8

## 0.1.3

### Patch Changes

- f67dff0d20: Re-exported types from azure-devops-node-api in @backstage/plugin-azure-devops-backend.
- Updated dependencies
  - @backstage/backend-common@0.9.7

## 0.1.2

### Patch Changes

- a23206049f: Updates function for mapping RepoBuilds to handle undefined properties
- b7c0585471: Expands the Azure DevOps backend plugin to provide pull request data to be used by the front end plugin

## 0.1.1

### Patch Changes

- 299b43f052: Marked all configuration values as required in the schema.
- Updated dependencies
  - @backstage/backend-common@0.9.5
