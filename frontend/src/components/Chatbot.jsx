import React, { useState, useEffect } from "react"; // Added useEffect
import axios from "axios"; // Added axios
import { FaPaperclip, FaImage } from "react-icons/fa"; // Paperclip and Image icons
import "./Chatbot.css"; // For custom styles

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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

  const [currentSession, setCurrentSession] = useState([]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() && !file) return;

    const newUserMessage = { text: userInput, sender: "user" };
    setMessages([...messages, newUserMessage]);
    setCurrentSession((session) => [...session, newUserMessage]);

    setUserInput("");
    setFile(null);

    try {
      // Make API call to get bot response
      const response = await axios.post(`${BACKEND_URL}/query`, {
      // const response = await axios.post("https://1109-2409-40c4-1c-f244-1d8a-6e93-5632-a442.ngrok-free.app/query", {
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

  useEffect(() => {
    if (messages.length > 1) { // Avoid updating when the component mounts
      const sessionName = generateSessionName(currentSession); // Defined sessionName
      setPreviousCases((prevCases) => [
        ...prevCases,
        { name: sessionName, messages: [...currentSession] },
      ]);
      setCurrentSession([]); // Reset session for new conversations
    }
  }, [messages]); // Added dependency array

  const saveCurrentSession = () => {
    // Save the current session logic (e.g., to local storage or backend)
    console.log("Saving current session:", currentSession);
  }; // Added saveCurrentSession function

  const startNewChat = () => {
    setMessages([{ text: "Hello! How can I assist you today?", sender: "bot" }]);
    setCurrentSession([]);
  };

  const generateSessionName = (session) => {
    const firstUserMessage = session.find((msg) => msg.sender === "user");
    return (
      firstUserMessage?.text
        .split(" ")
        .slice(0, 5)
        .join(" ")
        .replace(/[^a-zA-Z0-9 ]/g, "") || "Unnamed Session"
    );
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setShowUploadOptions(false);
  };

  return (
    <div className="chatbot-container">
      <div className="sidebar">
        <h2>Previous Cases</h2>
        <ul className="case-list">
          {previousCases.map((caseItem, index) => (
            <li key={index} className="case-item">
              <strong>{caseItem.name}</strong>
            </li>
          ))}
        </ul>
      </div>

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

        <div className="button-container">
          <button onClick={saveCurrentSession} className="save-session-button">
            Save Chat Session
          </button>
          <button onClick={startNewChat} className="new-chat-button">
            New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;
