const updateTurn = ({
  currentGame,
  playedBlack,
  stage,
  player,
  blackCards,
  playedWhite,
}) => {
  if (stage === "black") {
    currentGame.Game.deck.black_cards = blackCards;

    const currentTurnIndex = currentGame.Game.turns.length - 1;
    const currentTurn = currentGame.Game.turns[currentTurnIndex];
    currentTurn.stage = [...currentTurn.stage, "black", "white"];
    currentTurn.black_card = playedBlack;
    currentGame.save();
    return currentGame;
  }
};

export default updateTurn;
