import { Router } from "express";
import allCards from "./getAllCards.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("server is running");
});

router.get("/allCards", allCards);

export default router;
