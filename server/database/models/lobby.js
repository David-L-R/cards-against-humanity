import mongoose from "mongoose";
import deleteOutatedData from "../../utils/deleteOutatedData.js";

const lobbyModel = mongoose.Schema(
  {
    // id: String,
    games: [],
    players: [{ id: String, name: String, isHost: false, inactive: false }],
    waiting: [{ id: String, name: String }],
  },
  {
    timestamps: true,
  }
);

const LobbyCollection = mongoose.model("LobbyCollection", lobbyModel);

deleteOutatedData(LobbyCollection);

export default LobbyCollection;
