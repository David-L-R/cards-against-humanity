import router from "./router/routes.js";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import {
  createNewLobby,
  setPlayerInactive,
  findRoomToJoin,
  updateClient,
} from "./controller/socketControllers.js";
import { createGame, sendCurrentGame } from "./controller/gameController.js";
import processQueue from "./utils/processQueue.js";
import useQueue from "./utils/useQueue.js";

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

const PORT = process.env.PORT || 5555;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, async (req, res) => {
  console.log(`Server running under ${PORT}`);
});

//Socket.io
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("createNewLobby", (data) =>
    useQueue({ data, socket, io, channelName: "createNewLobby" })
  );

  socket.on("updateLobby", (data) =>
    useQueue({ data, socket, io, channelName: "updateLobby" })
  );

  socket.on("findRoom", (data) =>
    useQueue({ data, socket, io, channelName: "findRoom" })
  );

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
    useQueue({ data, socket, io, channelName: "createGameObject" });
  });

  socket.on("getUpdatedGame", (data) =>
    useQueue({ data, socket, io, channelName: "getUpdatedGame" })
  );

  socket.on("changeGame", async (data) => {
    useQueue({ data, socket, io, channelName: "changeGame" });
  });
});

/*

lobbyId:{
lobby: lobbyId
loading:Boolean
data:[{data to precess}]
channel: function
}


*/
