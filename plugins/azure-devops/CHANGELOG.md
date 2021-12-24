# @backstage/plugin-azure-devops

## 0.1.7

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
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1
  - @backstage/plugin-azure-devops-common@0.1.3
  - @backstage/catalog-model@0.9.8
  - @backstage/plugin-catalog-react@0.6.7

## 0.1.6

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-catalog-react@0.6.5
  - @backstage/plugin-azure-devops-common@0.1.2

## 0.1.5

### Patch Changes

- 0749dd0307: feat: Created pull request card component and initial pull request dashboard page.
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
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2

## 0.1.4

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- b5eac957f2: Added entity view for Azure Repo Pull Requests
- 2b5ccd2964: Improved Date handling for the Azure DevOps set of plugins by using strings and letting the frontend handle the conversion to DateTime
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/plugin-azure-devops-common@0.1.0

## 0.1.3

### Patch Changes

- b85acc8c35: refactor(`@backstage/plugin-azure-devops`): Consume types from `@backstage/plugin-azure-devops-common`.
  Stop re-exporting types from `@backstage/plugin-azure-devops-backend`.
  Added new types to `@backstage/plugin-azure-devops-common`.
- 84ace9a29c: Simplified queue time calculation in `BuildTable`.
- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/plugin-azure-devops-common@0.0.2
  - @backstage/core-plugin-api@0.1.13
  - @backstage/plugin-catalog-react@0.6.3

## 0.1.2

### Patch Changes

- 7359623e87: Azure DevOps frontend refactoring items from issue #7641

  - Remove backend setup documentation and linked to the Azure DevOps backend plugin for these instructions
  - Improved documentation to be easier to expand with new features in the future
  - Removed Router based on feedback from maintainers
  - Added tests for `getBuildResultComponent` and `getBuildStateComponent` from the BuildTable

- Updated dependencies
  - @backstage/theme@0.2.12
  - @backstage/errors@0.1.4
  - @backstage/core-components@0.7.2
  - @backstage/plugin-catalog-react@0.6.2
  - @backstage/catalog-model@0.9.6
  - @backstage/core-plugin-api@0.1.12

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11
