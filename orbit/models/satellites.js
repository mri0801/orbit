  const mongoose = require("mongoose");

  const satelliteSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    launchDate: {
      type: Date,
      required: true
    },
    missionType: {
      type: String,
      enum: ["Communication", "Navigation", "Earth Observation", "Scientific"],
      required: true
    },
    orbitType: {
      type: String,
      enum: ["LEO", "MEO", "GEO", "HEO"],
      required: true
    },
    launchVehicle: {
      type: String,
      default: "Unknown"
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Failed"],
      default: "Active"
    },
    description: {
      type: String,
      trim: true
    },
    images: [{
      type: String
    }]
  }, {
    timestamps: true
  });

  // Export the model
  module.exports = mongoose.model("Satellite", satelliteSchema);