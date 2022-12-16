import mongoose from "mongoose";

// just first idea how the data for each Card could looke like
const blackCardSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "add a card type"], // black or white
    },
    text: {
      type: String,
      required: [true, "add content to the card"],
    },
  },
  {
    timestamps: true,
  }
);

const whiteCardSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "add a card type"], // black or white
    },
    text: {
      type: String,
      required: [true, "add content to the card"],
    },
  },
  {
    timestamps: true,
  }
);

const blackCard = mongoose.model("blackCard", blackCardSchema);
const whiteCard = mongoose.model("whiteCard", whiteCardSchema);

export { blackCard, whiteCard };
