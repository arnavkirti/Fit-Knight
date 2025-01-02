import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav>
      <div>
        {" "}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/notifications">Notifications</Link>
        <div className="profile">
          <img
            src={userProfile ? userProfile : "default-profile.png"}
            alt="Profile"
            width="40"
            height="40"
            onClick={() => navigate("/profile")}
          />
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;