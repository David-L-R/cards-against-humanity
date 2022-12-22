import { Router } from "express";
import allCards from "./getAllCards.js";
import { loginUser, registerUser } from "./registerUser.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("server is running");
});

router.get("/allCards", allCards);

router.post("/user/register", registerUser);

router.post("/user/login", protect, loginUser);

export default router;
