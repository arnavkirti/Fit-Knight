import React, { useState, useEffect } from "react";
import axiosInstance from "@/axiosConfig";
import Navbar from "./Navbar";

export default function Notification() {
  const role = localStorage.getItem("role");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let response = null;
        if (role === "BuddyFinder") {
          response = await axiosInstance.get("/api/notifications/fecth");
        } else {
          response = await axiosInstance.get("/api/notifications/fetch-admin");
        }
        setNotifications(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put("/api/notification/mark-read", {
        notificationId,
      });
      setNotifications(
        notifications.map((notification) => {
          if (notification._id === notificationId) {
            return { ...notification, read: true };
          }
          return notification;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-b from-blue-900 via-gray-900 to-black min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-4xl font-extrabold text-white mb-6 text-center">
            Notifications
          </h2>
          {notifications.length === 0 ? (
            <p className="text-gray-400 text-center text-lg">
              No notifications yet.
            </p>
          ) : (
            <ul className="notification-list space-y-6">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`notification-item p-6 rounded-lg ${
                    notification.read
                      ? "bg-gray-700 border border-gray-600"
                      : "bg-blue-700 border border-blue-600"
                  } shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-lg text-white">
                      {notification.type.toUpperCase()}
                    </strong>
                    <small className="text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <p className="text-gray-300 mt-4">{notification.message}</p>
                  {!notification.read && (
                    <button
                      className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
