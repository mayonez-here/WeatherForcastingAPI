import React, { useEffect } from "react";
import { useForecast } from "../hooks/useForecast";
import { useLocationContext } from "../context/LocationContext";
import ForecastChart from "../components/ForecastChart";

export default function SevenDayForecastPage() {
  const { coords } = useLocationContext();
  const { forecast, loading, error, fetchForecast } = useForecast();

  useEffect(() => {
    if (coords.lat && coords.lon) {
      fetchForecast(coords.lat, coords.lon);
    }
  }, [coords, fetchForecast]);

  if (!coords.lat || !coords.lon) {
    return <p style={{ textAlign: "center" }}>No location selected.</p>;
  }

  if (loading) return <p style={{ textAlign: "center" }}>Loading 7-day forecast...</p>;

  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  if (!forecast?.daily || forecast.daily.length === 0) {
    return <p style={{ textAlign: "center" }}>No forecast data available.</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>7-Day Forecast</h1>
      <ForecastChart forecast={forecast} />
      
      {/* Additional daily breakdown */}
      <div style={{ marginTop: 20 }}>
        <h3>Daily Details</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {forecast.daily.map((day) => (
            <li key={day.dt} style={{ 
              marginBottom: 10, 
              padding: 10, 
              backgroundColor: 'var(--card-bg-color)',
              borderRadius: 8
            }}>
              <strong>
                {new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' })}
              </strong>
              <div>Avg Temp: {day.temp.day}°C</div>
              <div>Conditions: {day.weather[0].description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}