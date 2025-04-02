// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAV1Rv8qNiEu43u4AXn24Y-o_fnBi6CAuw",
  authDomain: "harvey-cd6c9.firebaseapp.com",
  projectId: "harvey-cd6c9",
  storageBucket: "harvey-cd6c9.firebasestorage.app",
  messagingSenderId: "1069761939526",
  appId: "1:1069761939526:web:c0c6132ee7520392032247",
  measurementId: "G-Y7WP831TG4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };