import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PageTransitionProvider } from "./hooks/usePageTransition";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PageTransitionProvider>
      <App />
    </PageTransitionProvider>
  </React.StrictMode>,
);
