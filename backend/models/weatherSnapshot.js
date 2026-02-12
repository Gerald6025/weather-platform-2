const mongoose = require('mongoose');

const weatherSnapshotSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true
  },
  temperature: Number,
  humidity: Number,
  description: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WeatherSnapshot", weatherSnapshotSchema);