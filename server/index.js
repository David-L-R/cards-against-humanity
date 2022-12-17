import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { initialLoadData } from "./lib/initialLoadData.js";
import routes from "./router/routes.js";
import cors from "cors";

dotenv.config();
connectDB();

const server = express();
const port = process.env.PORT || 5555;
server.use(cors({ origin: "*" }));
server.use("/", routes);

server.listen(port, async (req, res) => {
  console.log(`Server running under ${port}`);
  initialLoadData();
});
