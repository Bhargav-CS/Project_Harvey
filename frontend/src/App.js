import "./App.css";

import React  from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {default as DisclaimerPopup} from './components/DisclaimerPopup.jsx';

import Contact from "./components/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Services from "./components/Services.jsx";
import About from "./components/About.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/Signup.jsx";
import ChatbotUI from "./components/Chatbot.jsx";


const PrivateRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/login" />; // Redirect if not logged in
};

function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/about" element={ < About  />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatbot" element={<ChatbotUI />} />
        
      </Routes>
      <DisclaimerPopup/>
    </div>
    
  );
}

export default App;
