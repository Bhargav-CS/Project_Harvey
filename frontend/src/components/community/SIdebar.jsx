// src/components/community/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './community.css';

const channels = ['general', 'legal-advice', 'case-discussions', 'off-topic'];

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h3>Channels</h3>
            <ul>
                {channels.map((channel, index) => (
                    <li key={index}>
                        <Link to={`/community/${channel}`}>#{channel}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;