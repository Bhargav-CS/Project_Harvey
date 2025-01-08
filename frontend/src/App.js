import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import ChatbotUI from "./Chatbot"; // Import the chatbot component
import "./App.css"; // Add CSS file for styling

const App = () => {
  return (
    <Router>
      <div className="App">
        <div className="app-container">
          <h1>"Harvey Specter. I don't lose. Period."</h1>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chatbot" element={<ChatbotUI />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
