const TYPE_ICONS = {
  "Communication": "📡",
  "Navigation": "🧭",
  "Earth Observation": "🌍",
  "Scientific": "🔬",
};

const STATUS_CONFIG = {
  Active: { cls: "active", label: "Active" },
  Inactive: { cls: "inactive", label: "Inactive" },
  Standby: { cls: "standby", label: "Standby" },
  Decommissioned: { cls: "inactive", label: "Decommissioned" },
};

export default function Sidebar({ filters, onFilterChange, onSelectType, onSelectOrbit, onSelectStatus, satellites, stats }) {
  const typeOptions = ["All Types", ...Object.keys(TYPE_ICONS)];
  const statusOptions = ["All Statuses", "Active", "Inactive", "Standby", "Decommissioned"];
  const orbitOptions = ["All Orbits", "LEO", "MEO", "GEO", "HEO"];
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "launchDate", label: "Launch Date" }
  ];

  // Compute type distribution from current satellites
  const typeCounts = satellites.reduce((acc, s) => {
    const t = s.type || "Other";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const typeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCount = typeEntries[0]?.[1] || 1;

  const statusCounts = satellites.reduce((acc, s) => {
    const st = s.status || "Unknown";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">ORBIT</div>
        <div className="sidebar-tagline">India's Space Missions</div>
        <div className="satellite-count">
          <span className="satellite-count-dot"></span>
          {satellites.length} satellites tracked
        </div>
      </div>

      <div className="sidebar-body">
        {/* Filter by Type */}
        <div className="filter-section">
          <label>Filter by Type</label>
          <div className="select-wrapper">
            <select
              value={filters.type}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue !== "All Types") {
                  onSelectType(selectedValue);
                }
              }}
            >
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter by Status */}
        <div className="filter-section">
          <label>Filter by Status</label>
          <div className="select-wrapper">
            <select
              value={filters.status}
              onChange={(e) => onSelectStatus(e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter by Orbit */}
        <div className="filter-section">
          <label>Orbit Type</label>
          <div className="select-wrapper">
            <select
              value={filters.orbitType}
              onChange={(e) => onSelectOrbit(e.target.value)}
            >
              {orbitOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort */}
        <div className="filter-section">
          <label>Sort by</label>
          <div className="select-wrapper">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>


        {/* Status Distribution */}
        {Object.keys(statusCounts).length > 0 && (
          <div>
            <div className="sidebar-chart-title">Status Distribution</div>
            <div className="status-list">
              {Object.entries(statusCounts).map(([status, count]) => {
                const cfg = STATUS_CONFIG[status] || { cls: "standby", label: status };
                return (
                  <div className="status-row" key={status}>
                    <span className={`status-pill ${cfg.cls}`}>
                      <span className="status-pill-dot"></span>
                      {cfg.label}
                    </span>
                    <span className="status-pill-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
