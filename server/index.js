import router from "./router/routes.js";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import GameCollection from "./database/models/game.js";
import {
  createNewLobby,
  deletePlayerFromDb,
  findRoomToJoin,
  updateClient,
} from "./controller/socketControllers.js";
import LobbyCollection from "./database/models/lobby.js";
import allCards from "./data/allCards.json" assert { type: "json" };

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
    origin: "http://localhost:3000",
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

  socket.on("selfUpdate", ({ lobbyId, name, id }) =>
    updateClient({ lobbyId, socket, name, id, io })
  );

  socket.on("findRoom", ({ lobbyId, newPlayerName, id }) => {
    findRoomToJoin({ lobbyId, newPlayerName, socket, id, io });
  });

  socket.on("disconnect", async (reason) => {
    const userId = socket.userId;

    const { playerList, lobbyId, err, isHost } = await deletePlayerFromDb({
      reason,
      userId,
    });

    if (playerList && lobbyId)
      io.to(lobbyId.toString()).emit("updateRoom", { playerList, isHost });
  });

  socket.on("createGameObject", async ({ setRounds, maxHandSize, lobbyId }) => {
    let amountOfRounds = parseInt(setRounds);
    let handSize = parseInt(maxHandSize);

    //set default if client dos not setup anything
    if (!setRounds) amountOfRounds = 10;
    if (!maxHandSize) handSize = 10;

    //if alreday games where played, increase to game indentifiyer
    let existingGames = GameCollection.find({ id: lobbyId });

    let lastGame = 0;

    if (existingGames.length > 0)
      lastGame = existingGames[existingGames.length - 1].gameIdentifier + 1;

    let lobbyPLayers = await LobbyCollection.findOne({ _id: lobbyId });
    if (!lobbyPLayers)
      return socket.to(lobbyId).emit("newgame", { err: "cant find lobby" });

    // add each player all necessary keys
    lobbyPLayers = lobbyPLayers.players.map((player) => {
      player.active = true;
      player.points = 0;
      player.hand = [];
      player.bet = false;
      return player;
    });

    const [black] = allCards.map((set) => set.black);
    const [white] = allCards.map((set) => set.white);

    const gamedata = {
      id: lobbyId,
      gameIdentifier: lastGame,
      handSize: handSize,
      concluded: false,
      players: [...lobbyPLayers],
      deck: {
        black_cards: [...black],
        white_cards: [...white],
      },
      turns: [
        {
          turn: 0,
          czar: null,
          stage: ["start"],
          white_cards: [],
          black_cards: [],
          winner: {},
        },
      ],
      timerTrigger: false,
    };

    const newGameData = await GameCollection.create({ Game: gamedata });

    io.to(lobbyId).emit("newgame", { newGameData });
  });
});
