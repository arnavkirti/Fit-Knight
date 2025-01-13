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
    <nav className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-8">
          <Link
            to={`/dashboard`}
            className="text-lg font-medium hover:text-blue-400 transition"
          >
            Dashboard
          </Link>
          <Link
            to={`/notifications`}
            className="text-lg font-medium hover:text-blue-400 transition"
          >
            Notifications
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <div
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer hover:opacity-90 transition"
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
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
