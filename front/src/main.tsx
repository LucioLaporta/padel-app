import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { CourtProvider } from "./context/CourtContext";

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <AuthProvider>
      <CourtProvider>
        <App />
      </CourtProvider>
    </AuthProvider>
  </React.StrictMode>
);
