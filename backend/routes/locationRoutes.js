const express = require("express");
const router = express.Router();
const Location = require("../models/location");
const WeatherSnapshot = require("../models/weatherSnapshot");
const { getCurrentWeather } = require("../services/weatherService");


// CREATE
router.post("/", async (req, res) => {
  try {
    const weather = await getCurrentWeather(req.body.city);

    const location = await Location.create({
      city: weather.name,
      country: weather.sys.country,
      lat: weather.coord.lat,
      lon: weather.coord.lon,
      lastSynced: new Date()
    });

    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// READ ALL
router.get("/", async (req, res) => {
  const locations = await Location.find();
  res.json(locations);
});


// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Location.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});


// DELETE
router.delete("/:id", async (req, res) => {
  await Location.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


// MANUAL SYNC
router.post("/:id/sync", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    const weather = await getCurrentWeather(location.city);

    const snapshot = await WeatherSnapshot.create({
      location: location._id,
      temperature: weather.main.temp,
      humidity: weather.main.humidity,
      description: weather.weather[0].description
    });

    location.lastSynced = new Date();
    await location.save();

    res.json(snapshot);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
