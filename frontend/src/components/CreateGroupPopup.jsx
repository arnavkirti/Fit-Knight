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
          location: { coordinates: location.split(",").map(Number) },
          description: groupDescription,
        },
        {
          validateStatus: (status) => status < 500,
        }
      );

      if (response.status === 200) {
        fetchAdminData();
        closePopup();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "An error occurred while creating the group.";
      setError(
        Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage
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
                <label className="block text-gray-700">
                  Location (Longitude, Latitude)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
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
