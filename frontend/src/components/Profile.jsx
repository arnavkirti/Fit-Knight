// also let user update profile picture

import React, { useState, useEffect } from "react";
import axiosInstance from "@/axiosConfig";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const role = localStorage.getItem("role");

  const fetchProfile = async () => {
    try {
      const route = `/api/${role === "BuddyFinder" ? "user" : "admin"}/profile`;
      const response = await axiosInstance.get(route);
      setProfileData(response.data);
      setFormData(response.data); // to initialize the form data
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [role]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async () => {
    try {
      const route = `/api/${
        role === "BuddyFinder" ? "user" : "admin"
      }/profile/update`;
      let reqbody = {};
      if (role === "BuddyFinder") {
        reqbody = {
          updatedProfile: {
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            about: formData.about,
            profilePicture: formData.profilePicture,
            fitnessDetails: {
              fitnessGoals: formData.fitnessGoals,
              achievements: formData.achivements,
            },
            revealContactInfo: formData.revealContactInfo,
          },
        };
      } else {
        reqbody = {
          updatedProfile: {
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            about: formData.about,
            profilePicture: formData.profilePicture,
            revealContactInfo: formData.revealContactInfo,
          },
        };
      }
      const response = await axiosInstance.post(route, reqbody);
      console.log(response.data);
      setProfileData(response.data); // update the profile data
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="bg-gradient-to-b from-blue-900 via-gray-900 to-black min-h-screen p-8">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          {role === "Organizer" ? "Admin Profile" : "User Profile"}
        </h1>

        {profileData && (
          <div className="bg-gray-800 shadow-xl rounded-xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <img
                src={profileData.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-lg mb-6"
              />
              <h2 className="text-2xl font-semibold text-white">
                {profileData.username || "No Username"}
              </h2>
              <p className="text-gray-400">
                {profileData.about || "No bio added yet."}
              </p>
            </div>

            <div className="mt-10 space-y-6">
              {editMode ? (
                <>
                  <div className="flex flex-col">
                    <label className="text-gray-400 font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-400 font-medium mb-2">
                      About
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* <div className="flex flex-col">
                    <label className="text-gray-400 font-medium mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}
                  {role === "BuddyFinder" && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-gray-400 font-medium mb-2">
                          Fitness Goals
                        </label>
                        <input
                          type="text"
                          name="fitnessGoals"
                          value={formData.fitnessGoals}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-gray-400 font-medium mb-2">
                          Achievements
                        </label>
                        <textarea
                          name="achievements"
                          value={formData.achievements}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex flex-col">
                    <label className="text-gray-400 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-400 font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      name="revealContactInfo"
                      checked={formData.revealContactInfo || false}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="ml-3 text-gray-400 font-medium">
                      Reveal Contact Info
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-400">
                    <strong>About:</strong>{" "}
                    {profileData.about || "No bio added yet."}
                  </p>
                  {role === "BuddyFinder" && (
                    <>
                      <p className="text-gray-400">
                        <strong>Fitness Goals:</strong>{" "}
                        {profileData.fitnessGoals || "No goals specified."}
                      </p>
                      <p className="text-gray-400">
                        <strong>Achievements:</strong>{" "}
                        {profileData.achievements || "No achievements listed."}
                      </p>
                    </>
                  )}
                  <p className="text-gray-400">
                    <strong>Email:</strong>{" "}
                    {profileData.revealContactInfo
                      ? profileData.email
                      : "Hidden"}
                  </p>
                  <p className="text-gray-400">
                    <strong>Phone:</strong>{" "}
                    {profileData.revealContactInfo
                      ? profileData.phone
                      : "Hidden"}
                  </p>
                </>
              )}
            </div>

            <div className="mt-10 flex justify-center space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="px-8 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-8 py-2 bg-gray-600 text-white font-bold rounded-lg shadow hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-8 py-2 bg-indigo-500 text-white font-bold rounded-lg shadow hover:bg-indigo-600 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
