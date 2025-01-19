// add group chat feature

import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import Navbar from "./Navbar";
import { useParams, useNavigate } from "react-router-dom";

const Group = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState(null);

  const fetchGroupData = async () => {
    try {
      const response = await axiosInstance.put(`/api/group/group-info`, {
        groupId: groupId,
      });
      setGroupData(response.data);
      console.log(response.data, groupId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
  <Navbar />
  <div className="container mx-auto p-6">
    {groupData && (
      <div className="bg-gray-800 shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-400 text-center mb-4">
          {groupData.name}
        </h1>
        <div className="space-y-4">
          <p className="text-gray-300">
            <span className="font-semibold text-blue-300">Activity Type:</span>{" "}
            {groupData.activityType}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-blue-300">Schedule:</span>{" "}
            {groupData.schedule}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-blue-300">Location:</span>{" "}
            {groupData.location?.coordinates?.join(", ") || "Not specified"}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-blue-300">Description:</span>{" "}
            {groupData.description || "No description available"}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-blue-300">Organizer:</span>{" "}
            {groupData.organizer?.username || "Unknown"}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-blue-300">Members:</span>{" "}
            {groupData.members.length}
          </p>
        </div>
        <button
          className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(`/group-chat/${groupId}`)}
        >
          Go to Group Chat
        </button>
        <div className="mt-6">
          <h2 className="text-xl font-bold text-blue-300 mb-2">Join Requests</h2>
          {groupData.joinRequests.length > 0 ? (
            <ul className="space-y-3">
              {groupData.joinRequests.map((request) => (
                <li
                  key={request.userId}
                  className="p-4 bg-gray-700 rounded-lg shadow-md"
                >
                  <p className="text-gray-300">
                    <span className="font-semibold text-blue-300">User:</span>{" "}
                    {request.userId}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold text-blue-300">Status:</span>{" "}
                    {request.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">No join requests available.</p>
          )}
        </div>
      </div>
    )}
  </div>
</div>
  );
};

export default Group;
