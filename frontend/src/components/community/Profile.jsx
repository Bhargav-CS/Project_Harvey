// src/components/community/Profile.jsx
import React from 'react';
import './community.css';

const Profile = () => {
    const user = { name: 'John Doe', role: 'Lawyer', avatar: 'https://via.placeholder.com/100' };
    return (
        <div className="profile">
            <img src={user.avatar} alt="Avatar" />
            <h2>{user.name}</h2>
            <p>Role: {user.role}</p>
        </div>
    );
};

export default Profile;
