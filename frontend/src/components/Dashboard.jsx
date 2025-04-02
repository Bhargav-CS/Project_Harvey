import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Dashboard.css";  // Make sure you have the correct styles for the dashboard

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header text-black">
        <h1>Specter.AI</h1>
        <p>Revolutionizing Legal Assistance with AI</p>
      </div>

      <div className="card-container">
        {/* AI Chatbot Integration Card */}
        <div className="card">
          <h3> Harvey</h3>
          <p>
            Harvey is a personalized legal assistant that can answer your legal queries, analyze case law, and assist with document drafting.
          </p>
          <ul>
            <li><strong>Real-time Legal Insights:</strong> Get updates on new laws and precedents.</li>
            <li><strong>Document Drafting:</strong> Create legally sound documents with AI-powered suggestions.</li>
            <li><strong>Case Analysis:</strong> Analyze case law for relevant legal precedents and advice.</li>
          </ul>
          <button 
            className="card-button" 
            onClick={() => navigate("/chatbot")}
          >
            Time to Take Action!
          </button>
        </div>

        {/* Legal Document Storage Card */}
        <div className="card">
          <h3>Legal Document Storage</h3>
          <p>
            Safely store your legal documents with advanced encryption and role-based access control. Specter.AI ensures your sensitive data is always protected.
          </p>
          <ul>
            <li><strong>Encryption:</strong> All documents are encrypted for maximum security.</li>
            <li><strong>Version Control:</strong> Track document changes and maintain version history.</li>
            <li><strong>Role-Based Access:</strong> Control who can access sensitive documents.</li>
          </ul>
        </div>

        {/* Community Platform Card */}
        <div className="card">
          <h3>Community Platform</h3>
          <p>
            A secure space for legal professionals to engage in meaningful discussions, share case insights, and connect with mentors.
          </p>
          <ul>
            <li><strong>Discussion Forums:</strong> Ask questions, share knowledge, and engage with the community.</li>
            <li><strong>Mentorship Matching:</strong> Connect with experienced legal professionals for guidance.</li>
            <li><strong>Peer Reviews:</strong> Review and critique shared case studies to improve legal practices.</li>
          </ul>
          <a href="https://specterai-community.netlify.app" className="card-button" target="_blank" rel="noopener noreferrer">
  Time to Take Action!
</a>
        </div>
      </div>

      {/* Logout Button
      {isAuthenticated && (
        <div className="logout-container">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div> */}
      {/* )} */}
    </div>
  );
};

export default Dashboard;
