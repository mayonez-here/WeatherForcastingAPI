import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { LocationProvider } from "./context/LocationContext";
import SearchPage from "./pages/SearchPage";
import SevenDayForecastPage from "./pages/SevenDayForecastPage";
import HourlyForecastPage from "./pages/HourlyForecastPage";
import './App.css';

export default function App() {
  const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_KEY;
  const [bgImage, setBgImage] = useState("");
  const [location, setLocation] = useState({ lat: 40.7128, lon: -74.006 }); // Default NYC
  const [theme, setTheme] = useState("light");

  async function updateBackgroundImage(cityName) {
    if (!cityName) return;
    
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${cityName} skyline&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      
      if (data?.urls?.full) {
        setBgImage(`${data.urls.full}&w=1920&h=1080&fit=crop`);
      }
    } catch (err) {
      console.error("Error fetching Unsplash image:", err);
    }
  }

  function handleLocationChange(lat, lon) {
    setLocation({ lat, lon });
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // Set initial background for default location
  useEffect(() => {
    updateBackgroundImage("New York City");
  }, []);

  return (
    <LocationProvider>
      <Router>
        <div
          className={`app-container ${theme}`}
          style={{ 
            backgroundImage: bgImage ? `url(${bgImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <nav style={{ marginBottom: 20, display: "flex", justifyContent: "center", gap: 20 }}>
            <Link to="/">Search</Link>
            <Link to="/7day">7-Day Forecast</Link>
            <Link to="/hourly">12-Hour Forecast</Link>
            <button 
              onClick={toggleTheme}
              className="theme-toggle-btn"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </nav>

          <Routes>
    <Route path="/" element={<SearchPage onUpdateBackground={updateBackgroundImage} />} />
    <Route path="/search" element={<SearchPage onUpdateBackground={updateBackgroundImage} />} />
    <Route path="/7day" element={<SevenDayForecastPage />} />
    <Route path="/hourly" element={<HourlyForecastPage />} />
  </Routes>
        </div>
      </Router>
    </LocationProvider>
  );
}