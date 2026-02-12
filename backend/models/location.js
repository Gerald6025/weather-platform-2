const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: String,
  lat: Number,
  lon: Number,
  isFavorite: { type: Boolean, default: false },
  lastSynced: Date
}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);
