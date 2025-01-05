// add logic to make recommended buddies card 
// add logic to make available groups card
// test all endpoints


import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import { useNavigate } from "react-router-dom";
import CreateGroupPopup from "@/components/CreateGroupPopup";
import Navbar from "./Navbar";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const [isPopupOpen, setPopupOpen] = useState(false);

  // for users
  const [recommendedBuddies, setRecommendedBuddies] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [userGroup, setUserGroup] = useState(null);

  // for admins
  const [adminGroup, setAdminGroup] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);

  const navigate = useNavigate();

  // fetch user data
  const fetchUserData = async () => {
    try {
      const [buddiesResponse, groupsResponse, groupResponse] =
        await Promise.all([
          axiosInstance.get("/api/user/dashboard/recommended-buddies"),
          axiosInstance.get("/api/user/dashboard/available-groups", {
            params: { maxDistance: 10000 },
          }),
          axiosInstance.get("/api/user/dashboard/user-group"),
        ]);
      console.log([buddiesResponse, groupsResponse, groupResponse]);
      setRecommendedBuddies(buddiesResponse.data);
      setAvailableGroups(groupsResponse.data);
      setUserGroup(groupResponse.data); // null if not part of any group
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // fetch admin data
  const fetchAdminData = async () => {
    try {
      const [groupResponse, requestsResponse] = await Promise.all([
        axiosInstance.get("/api/admin/dashboard/group"),
        axiosInstance.get("/api/admin/dashboard/join-requests"),
      ]);
      setAdminGroup(groupResponse.data);
      setJoinRequests(requestsResponse.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const joinGroup = async (groupId) => {
    if (userGroup) {
      alert("You are already in a group");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/user/dashboard/join-group",
        { groupId }
      );
      alert("Request sent successfully to join the group");
      setAvailableGroups((prev) =>
        prev.filter((group) => group._id !== groupId)
      );
      fetchUserData();
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Error joining group");
    }
  };

  const leaveGroup = async () => {
    try {
      await axiosInstance.post("/api/user/dashboard/leave-group", {
        groupId: userGroup._id,
      });
      alert("You left the group");
      setUserGroup(null);
      fetchUserData();
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Error leaving group");
    }
  };

  // delete group (admin)
  const deleteGroup = async () => {
    try {
      await axiosInstance.delete("/api/admin/dashboard/delete-group", {
        data: { groupId: adminGroup._id },
      });
      alert("Group deleted successfully");
      setAdminGroup(null);
      fetchAdminData();
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Error deleting group");
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`); // Redirect to group page
  };

  // Accept or reject join requests (admin)
  const updateJoinRequest = async (requestId, action) => {
    try {
      await axiosInstance.post(`/api/admin/dashboard/update-join-request`, {
        requestId,
        action,
      });
      alert(
        `${action === "accept" ? "Accepted" : "Rejected"} request successfully`
      );
      fetchAdminData();
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Error processing request");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (role === "BuddyFinder") {
        await fetchUserData();
      } else if (role === "Organiser") {
        await fetchAdminData();
      }
    };
    fetchData();
  }, [role]);

  const handleCreateGroupClick = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div><Navbar />
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {role === "BuddyFinder" ? "User" : "Admin"} Dashboard
      </h1>

      {role === "BuddyFinder" ? (
        <div>
          {userGroup ? (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Your Group</h2>
              <div
                className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                onClick={handleGroupClick}
              >
                <p className="text-xl">{userGroup.name}</p>
                <p className="text-gray-600">{userGroup.description}</p>
                <button
                  onClick={leaveGroup}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Leave Group
                </button>
              </div>
            </section>
          ) : (
            <>
              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Recommended Fitness Buddies
                </h2>
                <ul className="space-y-4">
                  {recommendedBuddies.map((buddy) => (
                    <li
                      key={buddy._id}
                      className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      {buddy.name}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Available Groups
                </h2>
                <ul className="space-y-4">
                  {availableGroups.map((group) => (
                    <li
                      key={group._id}
                      onClick={handleGroupClick}
                      className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-xl">{group.name}</p>
                        <button
                          onClick={() => joinGroup(group._id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Join Group
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      ) : role === "Organizer" ? (
        <div>
          {adminGroup ? (
            <>
              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Your Group</h2>
                <div
                  className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  onClick={handleGroupClick}
                >
                  <p className="text-xl">{adminGroup.name}</p>
                  <p className="text-gray-600">{adminGroup.description}</p>
                  <button
                    onClick={deleteGroup}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete Group
                  </button>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Join Requests</h2>
                <ul className="space-y-4">
                  {joinRequests.map((request) => (
                    <li
                      key={request._id}
                      className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      {" "}
                      <div className="flex justify-between items-center">
                        <p className="text-xl">{request.userName}</p>
                      </div>
                      <button
                        onClick={() => updateJoinRequest(request._id, "accept")}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mr-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateJoinRequest(request._id, "reject")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <div>
              <button
                onClick={handleCreateGroupClick}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Group
              </button>
              <CreateGroupPopup
                isOpen={isPopupOpen}
                closePopup={closePopup}
                fetchGroups={fetchAdminData}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-red-500">Invalid Role</p>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
