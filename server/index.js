import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import router from "./router/routes.js";
import cors from "cors";

dotenv.config();
connectDB();

const server = express();
const port = process.env.PORT || 5555;
server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/", router);

server.listen(port, async (req, res) => {
  console.log(`Server running under ${port}`);
});
