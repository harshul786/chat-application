const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const app = express();
app.use(cookieParser());

const dotenv = require("dotenv");
const path = require("path");
const socketio = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

require("./mongoose/index").connect();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

dotenv.config();
const server = http.createServer(app);
const io = socketio(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// ------------------ Chat APIs ----------------------

app.use("/api/", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------ Deployment ----------------------

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static(path.join(__dirname, "../public")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

// ------------------ Deployment ----------------------

var count = 0;

io.on("connection", (socket) => {
  console.log("New Socket.io Connection! ");

  socket.emit("countUpdate", count);
  socket.on("increment", () => {
    count++;
    socket.emit("countUpdate", count);
  });
});

server.listen(3000, () => {
  console.log("server started on port 3000");
});
