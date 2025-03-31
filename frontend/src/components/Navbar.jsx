import React, { useState } from "react";
import { Link } from "react-router-dom";

let Navitem = ["Home", "Services", "About", "Contact"];

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);

  return (
    <div className="font-poppins flex flex-col justify-center items-center !bg-white">
      <div className="w-full h-[110px] bg-[#FFFFFF] flex justify-center">
        <div className="flex justify-between md:justify-center items-center px-5 w-full max-w-[1440px] sm:px-5 lg:px-24 sm:gap-7 md:gap-12 lg:gap-20 xl:gap-32">
          <Link to="/" className="w-full max-w-fit">
            <img src={"/logo.svg"} alt="logo" />
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex justify-between gap-5 font-medium text-lg">
            {Navitem.map((navitem, index) => (
              <Link
                to={`/${navitem.toLowerCase()}`}
                key={index}
                className="text-[#1C1C23] hover:text-[#DDA45C] font-semibold"
              >
                {navitem}
              </Link>
            ))}
          </div>

          {/* Sign Up & Login Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Sign Up */}
            <Link
              to="/signup"
              className="px-4 py-2 bg-[#DDA45C] text-white rounded-lg hover:bg-[#b9833a]"
            >
              Sign Up
            </Link>
            
            {/* Login */}
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              Login
            </Link>
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
