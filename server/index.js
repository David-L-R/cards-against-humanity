import router from "./router/routes.js";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import useQueue from "./utils/useQueue.js";
import consoleSuccess from "./utils/consoleSuccess.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use(
  express.urlencoded({
    extended: true,
  })
);
export const queue = {}; // {lobby: {lobby: lobbyId, loading:Boolean, data:[{states to process, channelname}]}}
const PORT = process.env.PORT || 5555;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, async (req, res) => {
  consoleSuccess(`Server running under ${PORT}`);
});

//Socket.io
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("createNewLobby", (data) => {
    socket.join(data.lobbyId);
    useQueue({ data, socket, io, channelName: "createNewLobby" });
  });

  socket.on("updateLobby", (data) => {
    socket.join(data.lobbyId),
      useQueue({ data, socket, io, channelName: "updateLobby" });
  });

  socket.on("findRoom", (data) => {
    socket.join(data.lobbyId),
      useQueue({ data, socket, io, channelName: "findRoom" });
  });

  socket.on("disconnect", async (reason) => {
    const userId = socket.userId;
    useQueue({
      userId,
      io,
      channelName: "disconnect",
      data: { lobbyId: reason.replace(" ", "") },
    });
  });

  socket.on("createGameObject", (data) => {
    socket.join(data.lobbyId);
    useQueue({ data, socket, io, channelName: "createGameObject" });
  });

  socket.on("getUpdatedGame", (data) => {
    socket.join(data.lobbyId);
    useQueue({ data, socket, io, channelName: "getUpdatedGame" });
  });

  socket.on("changeGame", async (data) => {
    socket.join(data.lobbyId),
      useQueue({ data, socket, io, channelName: "changeGame" });
  });
  socket.on("sendTimer", async (data) => {
    console.log("timer", data.timer);
    socket.join(data.lobbyId),
      io
        .to(data.lobbyId)
        .emit("getTimer", { timer: data.timer, requestSync: data.requestSync });
  });
});
