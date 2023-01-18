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
import {
  changeGame,
  createGame,
  sendCurrentGame,
} from "./controller/gameController.js";
import GameCollection from "./database/models/game.js";

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

  socket.on("createNewLobby", (data) => createNewLobby({ socket, data }));

  socket.on("updateLobby", ({ lobbyId, id, joinGame, newPLayerName }) =>
    updateClient({ lobbyId, socket, id, io, joinGame, newPLayerName })
  );

  socket.on("findRoom", ({ lobbyId, newPlayerName, id }) => {
    findRoomToJoin({ lobbyId, newPlayerName, socket, id, io });
  });

  socket.on("disconnect", async (reason) => {
    const userId = socket.userId;
    setPlayerInactive({
      reason,
      userId,
      io,
    });
  });

  socket.on("createGameObject", ({ setRounds, maxHandSize, lobbyId }) => {
    createGame({ setRounds, maxHandSize, lobbyId, io, socket });
  });

  socket.on("getUpdatedGame", ({ lobbyId, name, id, gameIdentifier }) =>
    sendCurrentGame({ lobbyId, name, id, io, socket, gameIdentifier })
  );

  socket.on("changeGame", (data) => {
    changeGame({ ...data, io, socket });
  });
});
