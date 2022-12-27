import router from "./router/routes.js";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import {
  createNewGame,
  createNewLobby,
  deletePlayerFromDb,
  findRoomToJoin,
  updateClient,
} from "./controller/socketControllers.js";

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

  socket.on("createNewGame", (data) => createNewGame({ socket, data }));

  socket.on("selfUpdate", ({ roomId }) => updateClient({ roomId, socket }));

  socket.on("findRoom", ({ roomId, newPlayerName }) =>
    findRoomToJoin({ roomId, newPlayerName, socket })
  );

  socket.on("disconnect", async (reason) => {
    const { playerList, roomId } = await deletePlayerFromDb({
      reason,
      io,
      socket,
    });
    if (playerList && roomId) io.to(roomId).emit("updateRoom", { playerList });
  });
});
