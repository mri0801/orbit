import { useEffect, useRef, useState } from "react";

const TYPE_ICON = {
  "Communication": "📡",
  "Navigation": "🧭",
  "Earth Observation": "🌍",
  "Ocean Observation": "🌊",
  "Lunar Orbiter": "🌙",
  "Mars Orbiter": "🔴",
  "Scientific": "🔬",
  "Meteorological": "🌦",
  "Technology Demonstrator": "⚙️",
  "default": "🛰️",
};

const ORBIT_TRACKS = [
  { radiusX: 230, radiusY: 70,  tiltDeg: -15, speed: 0.4   },
  { radiusX: 250, radiusY: 60,  tiltDeg:  20, speed: -0.3  },
  { radiusX: 210, radiusY: 80,  tiltDeg:   5, speed: 0.5   },
  { radiusX: 260, radiusY: 55,  tiltDeg: -30, speed: -0.35 },
  { radiusX: 240, radiusY: 65,  tiltDeg:  40, speed: 0.45  },
  { radiusX: 220, radiusY: 75,  tiltDeg: -10, speed: -0.4  },
  { radiusX: 270, radiusY: 50,  tiltDeg:  60, speed: 0.3   },
  { radiusX: 200, radiusY: 85,  tiltDeg: -50, speed: -0.5  },
  { radiusX: 255, radiusY: 58,  tiltDeg:  35, speed: 0.38  },
  { radiusX: 235, radiusY: 72,  tiltDeg: -25, speed: -0.42 },
];

function SatelliteNode({ sat, trackIndex, initialAngle, onSelect, onHover }) {
  const [angle, setAngle] = useState(initialAngle);
  const animRef  = useRef(null);
  const lastTime = useRef(null);
  const track    = ORBIT_TRACKS[trackIndex % ORBIT_TRACKS.length];

  useEffect(() => {
    const animate = (ts) => {
      if (lastTime.current === null) lastTime.current = ts;
      const delta = (ts - lastTime.current) / 1000;
      lastTime.current = ts;
      setAngle((prev) => prev + track.speed * delta * 30);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [track.speed]);

  const rad    = (angle * Math.PI) / 180;
  const tiltR  = (track.tiltDeg * Math.PI) / 180;
  const rawX   = track.radiusX * Math.cos(rad);
  const rawY   = track.radiusY * Math.sin(rad);
  const x      = rawX * Math.cos(tiltR) - rawY * Math.sin(tiltR);
  const y      = rawX * Math.sin(tiltR) + rawY * Math.cos(tiltR);
  const inFront = y > 0 || Math.abs(rawX) < track.radiusX * 0.3;
  const icon   = TYPE_ICON[sat.type] || TYPE_ICON["default"];

  return (
    <div
      onClick={() => onSelect(sat._id || sat.id)}
      onMouseEnter={() => onHover && onHover(sat._id || sat.id)}
      onMouseLeave={() => onHover && onHover(null)}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        zIndex: inFront ? 20 : 5,
        opacity: inFront ? 1 : 0.35,
        cursor: "pointer",
      }}
    >
      <div className="satellite-img-wrap">
        {sat.imageUrl
          ? <img src={sat.imageUrl} alt={sat.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span className="satellite-icon">{icon}</span>
        }
      </div>
      <div className="satellite-label">{sat.name}</div>
    </div>
  );
}

function CSSEarth() {
   return (
    <div style={{
      position: "absolute",
      left: "50%", top: "50%",
      width: 200, height: 200,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      zIndex: 10,
      overflow: "hidden",
      boxShadow: `
        0 0 0 2px rgba(0,212,255,0.15),
        0 0 40px rgba(0,100,200,0.35),
        0 0 80px rgba(0,212,255,0.12)
      `,
    }}>
      <img 
        src="https://media.tenor.com/0we9sWcmUtYAAAAm/wingedratsecrettag-earth.webp"
        alt="Earth"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Atmosphere() {
  return (
    <div style={{
      position: "absolute",
      left: "50%", top: "50%",
      width: 244, height: 244,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      zIndex: 9,
      background: "radial-gradient(ellipse, transparent 40%, rgba(0,150,255,0.06) 60%, rgba(0,100,200,0.14) 72%, transparent 80%)",
      pointerEvents: "none",
    }} />
  );
}

function OrbitRings({ count }) {
  return (
    <svg
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        zIndex: 6, pointerEvents: "none",
        overflow: "visible",
      }}
      viewBox="0 0 600 520"
      xmlns="http://www.w3.org/2000/svg"
    >
      {ORBIT_TRACKS.slice(0, Math.max(count, 2)).map((t, i) => (
        <ellipse
          key={i}
          cx="300" cy="260"
          rx={t.radiusX} ry={t.radiusY}
          fill="none"
          stroke="rgba(0,212,255,0.1)"
          strokeWidth="1"
          transform={`rotate(${t.tiltDeg}, 300, 260)`}
        />
      ))}
    </svg>
  );
}

export default function Globe({ satellites, onSelectSatellite, onHoverSatellite }) {
  const visible = satellites.slice(0, 5);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        position: "relative",
        width: 600, height: 520,
        flexShrink: 0,
      }}>
        <OrbitRings count={visible.length} />
        <Atmosphere />
        <CSSEarth />

        {visible.map((sat, i) => (
          <SatelliteNode
            key={sat._id || sat.id || i}
            sat={sat}
            trackIndex={i}
            initialAngle={(i * 360) / Math.max(visible.length, 1)}
            onSelect={onSelectSatellite}
            onHover={onHoverSatellite}
          />
        ))}

        {visible.length === 0 && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>🛰️</div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 13,
              color: "var(--text-muted)", letterSpacing: 1,
            }}>No satellites found</div>
          </div>
        )}
      </div>
    </div>
  );
}
