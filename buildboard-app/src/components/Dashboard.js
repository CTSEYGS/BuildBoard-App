import React, { useEffect, useState } from "react";

const AZURE_DEVOPS_API_BASE = "https://dev.azure.com";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [builds, setBuilds] = useState({});
  const [prs, setPRs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [environment, setEnvironment] = useState("Dev");

  // TODO: Replace with your actual PAT or auth method
  const PAT = process.env.REACT_APP_AZURE_PAT || "";
  const headers = {
    Authorization: `Basic ${btoa(":" + PAT)}`,
    "Content-Type": "application/json",
  };

  const fetchProjectsData = async (env = environment) => {
    try {
      setRefreshing(true);
      setLoading(true);
      setError(null);
      setBuilds({});
      setPRs({});
      const res = await fetch("/projects.config.json");
      const data = await res.json();
      setAllProjects(data);
      const filteredProjects = data.filter((p) => p.environment === env);
      setProjects(filteredProjects);
      await Promise.all(
        filteredProjects.map(async (project) => {
          // Fetch latest build for master branch
          const buildUrl = `${AZURE_DEVOPS_API_BASE}/${project.organization}/${project.project}/_apis/build/builds?definitions=${project.definitionId}&branchName=refs/heads/master&$top=1&api-version=7.1-preview.7`;
          let buildRes, buildData, latestBuild;
          try {
            buildRes = await fetch(buildUrl, { headers });
            buildData = await buildRes.json();
            latestBuild = buildData.value && buildData.value[0];
          } catch (e) {
            latestBuild = null;
          }
          setBuilds((prev) => ({ ...prev, [project.definitionId]: latestBuild }));
          if (latestBuild) {
            // Fetch last 100 changes for that build
            const changesUrl = `${AZURE_DEVOPS_API_BASE}/${project.organization}/${project.project}/_apis/build/builds/${latestBuild.id}/changes?$top=100&api-version=7.1-preview.1`;
            let changesRes, changesData, last10 = [];
            try {
              changesRes = await fetch(changesUrl, { headers });
              changesData = await changesRes.json();
              // Sort by timestamp descending and take latest 10
              last10 = (changesData.value || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
            } catch (e) {
              last10 = [];
            }
            setPRs((prev) => ({ ...prev, [project.definitionId]: last10 }));
          }
        })
      );
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setError("Failed to load dashboard data.");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjectsData(environment);
    // eslint-disable-next-line
  }, [environment]);

  // Get unique environments for dropdown
  const environments = Array.from(new Set(allProjects.map((p) => p.environment)));

  const handleExpand = (defId) => {
    setExpanded((prev) => ({ ...prev, [defId]: !prev[defId] }));
  };

  // Header styles
  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#f7fafd",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: 72,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    borderBottom: "1px solid #e3e8ee",
    minWidth: 320,
  };
  const titleStyle = {
    flex: 1,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 28,
    color: "#1976d2",
    letterSpacing: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const rightStyle = {
    display: "flex",
    alignItems: "center",
    gap: 16,
    minWidth: 120,
    justifyContent: "flex-end",
  };
  const refreshBtnStyle = {
    background: refreshing ? "linear-gradient(90deg, #90caf9 0%, #1976d2 100%)" : "linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 20px",
    cursor: refreshing ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: 16,
    marginRight: 8,
    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
    transition: "background 0.2s, box-shadow 0.2s",
    outline: "none",
  };
  const avatarStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e3e8ee 0%, #bbdefb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#1976d2",
    fontSize: 22,
    marginLeft: 8,
    boxShadow: "0 1px 4px rgba(25, 118, 210, 0.10)",
    border: "2px solid #fff",
  };

  // Responsive grid style
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
    padding: 24,
    width: "100%",
    boxSizing: "border-box",
    alignItems: "stretch",
    justifyItems: "stretch",
    minHeight: "calc(100vh - 72px)",
    background: "#f7fafd",
    transition: "all 0.2s",
  };
  // Tile style
  const tileStyle = {
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 2px 16px rgba(25, 118, 210, 0.10)",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    minHeight: 400,
    maxHeight: 600,
    overflow: "hidden",
    transition: "box-shadow 0.2s",
    border: "1px solid #e3e8ee",
  };
  // Project name style
  const projectNameStyle = {
    background: "linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)",
    borderRadius: "20px 20px 0 0",
    color: "#fff",
    fontWeight: 800,
    fontSize: 22,
    padding: "16px 0 16px 16px",
    margin: "-24px -24px 16px -24px",
    letterSpacing: 0.5,
    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
    textShadow: "0 1px 2px rgba(0,0,0,0.08)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  // Table/text style
  const infoTextStyle = {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
    wordBreak: "break-word",
    lineHeight: 1.6,
  };
  const buildTextStyle = {
    fontSize: 15,
    marginBottom: 8,
    wordBreak: "break-word",
    lineHeight: 1.6,
    color: "#222",
  };
  const prListStyle = {
    maxHeight: 180,
    overflowY: "auto",
    marginTop: 4,
    background: "#f7fafd",
    borderRadius: 10,
    border: "1px solid #e3e8ee",
    boxShadow: "0 1px 4px rgba(25, 118, 210, 0.04)",
    padding: 8,
  };
  const prItemStyle = {
    borderBottom: "1px solid #eee",
    padding: "8px 0",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    color: "#333",
  };
  const prAuthorStyle = {
    color: "#1976d2",
    fontWeight: 600,
    marginRight: 6,
  };

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: 80, fontSize: 22, color: "#1976d2", fontWeight: 600 }}>
      <span style={{ display: "inline-block", marginRight: 12 }}>
        <svg width="32" height="32" viewBox="0 0 50 50" style={{ verticalAlign: "middle" }} aria-label="Loading spinner">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#1976d2" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </span>
      Loading dashboard data...
    </div>
  );
  if (error) return <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>{error}</div>;

  return (
    <div>
      <header style={headerStyle}>
        <div style={{ width: 120 }} />
        <div style={titleStyle}>Azure DevOps Dashboard</div>
        <div style={rightStyle}>
          <select
            value={environment}
            onChange={e => setEnvironment(e.target.value)}
            style={{
              background: "#fff",
              color: "#1976d2",
              border: "1px solid #e3e8ee",
              borderRadius: 8,
              padding: "8px 12px",
              fontWeight: 600,
              fontSize: 16,
              marginRight: 12,
              outline: "none",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(25, 118, 210, 0.04)",
            }}
            aria-label="Select environment"
            title="Select environment"
          >
            {environments.map(env => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
          <button
            style={refreshBtnStyle}
            onClick={refreshing ? undefined : () => fetchProjectsData(environment)}
            aria-label="Refresh dashboard"
            title="Refresh dashboard"
            disabled={refreshing}
            tabIndex={0}
          >
            {refreshing ? "Refreshing..." : "⟳ Refresh"}
          </button>
          <div
            style={avatarStyle}
            title="User avatar"
            aria-label="User avatar"
            tabIndex={0}
          >
            <span role="img" aria-label="avatar">👤</span>
          </div>
        </div>
      </header>
      <div style={gridStyle} aria-label="Project dashboard grid">
        {projects.map((project) => {
          const build = builds[project.definitionId];
          const prList = prs[project.definitionId] || [];
          return (
            <div key={project.definitionId} style={tileStyle} aria-label={`Project tile for ${project.project}`}> 
              <div style={projectNameStyle} title={project.project} aria-label={`Project name: ${project.project}`}>{project.project}</div>
              <div style={{ marginBottom: 8 }}>
                <a
                  href={project.azurePipelineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2", fontWeight: 500 }}
                  aria-label={`Pipeline link for ${project.project}`}
                  title={`Open Azure Pipeline for ${project.project}`}
                >
                  Pipeline Link
                </a>
              </div>
              <div style={infoTextStyle}>
                <b>Definition ID:</b> {project.definitionId} <br />
                <b>Organization:</b> {project.organization} <br />
                <b>Project:</b> {project.project}
              </div>
              {build ? (
                <div style={buildTextStyle}>
                  <b>Build Number:</b> {build.buildNumber} <br />
                  <b>Status:</b> {build.status} <br />
                  <b>Environment:</b> {project.environment} <br />
                  <b>Requested By:</b> {build.requestedFor?.displayName}
                  {build.requestedFor?.imageUrl && (
                    <img
                      src={build.requestedFor.imageUrl}
                      alt={`Avatar for ${build.requestedFor.displayName}`}
                      style={{ width: 24, height: 24, borderRadius: "50%", marginLeft: 8, verticalAlign: "middle" }}
                      aria-label={`Avatar for ${build.requestedFor.displayName}`}
                      title={build.requestedFor.displayName}
                    />
                  )}
                  <br />
                  <b>Start Time:</b> {build.startTime && new Date(build.startTime).toLocaleString()} <br />
                  <b>Queue Time:</b> {build.queueTime && new Date(build.queueTime).toLocaleString()} <br />
                  <b>Last Changed:</b> {build.lastChangedDate && new Date(build.lastChangedDate).toLocaleString()} <br />
                  <b>Build Link:</b> {build._links?.web?.href && (
                    <a href={build._links.web.href} target="_blank" rel="noopener noreferrer" aria-label={`Build link for ${project.project}`}>View Build</a>
                  )}
                  <br />
                  <b>Source Version:</b> {build.sourceVersion} <br />
                  <b>Source Branch:</b> {build.sourceBranch}
                </div>
              ) : (
                <div style={{ color: "#888", fontSize: 14 }}>No build data.</div>
              )}
              <button
                onClick={() => handleExpand(project.definitionId)}
                style={{
                  margin: "12px 0 8px 0",
                  background: "linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow: "0 1px 4px rgba(25, 118, 210, 0.10)",
                  outline: "none",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
                aria-label={expanded[project.definitionId] ? `Hide PRs/Commits for ${project.project}` : `Show PRs/Commits for ${project.project}`}
                title={expanded[project.definitionId] ? `Hide PRs/Commits for ${project.project}` : `Show PRs/Commits for ${project.project}`}
                tabIndex={0}
              >
                {expanded[project.definitionId] ? "Hide PRs/Commits" : "Show PRs/Commits"}
              </button>
              {expanded[project.definitionId] && (
                <div style={prListStyle} aria-label={`Last 10 merged PRs/commits for ${project.project}`}> 
                  {prList.length === 0 ? (
                    <div style={{ color: "#888", fontSize: 14 }}>No PRs/commits found.</div>
                  ) : (
                    <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                      {prList.map((pr) => (
                        <li key={pr.id} style={prItemStyle} aria-label={`Commit ${pr.commitId}`}> 
                          <span style={{ flex: 1 }}>
                            <b>{pr.message}</b>
                            <br />
                            <span style={prAuthorStyle} title={pr.author?.displayName} aria-label={pr.author?.displayName}>
                              {pr.author?.displayName}
                              {pr.author?.imageUrl && (
                                <img
                                  src={pr.author.imageUrl}
                                  alt={`Avatar for ${pr.author.displayName}`}
                                  style={{ width: 20, height: 20, borderRadius: "50%", marginLeft: 6, verticalAlign: "middle" }}
                                  aria-label={`Avatar for ${pr.author.displayName}`}
                                  title={pr.author.displayName}
                                />
                              )}
                            </span>
                            <span style={{ color: "#888" }}>
                              {pr.commitId?.slice(0, 8)}
                            </span>
                            <span style={{ color: "#888", marginLeft: 8 }}>
                              {pr.timestamp && new Date(pr.timestamp).toLocaleString()}
                            </span>
                            {pr.location && (
                              <>
                                {" "}
                                <a href={pr.location} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", marginLeft: 8 }} aria-label={`Commit link for ${pr.commitId}`} title={`Open commit ${pr.commitId}`}>
                                  Commit Link
                                </a>
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
