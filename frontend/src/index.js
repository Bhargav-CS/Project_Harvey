import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
 // Ensure dashboard styles are included
  // Ensure chatbot styles are included
 
import reportWebVitals from "./reportWebVitals"; 
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap your root component (App) with BrowserRouter */}
    <App />
  </BrowserRouter>,
  </React.StrictMode>
);
