const express = require("express");
require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

const cors = require("cors");
app.use(cors());

const satelliteRoutes = require("./routes/satelliteRoutes");
app.use("/api/satellites", satelliteRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

