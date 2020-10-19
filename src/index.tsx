import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import AppRoute from "AppRoute/AppRouteComponent";
import ErrorBoundary from "feature/ErrorBoundary/ErrorBoundaryComponent";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRoute />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
