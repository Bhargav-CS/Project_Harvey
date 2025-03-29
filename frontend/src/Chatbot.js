import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FaPaperclip, FaImage } from "react-icons/fa"; // Paperclip and Image icons
import "./Chatbot.css"; // For custom styles

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [file, setFile] = useState(null);

  // New state for sidebar
  const [previousCases, setPreviousCases] = useState([
    "The People v. Humdard Dawakhana",
  ]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() && !file) return;

    // Add the user's message to the chat
    const newUserMessage = { text: userInput, sender: "user" };
    setMessages([...messages, newUserMessage]);

    // Clear the input field and file preview
    setUserInput("");
    setFile(null);

    try {
      // Make API call to get bot response
      // const response = await axios.post("http://localhost:8000/query", {
      const response = await axios.post("https://1109-2409-40c4-1c-f244-1d8a-6e93-5632-a442.ngrok-free.app/query", {
        messages: [
          ...messages.map((msg) => ({ role: msg.sender, content: msg.text })),
          { role: "user", content: userInput },
        ],
      });

      const botMessage = {
        text: response.data.answer,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  // Update previous cases only when a message is sent
  useEffect(() => {
    if (messages.length > 1) {  // Avoid updating when the component mounts
      setPreviousCases((prevCases) => [
        ...prevCases,
        `${messages[messages.length - 1].text}`,
      ]);
    }
  }, [messages]);  // Dependency on messages

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setShowUploadOptions(false); // Close options after selecting a file
  };

  return (
    <div className="chatbot-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Previous Cases</h2>
        <ul className="case-list">
          {previousCases.map((caseItem, index) => (
            <li key={index} className="case-item">
              {caseItem}
            </li>
          ))}
        </ul>
      </div>

      {/* Chatbox */}
      <div className="chatbox">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}

          {/* File/Image Preview */}
          {file && (
            <div className="file-preview">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="file-image-preview"
                />
              ) : (
                <p>{file.name}</p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <button
            type="button"
            className="attachment-btn"
            onClick={() => setShowUploadOptions(!showUploadOptions)}
          >
            <FaPaperclip />
          </button>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />

          <button type="submit" className="send-button">
            Send
          </button>

          {showUploadOptions && (
            <div className="upload-modal">
              <div className="upload-options">
                <label className="upload-option">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="upload-card">
                    <FaImage className="upload-icon" />
                    <p>Upload Image</p>
                  </div>
                </label>
                <label className="upload-option">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="upload-card">
                    <FaPaperclip className="upload-icon" />
                    <p>Upload File</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatbotUI;