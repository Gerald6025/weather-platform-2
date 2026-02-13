import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './modern.css';

function App() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [error, setError] = useState('');

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/locations');
      setLocations(response.data);
    } catch (err) {
      setError('Failed to fetch locations');
    }
  };

  const addLocation = async (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;

    try {
      await axios.post('/api/locations', { name: newLocation });
      setNewLocation('');
      fetchLocations();
    } catch (err) {
      setError('Failed to add location');
    }
  };

  const deleteLocation = async (id) => {
    try {
      await axios.delete(`/api/locations/${id}`);
      fetchLocations();
    } catch (err) {
      setError('Failed to delete location');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Weather Platform</h1>
        <p>Track weather for your favorite locations</p>
      </header>

      <main className="main-content">
        <section className="add-location">
          <h2>Add Location</h2>
          <form onSubmit={addLocation} className="location-form">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter city name"
              className="location-input"
            />
            <button type="submit" className="add-btn">Add Location</button>
          </form>
        </section>

        {error && <div className="error">{error}</div>}

        <section className="locations">
          <h2>Your Locations</h2>
          {locations.length === 0 ? (
            <p>No locations added yet. Add your first location above!</p>
          ) : (
            <div className="location-grid">
              {locations.map((location) => (
                <div key={location.id} className="location-card">
                  <h3>{location.name}</h3>
                  <p>Temperature: {location.temperature || 'N/A'}°C</p>
                  <p>Humidity: {location.humidity || 'N/A'}%</p>
                  <p>Wind: {location.windSpeed || 'N/A'} km/h</p>
                  <div className="location-actions">
                    <button className="sync-btn">Sync</button>
                    <button className="view-forecast-btn">View Forecast</button>
                    <button 
                      className="delete-btn" 
                      onClick={() => deleteLocation(location.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
