import LobbyCollection from "../database/models/lobby.js";
import GameCollection from "../database/models/game.js";
import consoleSuccess from "../utils/consoleSuccess.js";
import cardDecksData from "../data/allCards.json" assert { type: "json" };

export const createNewLobby = async ({ socket, data }) => {
  const { hostName } = data;
  const lobby = {
    games: [],
    waiting: [],
    players: [{ name: hostName, playerId: socket.id }],
  };

  console.log(lobby);

  try {
    const newLobby = await LobbyCollection.create({
      ...lobby,
    });

    consoleSuccess("Game created: ", newGame);

    const lobbyId = newLobby._id;

    console.log("lobby id", lobbyId);

    console.log("lobby", newLobby);

    socket.emit("LobbyCreated", { lobbyId, hostName });
    socket.join(lobbyId);
  } catch (err) {
    socket.emit("error", { err });
  }
};

export const createNewGame = async ({ socket, data }) => {
  const { hostName } = data;
  // const randomRoomCode = await checkRooms();
  const gameData = {
    ...data,
    // roomId: randomRoomCode,
    // round: 0,
    players: [{ playerName: hostName, playerId: socket.id }],
  };

  //Create game object and store in DB
  const newGame = await GameCollection.create({
    ...gameData,
    cardDecks: cardDecksData,
  });

  if (!newGame) return console.error("creating game Object failed");
  consoleSuccess("Game created: ", newGame);

  // return room ID to client
  const roomId = newGame.roomId;
  socket.emit("roomCreated", { roomId, hostName });
  socket.join(roomId);
};

export const findRoomToJoin = async ({ roomId, newPlayerName, socket }) => {
  const player = { playerName: newPlayerName, playerId: socket.id };

  // searche game in MongoDb
  const game = await GameCollection.findOne({ roomId: roomId });
  if (!game)
    return socket.emit("findRoom", {
      noRoom: true,
      message: "Can't find game",
    });

  // update player list in DB
  game.players.push(player);
  const updatetGame = await game.save();
  if (!updatetGame)
    return socket.emit("findRoom", {
      noRoom: true,
      message: "Can't join game",
    });

  //join player into room and send roomId back
  socket.join(roomId);
  socket.emit("findRoom", {
    noRoom: false,
    roomId,
    playerName: newPlayerName,
    message: "Joining romm",
  });

  //updateing room
  socket.to(roomId).emit("updateRoom", { playerList: updatetGame.players });
};

export const updateClient = async ({ roomId, socket }) => {
  if (!roomId)
    return socket.emit("updateRoom", { message: "Cant find game to join!" });

  const currentGame = await GameCollection.findOne({ roomId: roomId });
  if (!currentGame)
    return socket.emit("updateRoom", { message: "Cant find game to join!" });

  socket.emit("updateRoom", { playerList: currentGame.players });
};

export const deletePlayerFromDb = async ({ reason, io, socket }) => {
  //delte player by disconnect
  const currentGame = await GameCollection.findOne({
    "players.playerId": socket.id,
  });

  if (currentGame) {
    //delete player from players list
    currentGame.players = currentGame.players.filter(
      (player) => player.playerId !== socket.id
    );

    //update channel
    currentGame.save();
    return {
      playerList: currentGame.players,
      message: reason,
      roomId: currentGame.roomId,
    };
  }
};
