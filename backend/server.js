const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const http = require("http").Server(app);

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

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
