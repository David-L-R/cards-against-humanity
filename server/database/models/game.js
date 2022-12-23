import mongoose from "mongoose";
import deleteOutatedData from "../../utils/deleteOutatedData.js";

//TODO: create a real game object
const gameModel = mongoose.Schema(
  {
    players: {
      type: Number,
      required: [true, "Please add a name"],
    },
  },
  {
    timestamps: true,
  }
);

const GameCollection = mongoose.model("GameCollection", gameModel);

deleteOutatedData(GameCollection);

export default GameCollection;
