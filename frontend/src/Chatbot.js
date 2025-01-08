import React, { useState, useEffect } from "react";
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
    "The People v. Nirmala Sitaraman",
    "Koyna Dam v. Ajit dada Pawar",
    "Rajsaheb Thakare v. Waqf Board",
    "Yuzvendra Chahal v. Dhanashree Verma",
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

    // Simulate bot response (Replace with actual backend API call if needed)
    const botMessage = {
      text: `Harvey : ${userInput}`,
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  // Update previous cases only when a message is sent
  useEffect(() => {
    if (messages.length > 1) {  // Avoid updating when the component mounts
      setPreviousCases((prevCases) => [
        ...prevCases,
        `
         ${messages[messages.length - 1].text}`,
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
              {msg.text}
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
