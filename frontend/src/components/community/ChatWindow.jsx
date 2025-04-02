// src/components/community/ChatWindow.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './community.css';

const ChatWindow = () => {
    const { channelId } = useParams();
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (message) => {
        setMessages([...messages, { text: message, sender: 'You', timestamp: new Date().toLocaleTimeString() }]);
    };

    return (
        <div className="chat-window">
            <h2>#{channelId}</h2>
            <MessageList messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatWindow;