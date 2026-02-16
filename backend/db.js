const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    
    return { locations: [] };
  }
};


const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};


const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const db = {
  
  getLocations: () => {
    const data = readDB();
    return data.locations;
  },

  
  getLocationById: (id) => {
    const data = readDB();
    return data.locations.find((loc) => loc._id === id);
  },

  
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
