const express = require("express");
const router = express.Router();

const Satellite = require("../models/satellites");



router.post("/", async (req, res) => {
  try {

    const data = req.body;

    if (Array.isArray(data)) {
      const result = await Satellite.insertMany(data);
      res.status(201).json(result);
    } else {
      const result = await Satellite.create(data);
      res.status(201).json(result);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { type, missionType, status, orbitType, search, sortBy } = req.query;
    
    let query = {};
    
    // Filter by mission type
    if (missionType && missionType !== "All Types") {
      query.missionType = missionType;
    }
    
    // Filter by status
    if (status && status !== "All Statuses") {
      query.status = status;
    }
    
    // Filter by orbit type
    if (orbitType && orbitType !== "All Orbits") {
      query.orbitType = orbitType;
    }
    
    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
  let queryBuilder = Satellite.find(query);

if (sortBy) {
  const sortOptions = {};
  sortOptions[sortBy] = 1;
  queryBuilder = queryBuilder.sort(sortOptions);
}

const satellites = await queryBuilder;
    
    res.json(satellites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const satellite = await Satellite.findById(req.params.id);

    if (!satellite) {
      return res.status(404).send("Satellite not found");
    }

    res.json(satellite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedSatellite = await Satellite.findByIdAndUpdate(
      req.params.id,   // which document
      req.body,        // new data
      { new: true }    // return updated doc
    );

    res.send(updatedSatellite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedSatellite = await Satellite.findByIdAndDelete(req.params.id);

    res.send({
      message: "Satellite deleted successfully",
      data: deletedSatellite
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;