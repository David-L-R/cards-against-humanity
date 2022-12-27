import LobbyCollection from "../database/models/lobby.js";
import GameCollection from "../database/models/game.js";
import consoleSuccess from "../utils/consoleSuccess.js";
import cardDecksData from "../data/allCards.json" assert { type: "json" };

export const createNewLobby = async ({ socket, data }) => {
  const { hostName } = data;
  const lobby = {
    games: [],
    waiting: [],
    players: [{ name: hostName, id: socket.id }],
  };

  try {
    const newLobby = await LobbyCollection.create({
      ...lobby,
    });

    const lobbyId = newLobby._id.toString();

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

export const findRoomToJoin = async ({ lobbyId, newPlayerName, socket }) => {
  const player = { name: newPlayerName, id: socket.id };

  // searche game in MongoDb
  const lobby = await LobbyCollection.findOne({ _id: lobbyId });
  console.log("lobby", lobby);
  if (!lobby)
    return socket.emit("findRoom", {
      noRoom: true,
      err: "Can't find game",
    });

  // update player list in DB
  lobby.players.push(player);
  const updatedLobby = await lobby.save();
  if (!updatedLobby)
    return socket.emit("findRoom", {
      noRoom: true,
      message: "Can't join game",
    });

  //join player into room and send lobbyId back
  socket.join(lobbyId);
  socket.emit("findRoom", {
    noRoom: false,
    lobbyId,
    playerName: newPlayerName,
    message: "Joining romm",
  });

  //updateing room
  socket.to(lobbyId).emit("updateRoom", { playerList: updatedLobby.players });
};

export const updateClient = async ({ lobbyId, socket }) => {
  if (!lobbyId)
    return socket.emit("updateRoom", { message: "Cant find game to join!" });

  const currentLobby = await LobbyCollection.findOne({ _id: lobbyId });
  console.log(currentLobby);
  if (!currentLobby)
    return socket.emit("updateRoom", {
      err: "cant update Client",
      message: "Cant find game to join!",
    });

  socket.emit("updateRoom", { playerList: currentLobby.players });
};

export const deletePlayerFromDb = async ({ reason, io, socket }) => {
  //delte player by disconnect
  const currentLobby = await LobbyCollection.findOne({
    "players.id": socket.id,
  });

  if (currentLobby) {
    //delete player from players list
    currentLobby.players = currentLobby.players.filter(
      (player) => player.id !== socket.id
    );

    //update channel
    currentLobby.save();
    return {
      playerList: currentLobby.players,
      message: reason,
      lobbyId: currentLobby._id.toString(),
    };
  }
  return { playerList: 0 };
};
