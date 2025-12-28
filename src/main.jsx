import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerRealtimeListeners } from "./services/realtimeService";

// SOCKET LISTENERS ONLY ONCE
registerRealtimeListeners();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
