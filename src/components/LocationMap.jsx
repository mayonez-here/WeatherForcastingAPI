import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ lat, lon, onLocationChange }) {
  const [position, setPosition] = useState([lat, lon]);

  useEffect(() => {
    setPosition([lat, lon]);
  }, [lat, lon]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      if (onLocationChange) onLocationChange(lat, lng);
    },
  });

  return (
    <Marker position={position}>
      <Popup>
        Selected Location <br />
        Latitude: {position[0].toFixed(4)}, Longitude: {position[1].toFixed(4)}
      </Popup>
    </Marker>
  );
}

export default function LocationMap({ lat, lon, onLocationChange }) {
  if (!lat || !lon) return null;

  return (
    <div className="map-container-fixed"> {/* Only changed this line */}
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker lat={lat} lon={lon} onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
}