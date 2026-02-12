import { useState, useEffect } from "react";
import axios from "axios";
import "./modern.css";

function App() {
  const [locations, setLocations] = useState([]);
  const [city, setCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preferences, setPreferences] = useState({ units: 'metric' });

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (err) {
      setError("Failed to fetch locations");
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/preferences");
      setPreferences(res.data);
    } catch (err) {
      console.error("Failed to fetch preferences");
    }
  };

  const addCity = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/locations", { city });
      setCity("");
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add city");
    } finally {
      setLoading(false);
    }
  };

  const deleteCity = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/locations/${id}`);
      if (selectedLocation?._id === id) {
        setSelectedLocation(null);
        setForecast(null);
      }
      fetchLocations();
    } catch (err) {
      setError("Failed to delete city");
    } finally {
      setLoading(false);
    }
  };

  const syncWeather = async (id) => {
    setLoading(true);
    setError("");
    try {
      await axios.post(`http://localhost:5000/api/locations/${id}/sync`);
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to sync weather");
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (location) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://localhost:5000/api/locations/${location._id}/forecast`);
      setForecast(res.data);
      setSelectedLocation(location);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch forecast");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (location) => {
    try {
      await axios.put(`http://localhost:5000/api/locations/${location._id}`, {
        isFavorite: !location.isFavorite
      });
      fetchLocations();
    } catch (err) {
      setError("Failed to update favorite status");
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchPreferences();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTemperatureUnit = () => {
    switch (preferences.units) {
      case 'imperial': return '°F';
      case 'kelvin': return 'K';
      default: return '°C';
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('storm') || desc.includes('thunder')) return '⛈️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    if (desc.includes('wind')) return '💨';
    return '🌤️';
  };

  return (
    <div className="app">
      {/* Animated Cloud Background */}
      <div className="clouds">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>
      
      <header className="header">
        <h1>Weather Tracker</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem', marginBottom: '20px' }}>
          Real-time weather data for your favorite locations
        </p>
        {error && <div className="error">{error}</div>}
      </header>

      <main>
        <section className="add-city">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder=" Enter city name..."
            onKeyPress={(e) => e.key === 'Enter' && addCity()}
            disabled={loading}
          />
          <button onClick={addCity} disabled={loading || !city.trim()} className={loading ? 'loading' : ''}>
            {loading ? 'Adding...' : 'Add City'}
          </button>
        </section>

        <section className="locations">
          <h2>Tracked Locations</h2>
          {locations.length === 0 ? (
            <p>No locations tracked yet. Add a city to get started!</p>
          ) : (
            <div className="location-grid">
              {locations.map(loc => (
                <div key={loc._id} className="location-card">
                  <div className="location-header">
                    <h3>{loc.city} ({loc.country})</h3>
                    <button
                      className={`favorite-btn ${loc.isFavorite ? 'favorite' : ''}`}
                      onClick={() => toggleFavorite(loc)}
                      title="Toggle favorite"
                    >
                      {loc.isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  
                  {loc.lastSynced && (
                    <p className="last-sync">
                      Last synced: {formatDate(loc.lastSynced)}
                    </p>
                  )}
                  
                  <div className="location-actions">
                    <button onClick={() => fetchForecast(loc)} disabled={loading} className={loading && selectedLocation?._id === loc._id ? 'loading' : ''}>
                      {loading && selectedLocation?._id === loc._id ? 'Loading...' : 'View Forecast'}
                    </button>
                    <button onClick={() => syncWeather(loc._id)} disabled={loading} className={loading ? 'loading' : ''}>
                      {loading ? 'Syncing...' : 'Sync Weather'}
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => deleteCity(loc._id)} 
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedLocation && forecast && (
          <section className="forecast">
            <h2>5-Day Forecast for {selectedLocation.city}</h2>
            <div className="forecast-grid">
              {(() => {
                // Get unique days from forecast data
                const uniqueDays = [];
                const seenDates = new Set();
                
                forecast.list.forEach(item => {
                  const date = new Date(item.dt * 1000).toDateString();
                  if (!seenDates.has(date) && uniqueDays.length < 5) {
                    seenDates.add(date);
                    uniqueDays.push(item);
                  }
                });
                
                return uniqueDays.map((item, index) => (
                  <div key={index} className="forecast-card">
                    <p className="forecast-date">
                      {new Date(item.dt * 1000).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="weather-icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>
                      {getWeatherIcon(item.weather[0].description)}
                    </div>
                    <p className="forecast-temp">
                      {Math.round(item.main.temp)}{getTemperatureUnit()}
                    </p>
                    <p className="forecast-desc">
                      {item.weather[0].description}
                    </p>
                    <p className="forecast-humidity">
                      💧 {item.main.humidity}%
                    </p>
                  </div>
                ));
              })()}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
