import { useState, useMemo } from "react";

export default function RightSidebar({ satellites, onSelectSatellite, hoveredSatelliteId }) {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSatellites = useMemo(() => {
    if (!search.trim()) return satellites.slice(0, 5);
    const query = search.toLowerCase();
    return satellites.filter((s) =>
      s.name.toLowerCase().includes(query)
    );
  }, [satellites, search]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return satellites
      .filter((s) => s.name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [satellites, search]);

  const handleSatelliteClick = (satellite) => {
    if (onSelectSatellite) {
      onSelectSatellite(satellite._id || satellite.id);
    }
    setSearch("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (satellite) => {
    if (onSelectSatellite) {
      onSelectSatellite(satellite._id || satellite.id);
    }
    setSearch("");
    setShowSuggestions(false);
  };

  const isHovered = (satellite) => {
    const id = satellite._id || satellite.id;
    return id === hoveredSatelliteId;
  };

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-header">
        <div className="right-sidebar-title">Recent Satellites</div>
        <div className="right-sidebar-count">
          {filteredSatellites.length} of {satellites.length}
        </div>
      </div>

      <div className="right-sidebar-search">
        <input
          className="search-input"
          type="text"
          placeholder="Search satellites..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-list">
            {suggestions.map((satellite) => (
              <div
                key={satellite.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(satellite)}
              >
                {satellite.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="right-sidebar-list">
        {filteredSatellites.length === 0 ? (
          <div className="right-sidebar-empty">
            No satellites found
          </div>
        ) : (
          filteredSatellites.map((satellite) => (
            <div
              key={satellite.id}
              className={`right-sidebar-item ${isHovered(satellite) ? "hovered" : ""}`}
              onClick={() => handleSatelliteClick(satellite)}
            >
              <div className="right-sidebar-item-name">
                {satellite.name}
              </div>
              <div className="right-sidebar-item-type">
                {satellite.missionType || "Unknown"}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}