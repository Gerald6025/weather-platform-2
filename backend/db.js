const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

// Helper to read from JSON file
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return default structure
    return { locations: [] };
  }
};

// Helper to write to JSON file
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const db = {
  // Get all locations
  getLocations: () => {
    const data = readDB();
    return data.locations;
  },

  // Get location by ID
  getLocationById: (id) => {
    const data = readDB();
    return data.locations.find((loc) => loc._id === id);
  },

  // Create location
  createLocation: (location) => {
    const data = readDB();
    const newLocation = {
      _id: generateId(),
      ...location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.locations.push(newLocation);
    writeDB(data);
    return newLocation;
  },

  // Update location
  updateLocation: (id, updates) => {
    const data = readDB();
    const index = data.locations.findIndex((loc) => loc._id === id);
    if (index === -1) return null;

    data.locations[index] = {
      ...data.locations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeDB(data);
    return data.locations[index];
  },

  // Delete location
  deleteLocation: (id) => {
    const data = readDB();
    const index = data.locations.findIndex((loc) => loc._id === id);
    if (index === -1) return false;

    data.locations.splice(index, 1);
    writeDB(data);
    return true;
  },
};

module.exports = db;
