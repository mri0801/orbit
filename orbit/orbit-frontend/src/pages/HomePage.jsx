import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import Globe from "../components/Globe";
import { fetchSatellites } from "../api/satellites";

const DEFAULT_FILTERS = {
  search: "",
  type: "All Types",
  status: "All Statuses",
  orbitType: "All Orbits",
  sortBy: "name",
};

export default function HomePage({ onSelectSatellite, onSelectType, onSelectOrbit, onSelectStatus, onSelectSort }) {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [hoveredSatelliteId, setHoveredSatelliteId] = useState(null);

  const loadSatellites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSatellites(filters);
      setSatellites(data);
    } catch (err) {
      setError(err.message);
      setSatellites([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSatellites();
  }, [loadSatellites]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "sortBy") {
      onSelectSort(value);
    }
  };

  // Only pass first 5 satellites to Globe
  const displaySatellites = satellites.slice(0, 5);

  return (
    <>
      <div className="star-field" />
      <Sidebar
        filters={filters}
        onSortSelect={onSelectSort}
        onSelectType={onSelectType}
        onSelectOrbit={onSelectOrbit}
        onSelectStatus={onSelectStatus}
        satellites={satellites}
      />
      <main className="main-canvas">
        <div className="main-header fade-up">
          <h1 className="main-title">All Satellites</h1>
          <p className="main-subtitle">Explore India's space missions in orbit</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            Scanning orbit...
          </div>
        ) : error ? (
          <div className="error-state">⚠ {error}</div>
        ) : (
          <Globe
            satellites={displaySatellites}
            onSelectSatellite={onSelectSatellite}
            onHoverSatellite={setHoveredSatelliteId}
          />
        )}

        <div className="hint-bar">
          <span>Hover satellites for info</span>
          <span className="hint-sep">•</span>
          <span>Click to explore</span>
          <span className="hint-sep">•</span>
          <span>{displaySatellites.length} satellites in view</span>
        </div>
      </main>
      <RightSidebar
        satellites={satellites}
        onSelectSatellite={onSelectSatellite}
        hoveredSatelliteId={hoveredSatelliteId}
      />
    </>
  );
}
