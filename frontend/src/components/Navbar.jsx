import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";


const Navitem = ["Home", "Services", "About", "Contact"];

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="font-poppins flex flex-col justify-center items-center bg-white">
      <div className="w-full h-[110px] flex justify-center">
        <div className="flex justify-between items-center px-5 w-full max-w-[1440px]">
          <Link to="/" className="w-full max-w-fit">
            <img src="/logo.svg" alt="logo" />
          </Link>

          <div className="hidden md:flex gap-5 font-medium text-lg">
            {Navitem.map((item, index) => (
              <Link key={index} to={`/${item.toLowerCase()}`} className="text-[#1C1C23] hover:text-[#DDA45C] font-semibold">
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Logout
              </button>
            ) : (
              <>
                <Link to="/signup" className="px-4 py-2 bg-[#DDA45C] text-white rounded-lg hover:bg-[#b9833a]">Sign Up</Link>
                <Link to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
