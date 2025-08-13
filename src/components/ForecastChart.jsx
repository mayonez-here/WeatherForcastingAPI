import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ForecastChart({ forecast }) {
  if (!forecast?.daily || forecast.daily.length === 0) {
    return <p style={{ textAlign: "center" }}>No forecast data available for chart.</p>;
  }

  // Process data for chart
  const chartData = forecast.daily.map((day) => {
    const date = new Date(day.dt * 1000);
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short' }),
      fullDate: date.toLocaleDateString(),
      temp: typeof day.temp === 'object' ? day.temp.day : day.temp,
      description: day.weather[0]?.description || ""
    };
  });

  // Get theme colors from CSS variables
  const getCssVar = (name) => {
    if (typeof window === 'undefined') return '';
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  };

  const textColor = getCssVar('--text-color') || '#333';
  const gridColor = getCssVar('--grid-stroke') || '#ddd';
  const lineColor = getCssVar('--line-color') || '#ff7300';

  return (
    <div style={{ 
      width: '100%', 
      height: 300,
      backgroundColor: 'var(--card-bg-color)',
      borderRadius: '16px',
      padding: '10px',
      marginBottom: '20px'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            stroke={textColor}
            tick={{ fill: textColor }}
          />
          <YAxis 
            stroke={textColor}
            tick={{ fill: textColor }}
            unit="°C"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg-strong)',
              borderColor: 'var(--border-color)',
              color: textColor,
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value}°C`, "Temperature"]}
            labelFormatter={(label) => {
              const item = chartData.find(d => d.date === label);
              return item ? [`${item.fullDate}`, item.description] : label;
            }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke={lineColor}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}