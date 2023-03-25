const express = require("express");
const dotenv = require("dotenv");
const { Server: SocketServer } = require("socket.io");

const connectDB = require("../config/dbConnect");
const userRouter = require("../routes/userRouter");
const chatRouter = require("../routes/chatRouter");
const messageRouter = require("../routes/messageRouter");
const { notFound, errorHandler } = require("../middleware/errorMiddleware");
const path = require("path");

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

app.get("/", (req, res) => {
  res.send("Hello Node");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const __dirName = path.resolve();

if (process.env.ENVIRONMENT === "production") {
  app.use(express.static(path.join(__dirName, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirName, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const httpServer = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const io = new SocketServer(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket Connected!", socket.id);

  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.to(user._id).emit("connected");
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
  });

  socket.on("start typing", (roomId) => {
    console.log(roomId);
    console.log(socket.rooms);
    socket.to(roomId).emit("start typing");
  });

  socket.on("stop typing", (roomId) => {
    socket.to(roomId).emit("stop typing");
  });

  socket.on("new message", (newMessage) => {
    if (!newMessage.chat?.users) {
      return;
    }
    newMessage.chat.users.forEach((user) => {
      if (user._id !== newMessage.sender._id) {
        socket.to(user._id).emit("received message", newMessage);
      }
    });
  });
});
