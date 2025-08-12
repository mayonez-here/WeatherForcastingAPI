import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { LocationProvider } from "./context/LocationContext";
import SearchPage from "./pages/SearchPage";
import SevenDayForecastPage from "./pages/SevenDayForecastPage";
import HourlyForecastPage from "./pages/HourlyForecastPage";
import Footer from './components/Footer';
import './App.css';
import './MobileOverrides.css';

export default function App() {
  const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
  const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_KEY;

  const [data, setData] = useState(null);
  const [bgImage, setBgImage] = useState("");
  const [location, setLocation] = useState({ lat: 40.7128, lon: -74.006 });
  const [theme, setTheme] = useState("light");

  // All functions should be consistently defined with const + useCallback
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }, [API_KEY, location.lat, location.lon]);

  const updateBackgroundImage = useCallback(async (cityName) => {
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
  }, [UNSPLASH_ACCESS_KEY]);

  const handleLocationChange = useCallback((lat, lon) => {
    setLocation({ lat, lon });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    fetchData().then(result => setData(result));
  }, [fetchData]);

  useEffect(() => {
    updateBackgroundImage("New York City");
  }, [updateBackgroundImage]);

  if (!data) return <div>Loading...</div>;

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
      <div style={{ 
    marginTop: "auto", 
    padding: "1.5rem 0",
    background: "var(--card-bg-color)",
    borderTop: "1px solid var(--border-color)"
  }}>
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      marginBottom: "0.8rem"
    }}>
      {/* GitHub (Purple) */}
      <a href="https://github.com/mayonez-here" target="_blank" rel="noopener noreferrer"
        style={{
          color: "#6e5494",
          fontSize: "2rem",
          transition: "all 0.3s ease",
          filter: "drop-shadow(0 0 5px rgba(110, 84, 148, 0))"
        }}
        onMouseEnter={e => e.currentTarget.style.filter = "drop-shadow(0 0 10px rgba(110, 84, 148, 0.7))"}
        onMouseLeave={e => e.currentTarget.style.filter = "drop-shadow(0 0 5px rgba(110, 84, 148, 0))"}
      >
        <i className="fab fa-github"></i>
      </a>

      {/* LinkedIn (Blue) */}
      <a href="https://linkedin.com/in/mohd-shonez-aa42b2289" target="_blank" rel="noopener noreferrer"
        style={{
          color: "#0a66c2",
          fontSize: "2rem",
          transition: "all 0.3s ease",
          filter: "drop-shadow(0 0 5px rgba(10, 102, 194, 0))"
        }}
        onMouseEnter={e => e.currentTarget.style.filter = "drop-shadow(0 0 10px rgba(10, 102, 194, 0.7))"}
        onMouseLeave={e => e.currentTarget.style.filter = "drop-shadow(0 0 5px rgba(10, 102, 194, 0))"}
      >
        <i className="fab fa-linkedin"></i>
      </a>

      {/* Instagram (Pink/Orange Gradient) */}
      <a href="https://instagram.com/intricate_kestrel" target="_blank" rel="noopener noreferrer"
        style={{
          background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          fontSize: "2rem",
          transition: "all 0.3s ease",
          filter: "drop-shadow(0 0 5px rgba(214, 36, 159, 0))"
        }}
        onMouseEnter={e => e.currentTarget.style.filter = "drop-shadow(0 0 10px rgba(214, 36, 159, 0.5))"}
        onMouseLeave={e => e.currentTarget.style.filter = "drop-shadow(0 0 5px rgba(214, 36, 159, 0))"}
      >
        <i className="fab fa-instagram"></i>
      </a>
    </div>
    <p style={{ 
      textAlign: "center", 
      color: "var(--text-color)",
      margin: "0.5rem 0 0"
    }}> 
      Weather Data {new Date().getFullYear()}  © OpenWeatherMap API | Designed & Built by Mohd Shonez
    </p>
  </div>
      


    </LocationProvider>
     
  );
}
