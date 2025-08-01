# GitHub Copilot Prompts for Azure DevOps React Dashboard

## 1. Project Setup

Create a new React app using Create React App. Set up the project structure with a `src` folder for components and a `public` folder for static assets. Add a `projects.config.json` file in the `public` folder to hold Azure DevOps project metadata (organization, project, definitionId, azurePipelineUrl, environment).

---

## 2. Dashboard Component

Build a `Dashboard.js` React component that:
- Loads the project list from `public/projects.config.json` and filters for environment "Dev".
- For each project, fetches the latest build from Azure DevOps REST API using the provided organization, project, and definitionId.
- For the latest build, fetches the last 10 merged PRs/commits.
- Displays each project in a 3x3 CSS grid tile layout, with each tile showing:
  - Project name (with a professional colored background)
  - Pipeline URL (as a clickable link)
  - Definition ID, Organization, Project
  - Latest build details: build number, status, environment, requested by (with avatar), start time, queue time, last changed, build link, source version, source branch
  - Expandable/collapsible list of the last 10 merged PRs/commits, each showing message, author (with avatar), commit ID, timestamp, and commit link if available
- All tiles should have the same width and height, with no overlaps and consistent gaps.
- The dashboard should be fully responsive and visually professional.

---

## 3. Header and User Experience

Add a sticky header to the dashboard with:
- The dashboard title centered
- A refresh button on the top right (before the user avatar) to reload all data
- A user avatar placeholder on the top right
- Ensure the header remains visible on scroll

---

## 4. Styling

Use inline styles or CSS modules to:
- Make the grid layout responsive (3 columns, 2-3 rows, with gaps)
- Give each tile a white background, rounded corners, subtle box-shadow, and padding
- Style the project name with a modern gradient background, rounded top corners, bold font, and professional color palette
- Style tables and text for clarity and readability, ensuring all content fits without overflow
- Style the refresh button and avatar for a modern, clickable look

---

## 5. Configuration

Define a `public/projects.config.json` file with an array of project objects, each containing:
- organization
- project
- definitionId
- azurePipelineUrl
- environment
Example:
[
  {
    "organization": "myorg",
    "project": "myproject",
    "definitionId": 123,
    "azurePipelineUrl": "https://dev.azure.com/myorg/myproject/_build?definitionId=123",
    "environment": "Dev"
  }
]

---

## 6. Azure DevOps API Integration

For each project, use the Azure DevOps REST API to:
- Fetch the latest build for the master branch and the given definitionId
- Fetch the last 100 changes for that build, then display the latest 10 by timestamp
- Use a Personal Access Token (PAT) for authentication, passed in the Authorization header as Basic auth
- Handle loading and error states gracefully

---

## 7. Professional UI/UX

- Ensure all tiles and header elements are visually aligned and spaced
- Use professional color schemes (blues, whites, subtle grays)
- Make the dashboard accessible (aria-labels, alt text for avatars)
- Ensure all links open in a new tab with rel="noopener noreferrer"
- Use tooltips for buttons and avatars

---

## 8. Optional Enhancements

- Allow the user to expand/collapse the PR list for each project tile
- Show a loading indicator while fetching data
- Display avatars for build requesters and PR authors if available
- Make the dashboard easily configurable for other environments (e.g., "Test", "Prod") by changing the filter

---

You can use these prompts with GitHub Copilot or any AI coding assistant to quickly scaffold and style a professional Azure DevOps dashboard React app with all required features and configurations.




Create a react App named 'AzureDeploymentInfoApp' using node.js server

Project Details : Need a dashboard page with tiles & a configuration file so that we can add multiple projects later which contains below information
No Need of server. Just use Azure API Pipeline url:  

Tile - 1
Show Below deatils in Each tile
Project Name: Artemis Web
Last deployment date & time
List of Last 10 PR which are lastest merge in the build

when page loaded create a <token> using window login credinatls and email address: sravan.gampa@ey.com

using const headers = {
  Authorization:  <token>,
  'Content-Type': 'application/json',
};


Need prameter for above URL
Base url: https://dev.azure.com/ 
For definitionId: 3795
Organization Name: 
Project Name: 


Tile - 2
Show Below deatils in Each tile
Project Name: Artemis API
Last deployment date & time
List of Last 10 PR which are lastest merge in the build

