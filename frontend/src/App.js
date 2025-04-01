import "./App.css";

import React  from "react";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import CommunityHome from './components/community/CommunityHome';
import ChatWindow from './components/community/ChatWindow';
import Profile from './components/community/Profile';


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
        <Route path="/community" element={<CommunityHome />} />
        <Route path="/community/:channelId" element={<ChatWindow />} />
        <Route path="/community/profile" element={<Profile />} />
        
      </Routes>
      <DisclaimerPopup/>
    </div>
    
  );
}

export default App;
