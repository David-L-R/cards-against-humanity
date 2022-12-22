import { Router } from "express";
import allCards from "./getAllCards.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("server is running");
});

router.get("/allCards", allCards);

router.post("/sethost", (req, res) => {
  console.log(req.body);
  res.status(200).json(req.body);
});

export default router;
