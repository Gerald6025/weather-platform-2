const express = require("express");
const router = express.Router();
const db = require("../db");
const { getCurrentWeather, getForecast } = require("../services/weatherService");


// CREATE
router.post("/", async (req, res) => {
  try {
    const weather = await getCurrentWeather(req.body.city);

    const location = db.createLocation({
      city: weather.name,
      country: weather.sys.country,
      lat: weather.coord.lat,
      lon: weather.coord.lon,
      lastSynced: new Date().toISOString()
    });

    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// READ ALL
router.get("/", async (req, res) => {
  try {
    const locations = db.getLocations();
    res.json(locations);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Failed to load locations' });
  }
});


// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = db.updateLocation(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Location not found" });
    res.json(updated);
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = db.deleteLocation(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Location not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error('Error deleting location:', err);
    res.status(500).json({ error: err.message });
  }
});


// MANUAL SYNC
router.post("/:id/sync", async (req, res) => {
  try {
    const location = db.getLocationById(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });

    const weather = await getCurrentWeather(location.city);

    const updated = db.updateLocation(req.params.id, {
      lastSynced: new Date().toISOString()
    });

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5-DAY FORECAST
router.get("/:id/forecast", async (req, res) => {
  try {
    const location = db.getLocationById(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });

    const forecast = await getForecast(location.city);
    res.json(forecast);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
