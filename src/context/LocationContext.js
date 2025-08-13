import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [coords, setCoords] = useState(() => {
    // Try to get saved location from localStorage
    const saved = localStorage.getItem('weatherLocation');
    return saved ? JSON.parse(saved) : { lat: 40.7128, lon: -74.006 }; // Default NYC
  });

  // Save to localStorage whenever coords change
  useEffect(() => {
    localStorage.setItem('weatherLocation', JSON.stringify(coords));
  }, [coords]);

  return (
    <LocationContext.Provider value={{ coords, setCoords }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}