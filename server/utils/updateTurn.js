const updateTurn = ({
  currentGame,
  playedBlack,
  stage,
  playerId,
  blackCards,
  playedWhite,
  winningCards,
  leavedGame,
}) => {
  const currentTurnIndex = currentGame.Game.turns.length - 1;
  const currentTurn = currentGame.Game.turns[currentTurnIndex];

  // set status to inactive if playver turns back to lobby
  if (leavedGame) {
    const currentPlayer = currentTurn.white_cards.find(
      (curr) => curr.player === playerId
    );

    //if normal player leaves active, set inactive in white_cards
    //TODO: also in game.player, check is czar is leaving and set new czar, reactivate player after rejoining
    if (currentPlayer) {
      currentPlayer.active = false;
      currentGame.save();
      return currentGame;
    }
  }

  // send every player the choosen black card
  if (stage === "black") {
    currentGame.Game.deck.black_cards = blackCards;
    currentTurn.stage = [...currentTurn.stage, "white"];
    currentTurn.black_card = playedBlack;
    currentGame.save();
    return currentGame;
  }

  //send czar choosed white cards from player
  if (stage === "white") {
    const { Game } = currentGame;
    const currentPlayer = Game.players.find((curr) => curr.id === playerId);
    const updatedHand = currentPlayer.hand.filter(
      (card) => !playedWhite.find((whiteCard) => whiteCard.text === card.text)
    );

    //update player in game object
    currentPlayer.hand = updatedHand;
    const updatedPlayer = {
      player: currentPlayer.id,
      cards: updatedHand,
      played_card: playedWhite,
      points: 0,
      active: true,
    };

    //update player in turns.white_cards
    currentTurn.white_cards = currentTurn.white_cards.map((player) => {
      if (player.player === playerId) return updatedPlayer;
      return player;
    });

    //check if everyone submitted their cards by lookin into white_cards/played_cards
    const allPLayedCards = currentTurn.white_cards
      .map((player) => player.played_card)
      .filter((cards) => cards.length > 0);

    if (allPLayedCards.length === currentTurn.white_cards.length)
      currentTurn.stage.push("deciding");

    currentGame.Game = Game;

    currentGame.save();
    return currentGame;
  }

  //send winner to players
  if (stage === "winner") {
    const { Game } = currentGame;
    const wonPlayer = currentTurn.white_cards.find(
      (player) => player.played_card[0].text === winningCards[0].text
    );

    //add points to turn
    console.log("wonPlayer", wonPlayer);
    wonPlayer.played_card.forEach((card) => (wonPlayer.points += 10));
    currentTurn.winner = wonPlayer;
    //add points to global players
    Game.players.map((player) => {
      if (player.id === wonPlayer.player) player.points += wonPlayer.points;
      return player;
    });
    currentTurn.stage.push("winner");
    currentGame.Game = Game;
    currentGame.save();
    return currentGame;
  }

  if (stage === "completed") {
    const { Game } = currentGame;

    currentTurn.completed.push({ player_id: playerId });
    if (currentTurn.completed.length >= Game.players.length) {
      const currCzarIndex = Game.players.indexOf(
        Game.players.find((player) => player.id === currentTurn.czar.id)
      );
      const lastPlayer = Game.players.length - 1;
      //if cazr is last palyer in array, take the first player
      const nextCzar =
        currCzarIndex === lastPlayer
          ? Game.players[0]
          : Game.players[currCzarIndex + 1];
      // create new turn

      const newTurn = {
        turn: currentTurn.turn + 1,
        czar: nextCzar,
        stage: "black",
        white_cards: Game.players
          .filter((player) => player.id !== nextCzar.id)
          .map((player) => {
            return { player: player.id, cards: player.hand, played_card: [] };
          }),
        black_card: {},
        winner: {},
        completed: [],
      };
      currentGame.Game.turns.push(newTurn);
    }
    currentGame.save();
    return currentGame;
  }
};

export default updateTurn;
