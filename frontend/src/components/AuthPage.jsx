// add logic for location access

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const { role } = useParams();
  const [isLogin, setIsLogin] = useState(true);
  const [location, setLocation] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = `/api/${role}/${isLogin ? "login" : "signup"}`;
    const formData = new FormData(e.target);

    if (!isLogin && location) {
      formData.append(
        "location",
        JSON.stringify({ type: "Point", coordinates: location })
      );
    }

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await axiosInstance.post(
        url,
        Object.fromEntries(formData)
      );
      console.log(response.data);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Login" : "Signup"} as{" "}
          {role == "user" ? "Buddy Finder" : "Group Organiser"}
        </h1>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Input
              name="username"
              type="text"
              placeholder="Username"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              name="role"
              type="hidden"
              value={role === "user" ? "BuddyFinder" : "Organizer"}
            />
          </div>

          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Profile Picture</label>
                <Input type="file" onChange={handleFileChange} />
              </div>
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation(`${longitude}, ${latitude}`);
                      },
                      (error) => {
                        console.error(
                          "Error fetching location:",
                          error.message
                        );
                        alert(
                          "Unable to fetch location. Please allow location access."
                        );
                      }
                    );
                  } else {
                    alert("Geolocation is not supported by your browser.");
                  }
                }}
                className="w-full bg-gray-100 text-blue-600 py-2 px-4 rounded-md hover:bg-gray-200 transition"
              >
                Use My Location
              </Button>
              <p className="mt-2 text-sm text-gray-600">
                Selected Location:{" "}
                <span className="font-medium">{location}</span>
              </p>
            </>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Signup"}
          </Button>
        </form>
        <Button
          type="submit"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 bg-gray-100 text-blue-600 py-2 px-4 rounded-md hover:bg-gray-200 transition"
        >
          Switch to {isLogin ? "Signup" : "Login"}
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;
