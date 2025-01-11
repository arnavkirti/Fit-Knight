// add logic to use location access data

import { useState } from "react";
import axiosInstance from "../axiosConfig";

const CreateGroupPopup = ({ isOpen, closePopup, fetchGroups }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [activityType, setActivityType] = useState("");
  const [location, setLocation] = useState("");
  const [schedule, setSchedule] = useState("");
  const [error, setError] = useState("");

  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription || !activityType || !location) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/admin/dashboard/add-group",
        {
          name: groupName,
          activityType: activityType,
          schedule: schedule,
          location: {
            type: "Point",
            coordinates: location.split(",").map(Number),
          },
          description: groupDescription,
        },
        {
          validateStatus: (status) => status < 500,
        }
      );
      const updateUser = await axiosInstance.post("/api/admin/profile/update", {
        updatedProfile: {
          group: response.data._id,
        },
      });
      console.log("Response:", response);
      console.log("Update User:", updateUser);

      if (response.status === 200) {
        fetchGroups();
        closePopup();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "An error occurred while creating the group.";
      setError(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
      console.error("Error creating group:", err);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Group</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Activity Type</label>
                <input
                  type="text"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Location (Longitude, Latitude)
                </label>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          setLocation(`${longitude}, ${latitude}`);
                          alert(`Location fetched: ${longitude}, ${latitude}`);
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
                  className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Get Location
                </button>
                {location && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected Location:{" "}
                    <span className="font-medium">{location}</span>
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Schedule</label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closePopup}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateGroupPopup;
