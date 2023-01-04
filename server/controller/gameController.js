import GameCollection from "../database/models/game.js";
import LobbyCollection from "../database/models/lobby.js";
import allCards from "../data/allCards.json" assert { type: "json" };
import { addNewGameToLobby } from "../utils/addGameToLobby.js";

export const createGame = async ({ setRounds, maxHandSize, lobbyId, io }) => {
  let amountOfRounds = parseInt(setRounds);
  let handSize = parseInt(maxHandSize);

  //set default if client dos not setup anything
  if (!setRounds) amountOfRounds = 10;
  if (!maxHandSize) handSize = 10;

  //if alreday games where played, increase to game indentifiyer
  let existingGames = GameCollection.find({ id: lobbyId });

  let lastGame = 0;

  if (existingGames.length > 0)
    lastGame = existingGames[existingGames.length - 1].gameIdentifier + 1;

  let lobbyPLayers = await LobbyCollection.findOne({ _id: lobbyId });
  if (!lobbyPLayers)
    return socket.to(lobbyId).emit("newgame", { err: "cant find lobby" });

  // add each player all necessary keys
  lobbyPLayers = lobbyPLayers.players.map((player) => {
    player.active = true;
    player.points = 0;
    player.hand = [];
    player.bet = false;
    return player;
  });

  const [black] = allCards.map((set) => set.black);
  const [white] = allCards.map((set) => set.white);

  const gamedata = {
    id: lobbyId,
    setRounds: amountOfRounds,
    gameIdentifier: lastGame,
    handSize: handSize,
    concluded: false,
    players: lobbyPLayers,
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
        black_cards: [],
        winner: {},
      },
    ],
    timerTrigger: false,
  };

  const newGameData = await GameCollection.create({ Game: gamedata });
  await addNewGameToLobby(newGameData);

  io.to(lobbyId).emit("newgame", { newGameData });
};

export const sendCurrentGame = async ({ lobbyId, name, id, io, socket }) => {
  if (!lobbyId || !id)
    return io
      .to(lobbyId)
      .emit("currentGame", { err: "Please add a lobby ID and " });

  //jopin socket after disconnect
  socket.join(lobbyId);

  //find the gameIdentifiyer from Lobby
  const currentLobby = await LobbyCollection.findById(lobbyId);
  const currentGameIndex = currentLobby.games.length - 1;
  const currentGameId =
    currentLobby.games[currentGameIndex].Game.gameIdentifier;

  // if no game is stored in lobby
  if (currentGameIndex < 0)
    io.to(lobbyId).emit("currentGame", { err: "Cant find a running game" });

  // find current game by lobby id and gameidentifyer from lobby games array
  const currentGame = await GameCollection.findOne({
    "Game.id": lobbyId,
    "Game.gameIdentifier": currentGameId,
  });

  io.to(lobbyId).emit("currentGame", { currentGame: currentGame.Game });
};

export const changeGame = async ({
  deck,
  player,
  stage,
  gameId,
  gameIdentifier,
  lobbyId,
  io,
}) => {
  if (stage === "dealing") {
    const currentGame = await GameCollection.findOne({ "Game.id": gameId });

    //deal random white cards to players
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
    currentGame.Game.turns[0].stage.push("dealing");
    currentGame.save();
    io.to(lobbyId).emit("currentGame", { currentGame: currentGame.Game });
  }
};
