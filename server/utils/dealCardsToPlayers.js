const dealCards = ({ currentGame, playerId }) => {
  if (currentGame.Game.turns[0].stage.includes("dealing")) return;

  //deal random white cards to players
  const { Game } = currentGame;
  currentGame.Game.players = currentGame.Game.players.map((player) => {
    const playerhand = [];
    const handsize = currentGame.Game.handSize;

    for (let counter = handsize; counter > 0; counter--) {
      const deckLength = currentGame.Game.deck.white_cards.length - 1;
      const randomIndex = Math.floor(Math.random() * deckLength);
      const [randomCard] = currentGame.Game.deck.white_cards.splice(
        randomIndex,
        1
      );
      playerhand.push(randomCard);
    }
    player.hand = playerhand;
    return player;
  });

  //setup the first random czar
  const randomIndex = Math.floor(
    Math.random() * (currentGame.Game.players.length - 1)
  );
  const randomPlayer = currentGame.Game.players[randomIndex];
  currentGame.Game.turns[0].czar = randomPlayer;

  //add player to turn
  const foundPlayer = Game.turns[0].white_cards.find(
    (player) => player.player === playerId
  );
  if (!foundPlayer) {
    Game.players.forEach((player) => {
      if (player.id !== randomPlayer.id)
        currentGame.Game.turns[0].white_cards.push({
          player: player.id,
          cards: player.hand,
          played_card: [],
          points: 0,
          active: true,
        });
    });
  }
  //activate timer trigger
  Game.timerTrigger = true;

  let currentStage = currentGame.Game.turns[0].stage;
  currentGame.Game.turns[0].stage = [...currentStage, "dealing", "black"];
  return currentGame;
};
export default dealCards;
