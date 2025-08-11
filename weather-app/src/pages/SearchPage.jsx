// src/pages/SearchPage.jsx
import React from "react";
import SearchBar from "../components/SearchBar";
import WeatherDisplay from "../components/WeatherDisplay";
import Alerts from "../components/Alerts";
import LocationMap from "../components/LocationMap";
import Loader from "../components/Loader";
import { useWeather } from "../hooks/useWeather";
import { useForecast as useForecastHook } from "../hooks/useForecast";
import { useLocationContext } from "../context/LocationContext";

export default function SearchPage({ onUpdateBackground }) {
  // Get location from context
  const { coords: contextCoords, setCoords: setContextCoords } = useLocationContext();
  
  // Weather hook
  const {
    weather,
    aqi,
    loading: weatherLoading,
    error: weatherError,
    fetchWeatherByCity,
    fetchWeatherByCoords,
  } = useWeather();

  // Forecast hook
  const internalForecast = useForecastHook();

  async function handleCitySearch(city) {
    if (!city) return;
    try {
      // Resolve city -> weather (which includes coords)
      const weatherData = await fetchWeatherByCity(city);
      if (weatherData?.coord) {
        const { lat, lon } = weatherData.coord;
        
        // Update context instead of local state
        setContextCoords({ lat, lon });
        
        // Fetch forecast
        await internalForecast.fetchForecast(lat, lon);

        // Update background image
        if (typeof onUpdateBackground === "function") {
          try {
            onUpdateBackground(city);
          } catch (err) {
            console.error("onUpdateBackground failed:", err);
          }
        }
      }
    } catch (err) {
      console.error("handleCitySearch error:", err);
    }
  }

  async function handleLocationChange(lat, lon) {
    if (!lat || !lon) return;
    
    // Update context instead of local state
    setContextCoords({ lat, lon });

    try {
      // Fetch weather by coords
      const weatherData = await fetchWeatherByCoords(lat, lon);
      if (weatherData?.coord) {
        // Fetch forecast
        await internalForecast.fetchForecast(lat, lon);

        // Try to reverse-geocode a city name for background update
        if (typeof onUpdateBackground === "function") {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            const cityName =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.village ||
              data?.address?.hamlet ||
              data?.address?.county ||
              "";
            if (cityName) onUpdateBackground(cityName);
          } catch (err) {
            console.warn("Reverse geocode failed:", err);
          }
        }
      }
    } catch (err) {
      console.error("handleLocationChange error:", err);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Search Weather by City
      </h1>

      <div className="searchbar-container search-bar-original">

      <SearchBar onSearch={handleCitySearch} />
</div>


      {(weatherLoading || internalForecast.loading) && <Loader />}

      {(weatherError || internalForecast.error) && (
        <p style={{ color: "red" }}>{weatherError || internalForecast.error}</p>
      )}

      {/* WeatherDisplay shows the current weather */}
      {weather && <WeatherDisplay weather={weather} aqi={aqi} />}

      {contextCoords && (
  <div style={{ 
    width: "94%", // Slightly less than full width
    maxWidth: "800px", // Matches your design system
    height: "400px",
    margin: "20px auto", // Vertical | Horizontal centering
    // border: "2px solid rgba(0,0,0,0.1)", // Visual debug
    position: "relative", // For child positioning,

  }}>
    <LocationMap
      lat={contextCoords.lat}
      lon={contextCoords.lon}
      onLocationChange={handleLocationChange}
    />
  </div>
)}

      {/* Alerts (from forecast if available) */}
      {internalForecast.forecast?.alerts?.length > 0 && (
        <Alerts alerts={internalForecast.forecast.alerts} />
      )}

      {/* Map - now only uses context coordinates */}

      
      {/* {contextCoords && (
        <div style={{ marginTop: 20 }}>
          <LocationMap
            lat={contextCoords.lat}
            lon={contextCoords.lon}
            onLocationChange={handleLocationChange}
          />
        </div>
      )} */}
    </div>
  );
}