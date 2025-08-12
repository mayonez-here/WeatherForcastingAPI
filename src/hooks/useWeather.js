import { useState } from "react";

const API_KEY = "80ea735015cd0b875e634f260f4c871b";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);   // <-- new AQI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeatherByCoords(lat, lon) {
    setLoading(true);
    setError("");
    try {
      // Fetch current weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!weatherRes.ok) throw new Error("Failed to fetch weather");
      const weatherData = await weatherRes.json();

      // Fetch AQI data
      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (!aqiRes.ok) throw new Error("Failed to fetch AQI");
      const aqiData = await aqiRes.json();

      setWeather(weatherData);
      setAqi(aqiData.list[0]);  // AQI data is in list[0]
      return weatherData;
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setAqi(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherByCity(city) {
    setLoading(true);
    setError("");
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!weatherRes.ok) throw new Error("Failed to fetch weather");
      const weatherData = await weatherRes.json();

      // Also fetch AQI by coordinates from weather data
      const { lat, lon } = weatherData.coord;
      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (!aqiRes.ok) throw new Error("Failed to fetch AQI");
      const aqiData = await aqiRes.json();

      setWeather(weatherData);
      setAqi(aqiData.list[0]);
      return weatherData;
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setAqi(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    weather,
    aqi,
    loading,
    error,
    fetchWeatherByCoords,
    fetchWeatherByCity,
  };
}
