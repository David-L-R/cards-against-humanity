import mongoose from "mongoose";

const newCardSchema = mongoose.Schema(
  {
    cardSetName: {
      type: String,
      required: [true, "add Set name"],
    },
    white: {
      type: Array,
      required: [true, "add white cards"],
    },
    black: {
      type: Array,
      required: [true, "add black cards"],
    },
    official: {
      type: Boolean,
      required: [true, "add Boolean to official"],
    },
  },
  {
    timestamps: true,
  }
);
const CardDeck = mongoose.model("CardDeck", newCardSchema);

export { CardDeck };
