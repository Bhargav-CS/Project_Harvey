// src/components/community/MessageList.jsx
import React from 'react';
import './community.css';

const MessageList = ({ messages }) => {
    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <div key={index} className="message">
                    <strong>{msg.sender}</strong>: {msg.text} <span className="timestamp">{msg.timestamp}</span>
                </div>
            ))}
        </div>
    );
};

export default MessageList;