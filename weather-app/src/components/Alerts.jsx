// src/components/Alerts.jsx
import React from "react";


export default function Alerts({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="alerts-container">
      <h3 className="alerts-title">Weather Alerts</h3>
      {alerts.map((alert, i) => (
        <div key={i} className="alert-item">
          <strong>{alert.event}</strong> <br />
          <small>
            From: {new Date(alert.start * 1000).toLocaleString()} <br />
            To: {new Date(alert.end * 1000).toLocaleString()}
          </small>
          <p>{alert.description}</p>
          {alert.sender_name && <small>Source: {alert.sender_name}</small>}
        </div>
      ))}
    </div>
  );
}

