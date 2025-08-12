import React from "react";

export default function ForecastDisplay({ forecast }) {
  if (!forecast) return null;

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="forecast-display">
      <h2>7-Day Forecast</h2>
      <div className="forecast-daily-list">
        {forecast.daily.slice(0, 7).map((day) => (
          <div key={day.dt} className="forecast-day-card">
            <p>{formatDate(day.dt)}</p>
            <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
              {typeof day.temp === 'object' ? day.temp.day : day.temp}°C
            </p>
            <p style={{ fontSize: '0.9em' }}>
              {day.weather[0]?.description}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '20px' }}>Hourly Forecast (Next 12 Hours)</h2>
      <div className="forecast-hourly-list">
        {forecast.hourly12.map((hour) => (
          <div key={hour.dt} className="forecast-hour-card">
            <p>{formatTime(hour.dt)}</p>
            <p style={{ fontWeight: 'bold' }}>{hour.temp}°C</p>
            <p style={{ fontSize: '0.8em' }}>
              {hour.weather[0]?.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}