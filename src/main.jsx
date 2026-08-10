import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <App />
        <Toaster position="top-right" />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);