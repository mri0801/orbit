import { useState, useEffect } from "react";
import { fetchSatellites } from "../api/satellites";

export default function SatelliteListPage({ filterType, filterValue, onSelectSatellite, onBack }) {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSatellites = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {};
        if (filterType === "type") {
          filters.missionType = filterValue === "All Types" ? "" : filterValue;
        } else if (filterType === "orbit") {
          filters.orbitType = filterValue === "All Orbits" ? "" : filterValue;
        } else if (filterType === "status") {
          filters.status = filterValue === "All Statuses" ? "" : filterValue;
        } else if (filterType === "sort") {
          filters.sortBy = filterValue;
        }
        const data = await fetchSatellites(filters);
        setSatellites(data);
      } catch (err) {
        setError(err.message);
        setSatellites([]);
      } finally {
        setLoading(false);
      }
    };

    if (filterType && filterValue) {
      loadSatellites();
    }
  }, [filterType, filterValue]);

  const handleSatelliteClick = (satellite) => {
    if (onSelectSatellite) {
      onSelectSatellite(satellite._id || satellite.id);
    }
  };

  return (
    <div className="satellite-list-page">
      <div className="satellite-list-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="satellite-list-title">
          {filterType === "sort"
            ? `Satellites sorted by ${filterValue === "launchDate" ? "Launch Date" : "Name"}`
            : `${filterValue} ${filterType === "type" ? "Satellites" : filterType === "orbit" ? "Orbit Satellites" : "Status Satellites"}`}
        </h1>
        <div className="satellite-list-count">
          {satellites.length} satellites
        </div>
      </div>

      <div className="satellite-list-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            Loading satellites...
          </div>
        ) : error ? (
          <div className="error-state">⚠ {error}</div>
        ) : (
          <div className="satellite-list">
            {satellites.length === 0 ? (
              <div className="satellite-list-empty">
                No satellites found{filterType === "sort" ? "" : ` for ${filterValue}`}
              </div>
            ) : (
              satellites.map((satellite) => (
                <div
                  key={satellite.id}
                  className="satellite-list-item"
                  onClick={() => handleSatelliteClick(satellite)}
                >
                  <div className="satellite-list-item-name">
                    {satellite.name}
                  </div>
                  {filterType !== "sort" && (
                    <div className="satellite-list-item-type">
                      {satellite.missionType || "Unknown"}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}