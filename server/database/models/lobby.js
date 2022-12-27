import mongoose from "mongoose";

const lobbyModel = mongoose.Schema(
  {
    // id: String,
    games: [],
    players: [{ id: String, name: String }],
    waiting: [{ id: String, name: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LobbyCollection", lobbyModel);
