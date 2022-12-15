import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";

dotenv.config();
connectDB();

const server = express();
const port = process.env.PORT || 5555;

server.listen(port, (req, res) => {
  console.log(`Server running under ${port}`);
});
