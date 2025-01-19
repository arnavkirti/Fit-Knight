import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Navbar from "./Navbar"; // Assuming you have a Navbar component

const GroupChat = ({ groupId, username }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      autoConnect: true,
    });
    setSocket(newSocket);

    newSocket.emit("joinGroup", { groupId }); // join group room

    // listen for previous messages
    newSocket.on("previousMessages", (data) => {
      setMessages(data);
    });

    // listen for new messages
    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("connect_error", (err) => {
      console.error(err.message);
    });

    return () => newSocket.disconnect();
  }, [groupId]);

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      socket.emit("sendMessage", { groupId, message: newMessage, username });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-[#36393f] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-6 bg-[#2f3136]">
        <div className="space-y-4">
          <div className="text-xl font-semibold mb-4 text-[#99aab5]">
            Group Chat Room: {groupId}
          </div>

          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start ${
                  msg.username === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.username === username
                      ? "bg-[#7289da] text-white"
                      : "bg-[#44475a] text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-semibold text-[#8e9297] mr-2">
                      {msg.username}
                    </span>
                    <span className="text-xs text-[#b9bbbe]">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#2f3136] p-4 flex items-center space-x-4 border-t border-[#44475a]">
        <input
          type="text"
          className="flex-grow bg-[#40444b] border border-[#44475a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7289da] transition-all"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          autoFocus
        />
        <button
          className="bg-[#7289da] text-white px-4 py-2 rounded-lg hover:bg-[#5f73a1] active:scale-95 transition-transform"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
