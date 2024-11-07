import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";

const clientId =
  "425472986303-ik9s00kvanojru5i9hso7kue14mk39eh.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
