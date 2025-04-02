import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Navitem = ["Home", "Services", "About", "Contact"];

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [navbar, setNavbar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden cursor-pointer" onClick={() => setNavbar(!navbar)}>
            <img src={"/menu.svg"} alt="menu" className="h-[30px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
