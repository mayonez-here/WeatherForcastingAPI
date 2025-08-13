import React from "react";

function getAqiInfo(aqi) {
  const levels = {
    1: { label: "Good", color: "#4CAF50", advice: "Air quality is good." },
    2: { label: "Fair", color: "#8BC34A", advice: "Air quality is acceptable." },
    3: { label: "Moderate", color: "#FFC107", advice: "Sensitive groups should reduce outdoor activity." },
    4: { label: "Poor", color: "#FF9800", advice: "Everyone should reduce prolonged outdoor exertion." },
    5: { label: "Very Poor", color: "#F44336", advice: "Avoid outdoor activities." }
  };
  return levels[aqi] || {};
}

function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export default function WeatherDisplay({ weather, aqi }) {
  if (!weather) return null;

  const aqiInfo = aqi ? getAqiInfo(aqi.main?.aqi) : null;
  const weatherIconCode = weather.weather[0]?.icon;
  const windSpeedKmh = (weather.wind?.speed * 3.6).toFixed(1);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="weather-display">
      <h2>
        {weather.name}, {weather.sys?.country}
      </h2>
      
      <div className="weather-description">
        {weatherIconCode && (
          <img
            src={getWeatherIcon(weatherIconCode)}
            alt={weather.weather[0]?.description}
            className="weather-icon"
          />
        )}
        <p className="description-text">
          {weather.weather[0]?.description}
        </p>
      </div>
      
      <p className="temp">{Math.round(weather.main?.temp)}°C</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <p>Humidity: {weather.main?.humidity}%</p>
        <p>Wind: {windSpeedKmh} km/h</p>
        <p>Feels like: {Math.round(weather.main?.feels_like)}°C</p>
        <p>Pressure: {weather.main?.pressure} hPa</p>
      </div>
      
      {weather.sys && (
        <div style={{ marginTop: '10px' }}>
          <p>Sunrise: {formatTime(weather.sys.sunrise)}</p>
          <p>Sunset: {formatTime(weather.sys.sunset)}</p>
        </div>
      )}

      {aqiInfo && (
        <div
          className="aqi-info"
          style={{ 
            backgroundColor: aqiInfo.color,
            marginTop: '15px',
            padding: '10px',
            borderRadius: '6px',
            color: '#fff'
          }}
        >
          <strong>Air Quality: {aqi.main.aqi} ({aqiInfo.label})</strong>
          <p style={{ margin: '5px 0 0' }}>{aqiInfo.advice}</p>
        </div>
      )}
    </div>
  );
}