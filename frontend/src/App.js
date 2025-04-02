import "./App.css";

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { default as DisclaimerPopup } from './components/DisclaimerPopup.jsx';
import Contact from "./components/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Services from "./components/Services.jsx";
import About from "./components/About.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/Signup.jsx";
import ChatbotUI from "./components/Chatbot.jsx";
import CommunityHome from './components/community/CommunityHome';
import ChatWindow from './components/community/ChatWindow';
import Profile from './components/community/Profile';
import AuthCallback from "./components/AuthCallback.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { AuthProvider } from "./AuthContext";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null to indicate loading

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    setIsAuthenticated(!!token); // Set true if token exists, false otherwise
  }, []);

  if (isAuthenticated === null) {
    // Show a loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatbotUI />
              </ProtectedRoute>
            }
          />
          <Route path="/community" element={<CommunityHome />} />
          <Route path="/community/:channelId" element={<ChatWindow />} />
          <Route path="/community/profile" element={<Profile />} />
        </Routes>
        <DisclaimerPopup />
      </div>
    </AuthProvider>
  );
}

export default App;


