import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "./Context/AuthContext.jsx";

const clientId = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </GoogleOAuthProvider>
);
