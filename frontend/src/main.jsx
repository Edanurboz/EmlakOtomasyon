import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-nfg02ii4yd3b5isn.us.auth0.com"
    clientId="K2Bp7ckLABCD2zpKrQIss7b4OnBt9a3P"
    authorizationParams={{
      redirect_uri: "http://localhost:5173",
    }}
    audience="http://localhost:3000"
    scope="openid:profile email"
  >
    <MantineProvider>
    <App />
    </MantineProvider>
  </Auth0Provider>
);
