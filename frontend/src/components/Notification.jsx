import React, { useState, useEffect } from "react";
import axiosInstance from "@/axiosConfig";
import Navbar from "./Navbar";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/api/notifications");
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
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications yet.</p>
        ) : (
          <ul className="notification-list space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`notification-item p-4 rounded-lg border ${
                  notification.read
                    ? "bg-gray-100 border-gray-200"
                    : "bg-blue-50 border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-lg text-gray-800">
                    {notification.type.toUpperCase()}
                  </strong>
                  <small className="text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </small>
                </div>
                <p className="text-gray-700 mt-2">{notification.message}</p>
                {!notification.read && (
                  <button
                    className="mark-read-button mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
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
  );
}
