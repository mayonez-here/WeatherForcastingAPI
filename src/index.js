import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from './ErrorBoundary';
ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
