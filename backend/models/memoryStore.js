// Simple in-memory storage for demo purposes
const locations = [];
let snapshots = [];
let preferences = {
  units: 'metric',
  refreshInterval: 300000,
  autoSync: false,
  theme: 'light',
  notifications: {
    enabled: false,
    weatherAlerts: false
  }
};

class Location {
  constructor(data) {
    this._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.city = data.city;
    this.country = data.country || '';
    this.lat = data.lat || 0;
    this.lon = data.lon || 0;
    this.isFavorite = data.isFavorite || false;
    this.lastSynced = data.lastSynced || new Date();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static async create(data) {
    const location = new Location(data);
    locations.push(location);
    return location;
  }

  static async find() {
    return locations;
  }

  static async findById(id) {
    return locations.find(loc => loc._id === id);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    const index = locations.findIndex(loc => loc._id === id);
    if (index !== -1) {
      locations[index] = { ...locations[index], ...data, updatedAt: new Date() };
      return options.new ? locations[index] : locations[index];
    }
    return null;
  }

  static async findByIdAndDelete(id) {
    const index = locations.findIndex(loc => loc._id === id);
    if (index !== -1) {
      const deleted = locations.splice(index, 1)[0];
      // Also delete associated snapshots
      snapshots = snapshots.filter(snap => snap.location !== id);
      return deleted;
    }
    return null;
  }
}

class WeatherSnapshot {
  constructor(data) {
    this._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.location = data.location;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.description = data.description;
    this.windSpeed = data.windSpeed;
    this.pressure = data.pressure;
    this.feelsLike = data.feelsLike;
    this.timestamp = data.timestamp || new Date();
  }

  static async create(data) {
    const snapshot = new WeatherSnapshot(data);
    snapshots.push(snapshot);
    return snapshot;
  }

  static async find(query = {}) {
    let filtered = snapshots;
    if (query.location) {
      filtered = filtered.filter(snap => snap.location === query.location);
    }
    return filtered;
  }

  static async deleteMany(query) {
    if (query.location) {
      snapshots = snapshots.filter(snap => snap.location !== query.location);
    }
    return { deletedCount: snapshots.length };
  }
}

class UserPreferences {
  static async getPreferences() {
    return preferences;
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    preferences = { ...preferences, ...data };
    return { _id: 'preferences', ...preferences };
  }
}

module.exports = { Location, WeatherSnapshot, UserPreferences };
