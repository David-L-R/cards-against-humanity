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
