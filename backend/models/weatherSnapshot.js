const mongoose = require('mongoose');

const weatherSnapshotSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  windSpeed: {
    type: Number
  },
  pressure: {
    type: Number
  },
  feelsLike: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeatherSnapshot', weatherSnapshotSchema);