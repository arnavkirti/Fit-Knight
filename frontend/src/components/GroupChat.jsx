import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const GroupChat = ({ groupId, username }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("joinGroup", { groupId }); // join group room

    // listen for prev messages
    newSocket.on("previousMessages", (data) => {
      setMessages(data);
    });

    // listen for new mesages
    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.disconnect();
  }, [groupId]);

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      socket.emit("sendMessage", { groupId, message: newMessage, username });
      setNewMessage("");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">Group Chat</h1>
        <div className="h-96 overflow-y-scroll bg-gray-200 p-4 rounded-lg mb-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">{msg.username}:</span> {msg.message}
              <small className="text-gray-500 ml-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;