import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (role === "BuddyFinder") {
      axiosInstance
        .get("/api/user/dashboard/recommended-buddies")
        .then((response) => setData(response.data))
        .catch((error) =>
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          )
        );
    } else if (role === "Organiser") {
      axiosInstance
        .get("/api/admin/dashboard/group")
        .then((response) => setData(response.data))
        .catch((error) =>
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          )
        );
    }
  }, [role]);

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`); // Redirect to group page
  };

  return (
    <div>
      <h1>{role === "user" ? "User" : "Admin"} Dashboard</h1>
      {role === "user" && data ? (
        <>
          <h2>Recommended Buddies</h2>
          <ul>
            {data?.recommendedBuddies.map((buddy) => (
              <li key={buddy.id}>{buddy.name}</li>
            ))}
          </ul>
          <h2>Groups to Join</h2>
          <ul>
            {data?.groups.map((group) => (
              <li key={group.id} onClick={() => handleGroupClick(group.id)}>
                {group.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>Your Group</h2>
          <ul>
            {data?.groups.map((group) => (
              <li key={group.id}>
                {group.name} -{" "}
                <button onClick={() => handleGroupClick(group.id)}>
                  View Group
                </button>
              </li>
            ))}
          </ul>
          <h2>Join Requests</h2>
          <ul>
            {data?.joinRequests.map((request) => (
              <li key={request.id}>{request.username}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;