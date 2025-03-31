import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Log In</h2>

        <form className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter your email" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter your password" />
          </div>

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Log In</button>
        </form>

        <div className="my-4 text-center text-gray-600">OR</div>

        {/* Google Login Button */}
        <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
          <img src="./glogo.png" alt="Google" className="w-5 h-5 mr-2" />
          Log In with Google
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
