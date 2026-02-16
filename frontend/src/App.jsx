import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [locations, setLocations] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forecasts, setForecasts] = useState({});
  const [expandedLocation, setExpandedLocation] = useState(null);

  // Fetch all locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/locations`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }
      
      const data = await response.json();
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError(err.message || "Failed to load locations");
    }
  };

  const fetchForecast = async (locationId) => {
    try {
      const response = await fetch(`${API_URL}/locations/${locationId}/forecast`);
      if (!response.ok) throw new Error("Failed to load forecast");
      const data = await response.json();
      setForecasts((prev) => ({ ...prev, [locationId]: data }));
    } catch (err) {
      console.error("Error fetching forecast:", err);
      setError(err.message || "Failed to load forecast");
    }
  };

  const addLocation = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to add location");
      }

      setCity("");
      fetchLocations();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id) => {
    try {
      await fetch(`${API_URL}/locations/${id}`, { method: "DELETE" });
      fetchLocations();
      setForecasts((prev) => {
        const newForecasts = { ...prev };
        delete newForecasts[id];
        return newForecasts;
      });
      if (expandedLocation === id) setExpandedLocation(null);
    } catch (err) {
      console.error("Error deleting location:", err);
      setError("Failed to delete location");
    }
  };

  const syncWeather = async (id) => {
    try {
      await fetch(`${API_URL}/locations/${id}/sync`, { method: "POST" });
      fetchLocations();
      fetchForecast(id);
    } catch (err) {
      console.error("Error syncing weather:", err);
      setError("Failed to sync weather");
    }
  };

  const toggleForecast = async (locationId) => {
    if (expandedLocation === locationId) {
      setExpandedLocation(null);
    } else {
      setExpandedLocation(locationId);
      if (!forecasts[locationId]) {
        await fetchForecast(locationId);
      }
    }
  };

  const getWeatherEmoji = (description) => {
    const desc = (description || "").toLowerCase();
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("thunder")) return "⛈️";
    if (desc.includes("drizzle")) return "🌦️";
    if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
    if (desc.includes("wind")) return "💨";
    return "🌤️"; // default
  };

  const groupForecastByDay = (forecastData) => {
    if (!forecastData?.list) return [];
    const dailyForecasts = {};
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });
    return Object.entries(dailyForecasts).slice(0, 5);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Weather Platform</h1>
        <p>Track weather across multiple cities</p>
      </header>

      <main className="main">
        <form onSubmit={addLocation} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., London, UK)"
            className="search-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? "Adding..." : "Add City"}
          </button>
        </form>

        {error && (
          <div className="error" onClick={() => setError("")}>
            {error} <span className="close">×</span>
          </div>
        )}

        <div className="locations-grid">
          {locations.length === 0 ? (
            <div className="empty-state">
              <p>
                No cities added yet. Search for a city above to get started!
              </p>
            </div>
          ) : (
            locations.map((location) => (
              <div key={location._id} className="location-card">
                <div className="card-header">
                  <h2>{location.city}</h2>
                  {location.country && (
                    <span className="country">{location.country}</span>
                  )}
                </div>

                <div className="card-body">
                  <div className="coordinates">
                    <span>
                      Location: {location.lat?.toFixed(2)}°,{" "}
                      {location.lon?.toFixed(2)}°
                    </span>
                  </div>

                  {location.lastSynced && (
                    <div className="last-synced">
                      Last synced:{" "}
                      {new Date(location.lastSynced).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => toggleForecast(location._id)}
                    className="forecast-btn"
                  >
                    {expandedLocation === location._id
                      ? "Hide Forecast"
                      : "5-Day Forecast"}
                  </button>
                  <button
                    onClick={() => syncWeather(location._id)}
                    className="sync-btn"
                  >
                    Sync Weather
                  </button>
                  <button
                    onClick={() => deleteLocation(location._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>

                {expandedLocation === location._id &&
                  forecasts[location._id] && (
                    <div className="forecast-section">
                      <h3>5-Day Weather Forecast</h3>
                      {groupForecastByDay(forecasts[location._id]).map(
                        ([date, dayForecasts]) => (
                          <div key={date} className="forecast-day">
                            <h4>{date}</h4>
                            <div className="forecast-items">
                              {dayForecasts.map((item, index) => (
                                <div key={index} className="forecast-item">
                                  <span className="time">
                                    {new Date(
                                      item.dt * 1000
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  <span className="temp">
                                    {Math.round(item.main.temp)}°C
                                  </span>
                                  <span className="desc">
                                    {getWeatherEmoji(
                                      item.weather[0]?.description
                                    )}{" "}
                                    {item.weather[0]?.description}
                                  </span>
                                  <span className="humidity">
                                    {item.main.humidity}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
