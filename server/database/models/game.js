import mongoose from "mongoose";

const gameModel = mongoose.Schema(
  {
    Game: {
      id: String,
      finished: Boolean,
      players: [
        {
          id: String, // this.Lobby.player[n].id
          name: String,
          active: Boolean,
          points: Number,
          hand: Array, //Cards
        },
      ],
      deck: {
        black_cards: Array,
        white_cards: Array,
      },
      turns: [
        {
          czar: String, // this.Game.players[n].id
          black_card: Object, //this.Game.deck.black_cards.splice(n, 1)
          white_cards: [{ player: String, cards: Array }], //this.Game.players(n).id; this.Game.players(n).hand
          winner: String, // this.Game.players[n].id
          stage: Array, // holding strings, "deal", "choose_black", .....
          timer: Number, // from host
          active: Boolean,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("GameCollection", gameModel);
