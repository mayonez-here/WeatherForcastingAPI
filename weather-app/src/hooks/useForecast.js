import { useState, useRef, useCallback } from "react";

const API_KEY = "80ea735015cd0b875e634f260f4c871b";

export function useForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastCoordsRef = useRef({ lat: null, lon: null });

  const fetchForecast = useCallback(async (lat, lon, { force = false } = {}) => {
    if (!lat || !lon) return null;

    // Avoid redundant fetches unless forced or coords changed
    if (
      !force &&
      lastCoordsRef.current.lat === lat &&
      lastCoordsRef.current.lon === lon &&
      forecast
    ) {
      return forecast;
    }

    setLoading(true);
    setError("");

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const res = await fetch(url);
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch forecast");
      }

      const rawData = await res.json();

      // Build daily summaries (average temps + most common description)
      const dailyMap = {};
      rawData.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyMap[date]) {
          dailyMap[date] = { 
            temps: [], 
            descriptions: [], 
            dt: entry.dt 
          };
        }
        dailyMap[date].temps.push(entry.main.temp);
        dailyMap[date].descriptions.push(entry.weather[0].description);
      });

      const daily = Object.keys(dailyMap)
        .slice(0, 7) // At most 7 days
        .map((date) => {
          const temps = dailyMap[date].temps;
          const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
          return {
            dt: Math.floor(new Date(date).getTime() / 1000),
            temp: { day: parseFloat(avgTemp.toFixed(1)) },
            weather: [{ description: mostCommon(dailyMap[date].descriptions) }],
          };
        });

      // Build next 12 hours from 3-hourly entries (next 4 items)
      const now = Math.floor(Date.now() / 1000);
      const upcoming = rawData.list
        .filter((entry) => entry.dt >= now) // Future entries
        .slice(0, 4); // Next 4x3h = 12 hours

      const hourly12 = upcoming.map((entry) => ({
        dt: entry.dt,
        temp: entry.main.temp,
        weather: entry.weather,
      }));

      const result = { 
        daily, 
        hourly12, 
        raw: rawData 
      };
      
      setForecast(result);
      lastCoordsRef.current = { lat, lon };
      return result;
    } catch (err) {
      setError(err.message || String(err));
      setForecast(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [forecast]);

  function mostCommon(arr = []) {
    const freq = {};
    let max = 0;
    let common = arr[0] || null;
    for (const v of arr) {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > max) {
        max = freq[v];
        common = v;
      }
    }
    return common;
  }

  return {
    forecast,
    loading,
    error,
    fetchForecast,
  };
}