import LobbyCollection from "../database/models/lobby.js";
import GameCollection from "../database/models/game.js";
import consoleSuccess from "../utils/consoleSuccess.js";
import cardDecksData from "../data/allCards.json" assert { type: "json" };

export const createNewLobby = async ({ socket, data }) => {
  const { hostName, id } = data;
  socket.userId = id;
  const lobby = {
    games: [],
    waiting: [],
    players: [{ name: hostName, id, isHost: true }],
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

export const findRoomToJoin = async ({
  lobbyId,
  newPlayerName,
  socket,
  id,
  io,
}) => {
  const player = { name: newPlayerName, id };
  // searche game in MongoDb

  try {
    const lobby = await LobbyCollection.findById(lobbyId);

    // update player list in DB
    lobby.players.push(player);
    lobby.save();

    //join player into room and send lobbyId back
    socket.join(lobbyId);
    socket.emit("findRoom", {
      noRoom: false,
      lobbyId,
      playerName: newPlayerName,
    });

    //updateing room
    io.to(lobbyId).emit("updateRoom", { playerList: lobby.players });

    // socket.emit("updateRoom", { playerList: [1, 2, 3, 4, 5] });
  } catch (error) {
    return socket.emit("findRoom", {
      noRoom: true,
      err: "Can't find game",
    });
  }
};

export const updateClient = async ({ lobbyId, socket, name, id, io }) => {
  if (!lobbyId)
    return socket.emit("updateRoom", {
      err: "Cant find game to join, please add lobby ID",
    });

  socket.userId = id;

  try {
    const currentLobby = await LobbyCollection.findOne({ _id: lobbyId });
    const foundPLayer = currentLobby.players.find((player) => player.id === id);
    const findHost = currentLobby.players.find((player) => player.isHost);

    const newPlayer = { id, name };

    //if not a simgle player is in the Lobby, make the 1. player that is joining the host
    if (currentLobby.players.length === 0 || !findHost) newPlayer.isHost = true;

    if (!foundPLayer) currentLobby.players.push(newPlayer);
    await currentLobby.save();

    socket.join(lobbyId);
    io.to(lobbyId).emit("updateRoom", {
      playerList: currentLobby.players,
      host: findHost,
    });
  } catch (err) {
    socket.emit("updateRoom", {
      err: "cant update Client",
    });
  }
};

export const deletePlayerFromDb = async ({ reason, io, userId }) => {
  //delte player by disconnect

  try {
    const currentLobby = await LobbyCollection.findOne({
      "players.id": userId,
    });

    currentLobby.players = currentLobby.players.filter(
      (player) => player.id !== userId
    );

    const findHost = currentLobby.players.find((player) => player.isHost);

    if (!findHost) currentLobby.players[0].isHost = true;
    await currentLobby.save();

    return {
      playerList: currentLobby.players,
      lobbyId: currentLobby._id,
      err: false,
    };
  } catch (error) {
    return { err: "Cant find player to remove" };
  }
};
