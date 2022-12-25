import router from "./router/routes.js";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import GameCollection from "./database/models/game.js";
import consoleSuccess from "./utils/consoleSuccess.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("createNewGame", async (data) => {
    const { hostName } = data;
    const gameData = {
      ...data,
      players: [{ playerName: hostName, playerId: socket.id }],
    };

    //Create game object
    const newGame = await GameCollection.create(gameData);
    if (!newGame) return console.error("creating game Object failed");
    consoleSuccess("Game created: ", newGame);

    // return room ID to client
    const roomId = newGame._id.toString();
    socket.emit("roomCreated", { roomId, hostName });
    socket.join(roomId);
  });

  socket.on("findRoom", async ({ roomId, newPlayerName }) => {
    const player = { playerName: newPlayerName, playerId: socket.id };
    // serve game in MongoDb
    const game = await GameCollection.findOne({ _id: roomId });
    if (!game)
      return socket.emit("findRoom", {
        noRoom: true,
        message: "Can't find game",
      });
    // update player list in DB
    game.players.push(player);
    const updatetGame = await game.save();
    if (!updatetGame)
      return socket.emit("findRoom", {
        noRoom: true,
        message: "Can't join game",
      });

    //join player into room and send roomId back
    socket.join(roomId);
    socket.emit("findRoom", {
      noRoom: false,
      roomId,
      playerName: newPlayerName,
      message: "Joining romm",
    });

    //updateing room
    socket.to(roomId).emit("updateRoom", { playerList: updatetGame.players });
  });

  socket.on("selfUpdate", async ({ roomId }) => {
    if (!roomId)
      return socket.emit("updateRoom", { message: "Cant find game to join!" });

    const currentGame = await GameCollection.findOne({ _id: roomId });
    if (!currentGame)
      return socket.emit("updateRoom", { message: "Cant find game to join!" });

    socket.emit("updateRoom", { playerList: currentGame.players });
  });
});

app.use("/", router);

const PORT = process.env.PORT || 5555;

server.listen(PORT, async (req, res) => {
  console.log(`Server running under ${PORT}`);
});

/*

import router from "./router/routes.js";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
});

app.use("/", router);

const PORT = process.env.PORT || 5555;

server.listen(PORT, async (req, res) => {
  console.log(`Server running under ${PORT}`);
});


*/
