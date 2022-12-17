import { Router } from "express";
import allCards from "./getAllCards.js";

const routes = Router();

routes.get("/", (req, res) => {
  res.send("server is running");
});

routes.get("/allCards", allCards);

export default routes;
