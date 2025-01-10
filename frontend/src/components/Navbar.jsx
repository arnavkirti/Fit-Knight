import axiosInstance from "@/axiosConfig";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const Role = localStorage.getItem("role");
  let role = "";
  if (Role === "BuddyFinder") {
    role = "user";
  } else {
    role = "admin";
  }
  const [userProfile, setUserProfile] = React.useState(null);
  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  };

  const getProfilePic = async () => {
    const res = await axiosInstance.get(`/api/${role}/profile`);
    setUserProfile(res.data.profilePicture);
  };
  getProfilePic();
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link to={`/api/${role}/dashboard`} className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link
            to={`/notifications`}
            className="hover:text-gray-300"
          >
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
              src={userProfile ? userProfile : "/default-avatar.png"}
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
