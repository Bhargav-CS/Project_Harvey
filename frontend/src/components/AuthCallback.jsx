import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        console.error("Authorization code missing");
        return;
      }

      try {
        // Clear the code from the URL before making the request
        window.history.replaceState({}, document.title, "/auth/callback");

        const response = await axios.get(`http://localhost:8000/auth/callback?code=${code}`);
        console.log("Token received:", response.data);

        // Save token in localStorage or state management
        localStorage.setItem("access_token", response.data.access_token);

        // Redirect to dashboard or home
        navigate("/dashboard");
      } catch (error) {
        console.error("Error exchanging code for token:", error);
      }
    };

    getToken();
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default AuthCallback;
