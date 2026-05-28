import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// ⭐ Import ThemeProvider from Topbar.jsx
import { ThemeProvider } from "./components/Topbar.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider> 
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
