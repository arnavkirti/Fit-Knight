const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const http = require("http").Server(app);
const io = new Server(http, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
//mongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected"))
  .catch((err) => console.error(err));

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/user", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/group", require("./routes/group"));
app.use("/api/notification", require("./routes/notification"));


//socket.io for group chat
const groupMessages = {};
io.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);

  socket.on("joinGroup", ({ groupId }) => {
    socket.join(groupId);
    console.log("A user joined group", groupId);

    socket.emit("previousMessages", groupMessages[groupId] || []);
  });

  socket.on("sendMessage", ({ groupId, message, username }) => {
    const newMessage = { username, message, timestamp: new Date() };

    if (!groupMessages[groupId]) groupMessages[groupId] = [];
    groupMessages[groupId].push(newMessage);

    io.to(groupId).emit("message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
