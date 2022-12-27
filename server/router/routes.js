import { Router } from "express";
import getAllCards from "./controllers/getAllCards.js";
import createGame from "./controllers/createGame.js";
import updateGame from "./controllers/updateGame.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("server is running");
});

router.get("/getallcards", getAllCards);

router.post("/creategame", createGame);

router.put("/updategame", updateGame);

export default router;
