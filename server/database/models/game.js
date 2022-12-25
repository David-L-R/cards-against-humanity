import mongoose from "mongoose";
import deleteOutatedData from "../../utils/deleteOutatedData.js";

//TODO: create a real game object
const gameModel = mongoose.Schema(
  {
    roomId: {
      type: String,
      required: [true, "Please add room ID"],
    },
    amountOfPlayers: {
      type: Number,
      required: [true, "Please add a name"],
    },
    hostName: {
      type: String,
      required: [true, "Please add a Room ID"],
    },
    round: {
      type: Number,
      required: [true, "Please add start round number"],
    },
    players: {
      type: Array,
      required: [true, "Please add a player tom the players array"],
    },
    cardDecks: {
      type: Array,
      required: [true, "Please add a player tom the players array"],
    },
  },
  {
    timestamps: true,
  }
);

const GameCollection = mongoose.model("GameCollection", gameModel);

deleteOutatedData(GameCollection);

export default GameCollection;
