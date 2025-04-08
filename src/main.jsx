import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AppRoutes from "./routes/index";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Reemplaza esto con tu Client ID real de Google
const clientId = "366213858071-nii0no469m5ebv4pq2jug5e5vnt44imv.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </GoogleOAuthProvider>
);
