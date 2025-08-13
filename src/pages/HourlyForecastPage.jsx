import React, { useEffect } from "react";
import { useForecast } from "../hooks/useForecast";
import { useLocationContext } from "../context/LocationContext";
import HourlyForecastChart from "../components/HourlyForecastChart";

export default function HourlyForecastPage() {
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading 12-hour forecast...</p>;

  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  if (!forecast?.hourly12 || forecast.hourly12.length === 0) {
    return <p style={{ textAlign: "center" }}>No hourly forecast data available.</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>Next 12 Hours</h1>
      <HourlyForecastChart forecast={forecast.hourly12} />
      
      {/* Additional hourly breakdown */}
      <div style={{ marginTop: 20 }}>
        <h3>Hourly Details</h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '10px'
        }}>
          {forecast.hourly12.map((hour) => (
            <div key={hour.dt} style={{
              padding: '10px',
              backgroundColor: 'var(--card-bg-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold' }}>
                {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}
              </div>
              <div>{hour.temp}°C</div>
              <div style={{ fontSize: '0.8em' }}>
                {hour.weather[0]?.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}