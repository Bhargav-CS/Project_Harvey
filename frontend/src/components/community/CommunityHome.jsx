// src/components/community/CommunityHome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './SIdebar';
import './community.css';

const CommunityHome = () => {
    return (
        <div className="community-container">
            <Sidebar />
            <div className="community-main">
                <h2>Welcome to the Legal Community</h2>
                <p>Select a channel to start chatting.</p>
            </div>
        </div>
    );
};

export default CommunityHome;