import { useEffect, useState } from "react";
import { fetchSatelliteById } from "../api/satellites";

const TYPE_ICON = {
  "Communication":            "📡",
  "Navigation":               "🧭",
  "Earth Observation":        "🌍",
  "Scientific":               "🔬",
};

const STATUS_CFG = {
  Active:          { dot: "#39ff85", bg: "rgba(57,255,133,0.08)",  border: "rgba(57,255,133,0.25)",  label: "Active"          },
  Inactive:        { dot: "#ff4757", bg: "rgba(255,71,87,0.08)",   border: "rgba(255,71,87,0.25)",   label: "Inactive"        },
  Standby:         { dot: "#f5a623", bg: "rgba(245,166,35,0.08)",  border: "rgba(245,166,35,0.25)",  label: "Standby"         },
  Decommissioned:  { dot: "#ff4757", bg: "rgba(255,71,87,0.08)",   border: "rgba(255,71,87,0.25)",   label: "Decommissioned"  },
};

const ORBIT_COLORS = {
  LEO:            "#00d4ff",
  MEO:            "#f5a623",
  GEO:            "#39ff85",
  HEO:            "#ff4757",

};

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ── Reusable stat card ─────────────────────────────────────── */
function StatCard({ icon, label, value, accent, style = {} }) {
  return (
    <div style={{
      background: "#0e1e35",
      border: "1px solid rgba(0,212,255,0.08)",
      borderRadius: 10,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...style,
    }}>
      {icon && <div style={{ fontSize: 26, lineHeight: 1 }}>{icon}</div>}
      <div style={{
        fontSize: 9,
        fontFamily: "var(--font-display)",
        letterSpacing: 2,
        color: "#3d6080",
        textTransform: "uppercase",
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: 18,
        fontWeight: 700,
        color: accent || "#00d4ff",
        lineHeight: 1.2,
      }}>
        {value || "—"}
      </div>
    </div>
  );
}

/* ── Timeline row ───────────────────────────────────────────── */
function TLRow({ dot, label, value, valueColor }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "9px 0",
      borderBottom: "1px solid rgba(0,212,255,0.05)",
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: dot || "#00d4ff", flexShrink: 0,
      }} />
      <span style={{ fontSize: 11, color: "#7aa3c8", width: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: valueColor || "#e8f4fd" }}>{value || "—"}</span>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */
export default function SatelliteDetailPage({ satelliteId, onBack }) {
  const [sat, setSat]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchSatelliteById(satelliteId);
        setSat(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [satelliteId]);

  const icon       = sat ? (TYPE_ICON[sat.type] || TYPE_ICON["default"]) : "🛰️";
  const statusCfg  = sat ? (STATUS_CFG[sat.status] || STATUS_CFG["Standby"]) : STATUS_CFG["Standby"];
  const orbitColor = sat ? (ORBIT_COLORS[sat.orbitType] || "#00d4ff") : "#00d4ff";

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#020408",
      overflowY: "auto",
      zIndex: 200,
      fontFamily: "var(--font-body)",
    }}>
      {/* Star field */}
      <div className="star-field" />

      {/* Inner container — max width so it breathes on wide screens */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 32px 60px",
      }}>

        {/* ── Top nav bar ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "20px 0",
          borderBottom: "1px solid rgba(0,212,255,0.08)",
          marginBottom: 40,
        }}>
          <button className="back-btn" onClick={onBack}>← Back to orbit</button>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: 11,
            letterSpacing: 3, color: "#3d6080",
          }}>
            ORBIT / SATELLITE DETAIL
          </span>
        </div>

        {/* ── Loading / Error ── */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" /> Fetching telemetry...
          </div>
        )}
        {error && (
          <div className="error-state">⚠ {error}</div>
        )}

        {sat && (
          <>
            {/* ── Hero header ── */}
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 36,
            }}>
              <div>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
                <h1 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 34, fontWeight: 900,
                  letterSpacing: 2,
                  color: "#e8f4fd",
                  margin: 0,
                }}>
                  {sat.name}
                </h1>

                {/* Badge row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {/* Status */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 14px", borderRadius: 20,
                    background: statusCfg.bg, border: `1px solid ${statusCfg.border}`,
                    fontSize: 11, fontFamily: "var(--font-display)", letterSpacing: 1,
                    color: statusCfg.dot,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusCfg.dot }} />
                    {statusCfg.label}
                  </span>

                  {/* Orbit */}
                  {sat.orbitType && (
                    <span style={{
                      padding: "4px 14px", borderRadius: 20,
                      background: "rgba(0,212,255,0.06)",
                      border: `1px solid ${orbitColor}44`,
                      fontSize: 11, fontFamily: "var(--font-display)", letterSpacing: 1,
                      color: orbitColor,
                    }}>
                      {sat.orbitType}
                    </span>
                  )}

                  {/* Type */}
                  {sat.type && (
                    <span style={{
                      padding: "4px 14px", borderRadius: 20,
                      background: "rgba(245,166,35,0.06)",
                      border: "1px solid rgba(245,166,35,0.2)",
                      fontSize: 11, fontFamily: "var(--font-display)", letterSpacing: 1,
                      color: "#f5a623",
                    }}>
                      {sat.type}
                    </span>
                  )}
                </div>
              </div>

              {/* Mission ID chip */}
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 10,
                letterSpacing: 1, color: "#3d6080",
                background: "#0a1628",
                border: "1px solid rgba(0,212,255,0.06)",
                borderRadius: 8,
                padding: "8px 14px",
                alignSelf: "flex-start",
              }}>
                ID · {sat._id}
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ height: 1, background: "rgba(0,212,255,0.06)", marginBottom: 28 }} />

            {/* ── Top stat cards (3 columns) ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginBottom: 14,
            }}>
              <StatCard icon="🚀" label="Launch vehicle" value={sat.launchVehicle} />
              <StatCard icon="📅" label="Launch date"    value={fmt(sat.launchDate)} accent="#e8f4fd" />
              <StatCard icon="🛸" label="Orbit type"     value={sat.orbitType}       accent={orbitColor} />
            </div>

            {/* ── Second row (2 + 1) ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}>
              {/* Mission timeline card */}
              <div style={{
                background: "#0e1e35",
                border: "1px solid rgba(0,212,255,0.08)",
                borderRadius: 10,
                padding: "18px 20px",
              }}>
                <div style={{
                  fontSize: 9, fontFamily: "var(--font-display)",
                  letterSpacing: 2, color: "#3d6080",
                  textTransform: "uppercase", marginBottom: 10,
                }}>
                  Mission timeline
                </div>
                <TLRow dot="#00d4ff"  label="Launched"     value={`${fmt(sat.launchDate)} · ${sat.launchVehicle || "—"}`} />
                <TLRow dot={statusCfg.dot} label="Current status" value={statusCfg.label} valueColor={statusCfg.dot} />
                {sat.state && (
                  <TLRow dot="#7aa3c8" label="State"       value={sat.state} />
                )}
                <TLRow dot="#3d6080"  label="Record added" value={fmt(sat.createdAt)}  valueColor="#7aa3c8" />
                <TLRow dot="#3d6080"  label="Last updated" value={fmt(sat.updatedAt)}  valueColor="#7aa3c8" />
              </div>

              {/* Agency card */}
              <div style={{
                background: "#0e1e35",
                border: "1px solid rgba(0,212,255,0.08)",
                borderRadius: 10,
                padding: "18px 20px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div style={{
                  fontSize: 9, fontFamily: "var(--font-display)",
                  letterSpacing: 2, color: "#3d6080",
                  textTransform: "uppercase", marginBottom: 10,
                }}>
                  Agency
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28, fontWeight: 900,
                  color: "#00d4ff",
                  letterSpacing: 2,
                }}>
                  {sat.agency || "ISRO"}
                </div>
                <div style={{ fontSize: 11, color: "#3d6080", marginTop: 6 }}>
                  Indian Space Research Organisation
                </div>
              </div>
            </div>

            {/* ── Third row — Mission type + State + extra fields (3 col) ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginBottom: 14,
            }}>
              {sat.missionType && (
                <StatCard icon="🎯" label="Mission type" value={sat.missionType} accent="#f5a623" />
              )}
              {sat.state && (
                <StatCard icon="📶" label="Operational state" value={sat.state} accent="#39ff85" />
              )}
              {sat.altitude && (
                <StatCard icon="📏" label="Altitude (km)" value={`${sat.altitude} km`} accent="#00d4ff" />
              )}
              {sat.inclination && (
                <StatCard icon="📐" label="Inclination" value={`${sat.inclination}°`} accent="#c8a8f0" />
              )}
              {sat.period && (
                <StatCard icon="⏱️" label="Orbital period" value={`${sat.period} min`} accent="#f5a623" />
              )}
            </div>

            {/* ── Description (if present) ── */}
            {sat.description && (
              <div style={{
                background: "#0e1e35",
                border: "1px solid rgba(0,212,255,0.08)",
                borderRadius: 10,
                padding: "20px 24px",
                marginBottom: 14,
              }}>
                <div style={{
                  fontSize: 9, fontFamily: "var(--font-display)",
                  letterSpacing: 2, color: "#3d6080",
                  textTransform: "uppercase", marginBottom: 12,
                }}>
                  Mission overview
                </div>
                <p style={{
                  fontSize: 14, lineHeight: 1.8,
                  color: "#7aa3c8", margin: 0,
                }}>
                  {sat.description}
                </p>
              </div>
            )}

            {/* ── Images (if present) ── */}
            {sat.images && sat.images.length > 0 && (
              <div style={{
                background: "#0e1e35",
                border: "1px solid rgba(0,212,255,0.08)",
                borderRadius: 10,
                padding: "20px 24px",
              }}>
                <div style={{
                  fontSize: 9, fontFamily: "var(--font-display)",
                  letterSpacing: 2, color: "#3d6080",
                  textTransform: "uppercase", marginBottom: 14,
                }}>
                  Gallery
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 10,
                }}>
                  {sat.images.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${sat.name} image ${i + 1}`}
                      style={{
                        width: "100%", aspectRatio: "16/9",
                        objectFit: "cover", borderRadius: 8,
                        border: "1px solid rgba(0,212,255,0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
