**Orbit** — Indian Satellites Explorer is a full-stack web app that lets users browse and explore satellite data with an interactive space-themed interface.

**What it does**
Displays a list of Indian satellites with mission, orbit, launch, and status data
Shows an animated globe visualization of active satellites
Provides filtered views by mission type, orbit type, and status
Supports selecting a satellite to view detailed telemetry and mission info
**Architecture**
Backend: server.js
Express API serving /api/satellites
CRUD endpoints for satellite data
Filtering and sorting support via query params
Uses MongoDB through db.js and Mongoose model satellites.js
**Frontend: orbit-frontend**
React + Vite application
Main pages: Home, Satellite List, Satellite Detail
Components include Globe, Sidebar, RightSidebar, and satellite cards
API integration using Axios
**Key features**
Mission filtering: Communication, Navigation, Earth Observation, Scientific
Orbit filtering: LEO, MEO, GEO, HEO
Satellite status: Active, Inactive, Failed
Search by satellite name
Sort by name or launch date
Interactive globe with hover/click satellite selection
**Tech stack**
Node.js / Express
MongoDB / Mongoose
React 19
Vite
Axios
CORS
Useful note
The backend currently connects to MongoDB via db.js using a hardcoded Atlas URI, so it’s best to move that into an environment variable before production.
