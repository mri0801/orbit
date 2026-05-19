# Orbit — Indian Satellites Explorer

## Project Structure

```
orbit-app/
├── src/
│   ├── App.jsx                    # Root component with page routing
│   ├── styles/
│   │   └── global.css             # Full design system (space theme)
│   ├── api/
│   │   └── satellites.js          # API service (fetch wrappers)
│   ├── components/
│   │   ├── Sidebar.jsx            # Filters, search, charts
│   │   └── Globe.jsx              # Animated 3D-look Earth + orbiting satellites
│   └── pages/
│       ├── HomePage.jsx           # Main page layout
│       └── SatelliteDetailPage.jsx # Detail view for a single satellite
│
└── backend/
    ├── models/
    │   └── Satellite.js           # Mongoose schema
    └── routes/
        └── satellites.js          # Express API routes
```

## Setup

### Frontend (React + Vite)

```bash
npm create vite@latest orbit-frontend -- --template react
cd orbit-frontend
# Copy src/ files from this project
npm install
```

Create `.env` in your frontend root:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### Backend (Express + MongoDB)

```bash
npm install express mongoose cors dotenv
```

In your `server.js`:
```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/satellites', require('./routes/satellites'));

app.listen(5000, () => console.log('Server running on port 5000'));
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/satellites` | List all — supports `?type=`, `?status=`, `?orbitType=`, `?search=`, `?sortBy=` |
| GET | `/api/satellites/stats` | Aggregated counts by type and status |
| GET | `/api/satellites/:id` | Full details for one satellite |

## Satellite Data Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `type` | Enum | Communication, Navigation, Earth Observation, etc. |
| `status` | Enum | Active, Inactive, Standby, Decommissioned |
| `launchDate` | Date | |
| `launchVehicle` | String | e.g. PSLV-C11 |
| `orbitType` | Enum | LEO, MEO, GEO, HEO, Lunar, Interplanetary |
| `missionType` | String | Free text mission category |
| `state` | String | e.g. Operational, Extended Mission |
| `description` | String | Mission overview |
| `imageUrl` | String | Optional satellite image URL |
| `agency` | String | Default: ISRO |

## Globe Behaviour

- Up to **10 satellites** are rendered on the globe at once (the first 10 after filtering).  
  You can raise this limit in `Globe.jsx` by changing `satellites.slice(0, 10)`.
- Each satellite orbits on its own elliptical track at a different tilt and speed.
- **Hover** → satellite icon grows + name label appears.
- **Click** → navigates to the detail page for that satellite.
- Satellites "behind" the Earth are rendered at 35% opacity automatically.
