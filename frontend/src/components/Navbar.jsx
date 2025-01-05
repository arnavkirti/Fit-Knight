// add logic to fetch user profile picture (admin, user)

import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [userProfile, setUserProfile] = React.useState(null);
  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link to={`/api/${role}/dashboard`} className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to={`/api/${role}/notifications`} className="hover:text-gray-300">
            Notifications
          </Link>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userProfile ? userProfile : "react.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

