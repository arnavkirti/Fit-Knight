import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import CreateGroupPopup from "@/components/CreateGroupPopup";
import Navbar from "./Navbar";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const adminId = localStorage.getItem("adminId");
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
      const groups = await axiosInstance.post(
        "/api/user/dashboard/available-groups",
        {
          maxDistance: "10000",
        }
      );
      setAvailableGroups(groups.data);
      const buddies = await axiosInstance.get(
        "/api/user/dashboard/recommended-buddies"
      );
      if (buddies.data.length > 0) {
        await axiosInstance.post("/api/notification/", {
          type: "buddy_match",
          userId: userId,
          message: "You have a new buddy match!",
        });
      }
      setRecommendedBuddies(buddies.data);
      const group = await axiosInstance.get("/api/user/dashboard/user-group");
      setUserGroup(group.data); // null if not part of any group
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  // console.log([userGroup, recommendedBuddies, availableGroups]);

  // fetch admin data
  const fetchAdminData = async () => {
    try {
      const groupResponse = await axiosInstance.get(
        "/api/admin/dashboard/group"
      );
      setAdminGroup(groupResponse.data);
      const groupid = groupResponse.data.groups;
      const requestsResponse = await axiosInstance.get(
        `/api/admin/dashboard/join-requests/${groupid}`
      );
      setJoinRequests(requestsResponse.data.joinRequests);
      console.log(groupResponse.data, requestsResponse.data);
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
      await axiosInstance.post("/api/notification/", {
        type: "group_join",
        userId: userId,
        message: "You have sent a group join request",
      });
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
        data: { groupId: adminGroup },
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

  const handleGroupClick = () => {
    // navigate(`/group/${adminGroup.groups}`); // Redirect to group page
    if (role === "Organizer") {
      // <Link to={`/group-info/${adminGroup.groups}`}></Link>;
      navigate(`/group-info/${adminGroup.groups}`);
    } else {
      navigate(`group-info/${userGroup.group}`);
    }
  };

  // Accept or reject join requests (admin)
  const updateJoinRequest = async (adminGroup, requestId, action) => {
    try {
      const groupid = adminGroup.groups;
      console.log(groupid, requestId, action);
      await axiosInstance.post(`/api/admin/dashboard/update-join-request`, {
        groupId: groupid,
        requestId: requestId,
        status: action,
      });
      if (action === "accept") {
        await axiosInstance.post("/api/notification/", {
          type: "group_join",
          userId: requestId,
          message: "Your group join request has been accepted",
        });
      } else {
        await axiosInstance.post("/api/notification/", {
          type: "group_join",
          userId: requestId,
          message: "Your group join request has been rejected",
        });
      }
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
      } else if (role === "Organizer") {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-8 text-center">
          {role === "BuddyFinder" ? "User" : "Admin"} Dashboard
        </h1>

        {role === "BuddyFinder" ? (
          <div>
            {userGroup ? (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-blue-300">
                  Your Group
                </h2>
                <div
                  className="p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition cursor-pointer"
                  onClick={handleGroupClick}
                >
                  <p className="text-2xl font-bold text-blue-400">
                    {userGroup.name}
                  </p>
                  <p className="text-gray-300 mt-2">{userGroup.description}</p>
                  <button
                    onClick={leaveGroup}
                    className="mt-6 px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                  >
                    Leave Group
                  </button>
                </div>
              </section>
            ) : (
              <>
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-6 text-blue-300">
                    Recommended Fitness Buddies
                  </h2>
                  <ul className="space-y-6">
                    {recommendedBuddies.map((buddy) => (
                      <li
                        key={buddy._id}
                        className="p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition"
                      >
                        <p className="text-xl font-medium">{buddy.name}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-6 text-blue-300">
                    Available Groups
                  </h2>
                  <ul className="space-y-6">
                    {availableGroups.map((group) => (
                      <li
                        key={group._id}
                        onClick={handleGroupClick}
                        className="p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-xl font-bold text-blue-400">
                            {group.name}
                          </p>
                          <p className="text-lg font-normal text-blue-300">
                            {group.description}
                          </p>
                          <button
                            onClick={() => joinGroup(group._id)}
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
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
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-6 text-blue-300">
                    Your Group
                  </h2>
                  <div
                    className="p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition cursor-pointer"
                    onClick={handleGroupClick}
                  >
                    <p className="text-2xl font-bold text-blue-400">
                      {adminGroup.name}
                    </p>
                    <p className="text-gray-300 mt-2">
                      {adminGroup.description}
                    </p>
                    <button
                      onClick={deleteGroup}
                      className="mt-6 px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                    >
                      Delete Group
                    </button>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-6 text-blue-300">
                    Join Requests
                  </h2>
                  <ul className="space-y-6">
                    {joinRequests.map((request) => (
                      <li
                        key={request._id}
                        className="p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition"
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-xl font-medium">{request._id}</p>
                        </div>
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() =>
                              updateJoinRequest(
                                adminGroup,
                                request._id,
                                "accept"
                              )
                            }
                            className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateJoinRequest(
                                adminGroup,
                                request._id,
                                "reject"
                              )
                            }
                            className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : (
              <div>
                <button
                  onClick={handleCreateGroupClick}
                  className="px-8 py-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
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
          <p className="text-red-500 text-center">Invalid Role</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
