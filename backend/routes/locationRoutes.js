const express = require("express");
const router = express.Router();
const Location = require("../models/location");
const WeatherSnapshot = require("../models/weatherSnapshot");
const { getCurrentWeather, getForecast } = require("../services/weatherService");
const { asyncHandler } = require("../middleware/errorHandler");


// CREATE
router.post("/", asyncHandler(async (req, res) => {
  const weather = await getCurrentWeather(req.body.city);

  const location = await Location.create({
    city: weather.name,
    country: weather.sys.country,
    lat: weather.coord.lat,
    lon: weather.coord.lon,
    lastSynced: new Date()
  });

  res.status(201).json(location);
}));


// READ ALL
router.get("/", asyncHandler(async (req, res) => {
  const locations = await Location.find();
  res.json(locations);
}));


// UPDATE
router.put("/:id", asyncHandler(async (req, res) => {
  const updated = await Location.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!updated) {
    return res.status(404).json({ error: "Location not found" });
  }
  
  res.json(updated);
}));


// DELETE
router.delete("/:id", asyncHandler(async (req, res) => {
  const location = await Location.findByIdAndDelete(req.params.id);
  
  if (!location) {
    return res.status(404).json({ error: "Location not found" });
  }
  
  // Also delete associated weather snapshots
  await WeatherSnapshot.deleteMany({ location: req.params.id });
  
  res.json({ message: "Location and associated weather data deleted" });
}));


// MANUAL SYNC
router.post("/:id/sync", asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);
  
  if (!location) {
    return res.status(404).json({ error: "Location not found" });
  }

  const weather = await getCurrentWeather(location.city);

  const snapshot = await WeatherSnapshot.create({
    location: location._id,
    temperature: weather.main.temp,
    humidity: weather.main.humidity,
    description: weather.weather[0].description,
    windSpeed: weather.wind?.speed,
    pressure: weather.main.pressure,
    feelsLike: weather.main.feels_like
  });

  location.lastSynced = new Date();
  await location.save();

  res.json(snapshot);
}));

// GET FORECAST
router.get("/:id/forecast", asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);
  
  if (!location) {
    return res.status(404).json({ error: "Location not found" });
  }

  const forecast = await getForecast(location.city);
  res.json(forecast);
}));

// GET WEATHER HISTORY
router.get("/:id/history", asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);
  
  if (!location) {
    return res.status(404).json({ error: "Location not found" });
  }

  const history = await WeatherSnapshot.find({ location: req.params.id })
    .sort({ timestamp: -1 })
    .limit(50); // Limit to last 50 records
  
  res.json(history);
}));

module.exports = router;
