### 1. Project Setup
- Use `create-react-app` to bootstrap the project.
- Organize the project with a `public` folder for static assets and a `src` folder for all React code.
- Place a `projects.config.json` in the `public` folder with an array of project configs, each containing:
  - `organization`, `project`, `definitionId`, `azurePipelineUrl`, `environment`.
  - Include at least 2 dummy configs for each environment (Dev, Test, Prod, UAT, DEV5, etc.).

### 2. Main Dashboard UI
- Main component: `Dashboard.js` in `src/components/`.
- Fetch and filter projects from `projects.config.json` based on selected environment.
- Display a header with the title: `Build Board - Azure DevOps Dashboard` and an environment dropdown.
- Show a grid of project tiles, each displaying:
  - Project name, organization, definition ID, environment
  - Azure Pipeline link
  - Latest build info (number, status, requested by, times, etc.)
  - Last 10 PRs/commits (with author, message, timestamp, commit link)
- Include a refresh button and a user avatar in the header.

### 3. Styling
- Use modern, clean CSS (see `index.css` and inline styles in `Dashboard.js`).
- Responsive grid layout for project tiles.
- Consistent color palette (blues, whites, subtle shadows).

### 4. Config Example (`public/projects.config.json`)
```
[
  { "organization": "demo-org", "project": "TESTApp Web", "definitionId": 3795, "azurePipelineUrl": "https://dev.azure.com/demo-org/TESTAppWeb/_build?definitionId=3795", "environment": "Dev" },
  { "organization": "demo-org", "project": "Dummy Dev Project 2", "definitionId": 4004, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyDev2/_build?definitionId=4004", "environment": "Dev" },
  { "organization": "demo-org", "project": "Dummy Test Project 1", "definitionId": 4005, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyTest1/_build?definitionId=4005", "environment": "Test" },
  { "organization": "demo-org", "project": "Dummy Test Project 2", "definitionId": 4006, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyTest2/_build?definitionId=4006", "environment": "Test" },
  { "organization": "demo-org", "project": "Dummy Prod Project 1", "definitionId": 4007, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyProd1/_build?definitionId=4007", "environment": "Prod" },
  { "organization": "demo-org", "project": "Dummy Prod Project 2", "definitionId": 4008, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyProd2/_build?definitionId=4008", "environment": "Prod" },
  { "organization": "demo-org", "project": "Dummy UAT Project", "definitionId": 4001, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyUAT/_build?definitionId=4001", "environment": "UAT" },
  { "organization": "demo-org", "project": "Dummy UAT Project 2", "definitionId": 4002, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyUAT2/_build?definitionId=4002", "environment": "UAT" },
  { "organization": "demo-org", "project": "Dummy DEV5 Project 1", "definitionId": 4010, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyDEV5/_build?definitionId=4010", "environment": "DEV5" },
  { "organization": "demo-org", "project": "Dummy DEV5 Project 2", "definitionId": 4011, "azurePipelineUrl": "https://dev.azure.com/demo-org/DummyDEV52/_build?definitionId=4011", "environment": "DEV5" }
]
```

### 5. Environment Filtering
- The environment dropdown should be auto-populated from the config file.
- Changing the environment should filter the displayed projects.

### 6. Azure DevOps Integration
- For each project, fetch the latest build and last 10 PRs/commits using Azure DevOps REST APIs.
- Use a Personal Access Token (PAT) for authentication (read from an environment variable or config).
- Show loading and error states.

### 7. Other Files
- `index.css`: Contains global styles for the app (background, font, etc.).
- `index.js`: Entry point, renders the `App` component.
- `App.js`: Main app wrapper, renders the `Dashboard` component.
- `README.md`: Project overview and setup instructions.

---

## Deliverables
- All source code and configs as described above.
- A working, filterable dashboard UI as shown in the sample code.
- Dummy configs for all environments for easy testing.
- Clean, modern CSS and responsive layout.

---

## Notes
- Do not hardcode secrets or PATs in the repo.
- Use environment variables for sensitive data.
- Ensure accessibility for dropdowns, buttons, and links.
- Use semantic HTML and ARIA labels where appropriate.
