import LobbyCollection from "../database/models/lobby.js";

const updateTurn = async ({
  currentGame,
  playedBlack,
  stage,
  playerId,
  blackCards,
  playedWhite,
  winningCards,
  leavedGame,
  sendWhiteCards,
  socket,
  io,
  closeGame,
  kickPlayer,
  lobbyId,
}) => {
  const currentTurnIndex = currentGame?.Game?.turns?.length - 1;
  const currentTurn = currentGame?.Game?.turns[currentTurnIndex];

  //kick player
  if (kickPlayer) {
    //kick player from Lobby
    const currentLobby = await LobbyCollection.findById(lobbyId);
    console.log("currentLobby", currentLobby);
    currentLobby.players = currentLobby.players.filter(
      (player) => player.id !== playerId
    );
    await currentLobby.save();
    io.to(lobbyId).emit("updateRoom", { currentLobby, kicked: true });

    //kick player from game if played one
    if (currentGame?.Game) {
      currentGame.Game.players = currentGame.Game.players.filter(
        (player) => player.id !== playerId
      );
      //if czar was kicked assign a new one
      const czar = currentTurn.czar;
      if (czar.id === playerId) {
        currentTurn.czar = currentGame.Game.players.find(
          (player) => !player.inactive
        );
        currentTurn.stage = ["start", "dealing", "black"];
        currentTurn.black_card = null;
        return currentGame;
      }

      currentTurn.white_cards = currentTurn.white_cards.filter(
        (player) => player.player !== playerId
      );
      return currentGame;
    }
    return "kicked";
  }

  //if player closes the game
  if (closeGame) {
    currentGame.Game.concluded = true;
    return currentGame;
  }

  // set status to inactive if playver turns back to lobby
  if (leavedGame) {
    const currentPlayer = currentGame.Game.players.find(
      (curr) => curr.id === playerId
    );
    const currentCzar = currentTurn.czar;

    //if normal player leaves active, set inactive in white_cards
    if (currentPlayer) {
      currentPlayer.inactive = true;
    }

    //if czar leaves, asign a new czar
    if (currentCzar.id === currentPlayer.id) {
      const activePlayers = currentGame.Game.players.filter(
        (player) => !player.inactive
      );
      const randomIndex = Math.random() * (activePlayers.length - 1);
      const newCzar = activePlayers[randomIndex];

      //asign new czar
      currentTurn.czar = newCzar;

      //remove czar from white_cards
      currentTurn.white_cards = currentTurn.white_cards.filter(
        (player) => player.player !== newCzar.id
      );
    }

    //if not enough players, close game
    if (currentGame.Game.players.filter((player) => !player.inactive < 2))
      currentGame.Game.concluded = true;

    return currentGame;
  }

  // if user requests for a new white card
  if (sendWhiteCards) {
    const randomIndex =
      Math.random() * (currentGame.Game.deck.white_cards.length - 1);
    const [newWhite] = currentGame.Game.deck.white_cards.splice(randomIndex, 1);
    currentTurn.white_cards = currentTurn.white_cards.map((player) => {
      if (player.player === playerId) player.cards.push(newWhite);
      return player;
    });
    currentGame.Game.players = currentGame.Game.players.map((player) => {
      if (player.id === playerId) player.hand.push(newWhite);
      return player;
    });
    io.to(socket.id).emit("newWhiteCard", { newWhite });
    return currentGame;
  }

  // send every player the choosen black card
  if (stage === "black") {
    currentGame.Game.deck.black_cards = blackCards;
    currentTurn.stage = [...currentTurn.stage, "white"];
    currentTurn.black_card = playedBlack;
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

    //check if every active player submitted their cards by lookin into white_cards/played_cards
    const currentCzarId = currentTurn.czar.id;
    const activePlayers = currentGame.Game.players.filter(
      (player) => !player.inactive && player.id !== currentCzarId
    );
    const allPlayedCards = currentTurn.white_cards
      .filter(
        (player) =>
          player.player ===
            activePlayers.find(
              (foundPlayer) => foundPlayer.id === player.player
            )?.id && player.played_card.length > 0
      )
      .map((player) => player.played_card);

    if (allPlayedCards.length === activePlayers.length)
      currentTurn.stage.push("deciding");

    currentGame.Game = Game;

    return currentGame;
  }

  //send winner to players
  if (stage === "winner") {
    const { Game } = currentGame;
    const wonPlayer = currentTurn.white_cards
      .filter((player) => player.played_card.length > 0)
      .find((player) => player.played_card[0].text === winningCards[0].text);

    //add points to turn
    wonPlayer.played_card.forEach((card) => (wonPlayer.points += 10));
    currentTurn.winner = wonPlayer;
    //add points to global players
    Game.players.map((player) => {
      if (player.id === wonPlayer.player) player.points += wonPlayer.points;
      return player;
    });
    currentTurn.stage.push("winner");
    currentGame.Game = Game;
    return currentGame;
  }

  if (stage === "completed") {
    const { Game } = currentGame;

    currentTurn.completed.push(
      Game.players.find((player) => player.id === playerId)
    );
    //if every active player is ready, creat new turn
    if (
      currentTurn.completed.length >=
      Game.players.filter((player) => !player.inactive).length
    ) {
      const currCzarIndex = Game.players
        .filter((player) => !player.inactive)
        .indexOf(
          Game.players.find((player) => player.id === currentTurn.czar.id)
        );
      const lastPlayerIndex =
        Game.players.filter((player) => !player.inactive).length - 1;
      //if cazr is last palyer in array, take the first player
      const nextCzar =
        currCzarIndex === lastPlayerIndex
          ? Game.players[0]
          : Game.players[currCzarIndex + 1];
      // create new turn

      const newTurn = {
        turn: currentTurn.turn + 1,
        czar: nextCzar,
        stage: "black",
        white_cards: Game.players
          // .filter((player) => player.id !== nextCzar.id && !player.inactive)
          .map((player) => {
            return { player: player.id, cards: player.hand, played_card: [] };
          }),
        black_card: {},
        winner: {},
        completed: [],
      };
      currentGame.Game.turns.push(newTurn);
    }
    return currentGame;
  }
};

export default updateTurn;
