const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchSatellites(params = {}) {
  const query = new URLSearchParams();
  if (params.type && params.type !== "All Types") query.set("type", params.type);
  if (params.missionType && params.missionType !== "All Types") query.set("missionType", params.missionType);
  if (params.status && params.status !== "All Statuses") query.set("status", params.status);
  if (params.orbitType && params.orbitType !== "All Orbits") query.set("orbitType", params.orbitType);
  if (params.search) query.set("search", params.search);
  if (params.sortBy) query.set("sortBy", params.sortBy);

  const res = await fetch(`${BASE_URL}/satellites?${query.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch satellites: ${res.status}`);
  return res.json();
}

export async function fetchSatelliteById(id) {
  const res = await fetch(`${BASE_URL}/satellites/${id}`);
  if (!res.ok) throw new Error(`Satellite not found: ${res.status}`);
  return res.json();
}

export async function fetchSatelliteStats() {
  const res = await fetch(`${BASE_URL}/satellites/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
