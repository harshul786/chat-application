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
  pingTimeout: 600000,
});

app.get("/api/test", (req, res) => {
  res.send("testing");
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
io.on("connection", (socket) => {
  console.log("New Socket.io Connection!");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("typing", (room, userName) => {
    console.log("typing call " + userName);
    socket.in(room).emit("typing", userName);
  });
  socket.on("stop typing", (room, userName) => {
    socket.in(room).emit("stop typing", userName);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat || !chat?.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});

server.listen(3000, () => {
  console.log("server started on port 3000");
});
