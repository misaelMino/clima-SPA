
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,   // <- para obtener Access Token usable en backend
      redirect_uri: window.location.origin
    }}
    cacheLocation="localstorage"
    useRefreshTokens
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);
