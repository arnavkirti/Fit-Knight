// handle frontend to update profile
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

      const reqbody = {
        updatedProfile: {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          about: formData.about,
          fitnessDetails: {
            fitnessGoals: formData.fitnessGoals,
            achievements: formData.achivements,
          },
          revealContactInfo: formData.revealContactInfo,
        },
      };
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
      <div className="bg-gray-100 min-h-screen p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center my-6">
          {role === "Organizer" ? "Admin Profile" : "User Profile"}
        </h1>
        {profileData && (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
            <img
              src={profileData.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <div className="space-y-4">
              {editMode ? (
                <>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">
                      Username:
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md p-2 mt-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">About:</label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md p-2 mt-1"
                    />
                  </div>
                  {role === "BuddyFinder" && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">
                          Fitness Goals:
                        </label>
                        <input
                          type="text"
                          name="fitnessGoals"
                          value={formData.fitnessGoals}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md p-2 mt-1"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">
                          Achievements:
                        </label>
                        <textarea
                          name="achievements"
                          value={formData.achivements}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md p-2 mt-1"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md p-2 mt-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md p-2 mt-1"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="text-gray-700 font-medium">
                      Reveal Contact Info:
                    </label>
                    <input
                      type="checkbox"
                      name="revealContactInfo"
                      checked={formData.revealContactInfo || false}
                      onChange={handleInputChange}
                      className="w-4 h-4 mr-2"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700">
                    Username: {profileData.username}
                  </p>
                  <p className="text-gray-700">About: {profileData.about}</p>
                  {role === "BuddyFinder" && (
                    <>
                      <p className="text-gray-700">
                        Fitness Goals: {profileData.fitnessGoals}
                      </p>
                      <p className="text-gray-700">
                        Achievements: {profileData.achivements}
                      </p>
                    </>
                  )}
                  <p className="text-gray-700">
                    Email:{" "}
                    {profileData.revealContactInfo
                      ? profileData.email
                      : "Hidden"}
                  </p>
                  <p className="text-gray-700">
                    Phone:{" "}
                    {profileData.revealContactInfo
                      ? profileData.phone
                      : "Hidden"}
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
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
