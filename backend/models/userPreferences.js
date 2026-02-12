const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  units: {
    type: String,
    enum: ['metric', 'imperial', 'kelvin'],
    default: 'metric'
  },
  refreshInterval: {
    type: Number,
    default: 300000,
    min: 60000
  },
  autoSync: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: false
    },
    weatherAlerts: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Static method to get or create preferences
userPreferencesSchema.statics.getPreferences = async function() {
  let preferences = await this.findOne();
  if (!preferences) {
    preferences = await this.create({});
  }
  return preferences;
};

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
