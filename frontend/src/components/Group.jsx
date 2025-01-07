// add group chat feature

import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import Navbar from "./Navbar";

const Group = ({ groupId }) => {
  const [groupData, setGroupData] = useState(null);

  const fetchGroupData = async () => {
    try {
      const response = axiosInstance.get(`/api/group-info?id=${groupId}`);
      setGroupData(response.data.group);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Navbar />
      {groupData && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4">
            {groupData.name}
          </h1>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Activity Type:</span>{" "}
            {groupData.activityType}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Schedule:</span>{" "}
            {groupData.schedule}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Location:</span>{" "}
            {groupData.location?.coordinates?.join(", ") || "Not specified"}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Description:</span>{" "}
            {groupData.description || "No description available"}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Organizer:</span>{" "}
            {groupData.organizer?.username || "Unknown"}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Members:</span>{" "}
            {groupData.members.length}
          </p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => navigate(`/group-chat/${groupId}`)}
          >
            Go to Group Chat
          </button>
          <h2 className="text-xl font-semibold mt-6 mb-2">Join Requests</h2>
          {groupData.joinRequests.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {groupData.joinRequests.map((request) => (
                <li key={request.userId} className="mb-2">
                  User: {request.userId} - Status: {request.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No join requests available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Group;
