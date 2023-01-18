import GameCollection from "../database/models/game.js";
import LobbyCollection from "../database/models/lobby.js";
import allCards from "../data/allCards.json" assert { type: "json" };
import { updateGameInLobby } from "../utils/addGameToLobby.js";
import updateTurn from "../utils/updateTurn.js";
import { update } from "react-spring";

export const createGame = async ({
  setRounds,
  maxHandSize,
  lobbyId,
  io,
  socket,
}) => {
  let amountOfRounds = parseInt(setRounds);
  let handSize = parseInt(maxHandSize);

  //set default if client dos not setup anything
  if (!setRounds) amountOfRounds = 10;
  if (!maxHandSize) handSize = 10;

  try {
    //if alreday games where played, increase to game indentifiyer
    const lobby = await LobbyCollection.findById(lobbyId);
    let currentGameIndex = lobby.games.length;

    if (!lobby)
      return socket.to(lobbyId).emit("newgame", { err: "Can not find lobby" });

    // add each ACTIVE players all necessary keys
    const allPlayers = lobby.players
      .filter((player) => !player.inactive)
      .map((player) => {
        const newPLayer = { ...player };
        newPLayer.points = 0;
        newPLayer.hand = [];
        newPLayer.bet = false;
        newPLayer.inactive = false;
        return newPLayer;
      });

    if (allPlayers.length <= 1)
      return io.to(socket.id).emit("newgame", {
        err: "Please wait for at least one more  Player",
      });

    const [black] = allCards.map((set) => set.black);
    const [white] = allCards.map((set) => set.white);

    const gamedata = {
      id: lobbyId,
      setRounds: amountOfRounds,
      gameIdentifier: currentGameIndex,
      handSize: handSize,
      concluded: false,
      players: [...allPlayers],
      deck: {
        black_cards: [...black],
        white_cards: [...white],
      },
      turns: [
        {
          turn: 0,
          czar: null,
          stage: ["start"],
          white_cards: [],
          black_card: {},
          winner: {},
          completed: [],
        },
      ],
      timerTrigger: false,
    };

    const newGameData = await GameCollection.create({ Game: gamedata });
    updateGameInLobby(newGameData);
    io.to(lobbyId).emit("newgame", { newGameData });
  } catch (error) {
    io.to(lobbyId).emit("newgame", {
      err: "Can not create new Game, please host a new one",
    });
  }
};

export const sendCurrentGame = async ({
  gameIdentifier,
  lobbyId,
  name,
  id,
  io,
  socket,
}) => {
  if (!lobbyId || !id)
    return io.to(socket.id).emit("currentGame", { err: "Missing Lobby ID " });

  socket.userId = id;
  //jopin socket after disconnect
  socket.join(lobbyId);
  try {
    const currentGame = await GameCollection.findOne({
      "Game.id": lobbyId,
      "Game.gameIdentifier": gameIdentifier,
    });

    //if cant find loby, send error back
    if (!currentGame)
      return io
        .to(socket.id)
        .emit("currentGame", { err: "Cant find a running game" });
    // find current game by lobby id and gameidentifyer from lobby games array

    const foundPLayer = currentGame.Game.players.find(
      (player) => player.id === id
    );

    //if no player leaves or joines, just update the current client/player
    if (foundPLayer && foundPLayer.inactive === false) {
      currentGame.save();
      return io
        .to(socket.id)
        .emit("currentGame", { currentGame: currentGame.Game });
    }

    //if player rejoins, update everyone
    currentGame.Game.players = currentGame.Game.players.map((player) => {
      if (player.id === id) player.inactive = false;
      return player;
    });

    currentGame.save();
    io.to(lobbyId).emit("currentGame", { currentGame: currentGame.Game });
  } catch (error) {
    io.to(socket.id).emit("currentGame", {
      err: "Wrong lobby ID, please check your room code",
    });
  }
};

export const changeGame = async (
  {
    sendWhiteCards,
    blackCards,
    playerId,
    stage,
    gameId,
    gameIdentifier,
    lobbyId,
    playedBlack,
    playedWhite,
    winningCards,
    leavedGame,
  },
  io,
  socket
) => {
  if (stage === "dealing") {
    try {
      const currentGame = await GameCollection.findOne({
        "Game.id": gameId,
        "Game.gameIdentifier": gameIdentifier,
      });
      if (currentGame.Game.turns[0].stage.includes("dealing")) return;

      //deal random white cards to players
      const { Game } = currentGame;
      console.log("Game", Game);
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
      currentGame.save();
      io.to(lobbyId).emit("currentGame", { currentGame: currentGame.Game });
      return;
    } catch (error) {
      console.log("error", error);
      io.to(lobbyId).emit("currentGame", {
        err: "Can't update Game, please create a new one",
      });
      return;
    }
  }

  //change current turn
  try {
    const currentGame = await GameCollection.findOne({
      "Game.id": gameId,
      "Game.gameIdentifier": gameIdentifier,
    });
    const updatedGame = updateTurn({
      sendWhiteCards,
      currentGame,
      playedBlack,
      stage,
      playerId,
      blackCards,
      playedWhite,
      winningCards,
      leavedGame,
      socket,
      lobbyId,
      io,
    });
    updateGameInLobby(updatedGame);

    io.to(lobbyId).emit("currentGame", { currentGame: updatedGame.Game });
  } catch (error) {
    console.log("error", error);
    io.to(lobbyId).emit("currentGame", {
      err: "Server error, cant find game",
    });
  }
};
