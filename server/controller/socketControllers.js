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
    players: [{ name: hostName, id, isHost: true, inactive: false }],
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
  const player = { name: newPlayerName, id, inactive: false, isHost: false };

  console.log("lobbyId", lobbyId);

  // searche game in MongoDb
  try {
    const lobby = await LobbyCollection.findById(lobbyId);

    // update player list in DB
    lobby.players.push(player);
    lobby.save();

    //join player into room and send lobbyId back
    socket.join(lobbyId);
    socket.emit("foundRoom", {
      noRoom: false,
      lobbyId,
      playerName: newPlayerName,
    });

    //updateing room
    io.to(lobbyId).emit("updateRoom", { currentLobby: lobby });
  } catch (error) {
    return socket.emit("foundRoom", {
      noRoom: true,
      err: "Can't find game",
    });
  }
};

export const updateClient = async ({ lobbyId, socket, name, id, io }) => {
  if (!lobbyId || !id)
    return socket.emit("updateRoom", {
      err: "Cant find game to join. Wrong lobby id or player id",
    });

  socket.userId = id;

  try {
    const currentLobby = await LobbyCollection.findOne({ _id: lobbyId });
    const foundPLayer = currentLobby.players.find((player) => player.id === id);

    if (foundPLayer) {
      foundPLayer.inactive = false;
      const playerIndex = currentLobby.players.findIndex(
        (player) => player.id === id
      );
      if (playerIndex === 0) {
        foundPLayer.isHost = true;

        currentLobby.players = currentLobby.players.map((player, index) => {
          if (index === 0) return player;
          player.isHost = false;
          return player;
        });
      }
      // const findHost = currentLobby.players.find((player) => player.isHost);
    }
    socket.join(lobbyId);

    await currentLobby.save();

    io.to(lobbyId).emit("updateRoom", {
      currentLobby: currentLobby,
    });
  } catch (err) {
    socket.emit("updateRoom", {
      err: "cant update Client",
    });
  }
};

export const setPlayerInactive = async ({ reason, io, userId }) => {
  //set player inactive on disconnect
  try {
    const currentLobby = await LobbyCollection.findOne({
      "players.id": userId,
    });

    //search for player that needs to be deletet from lobby
    currentLobby.players = currentLobby.players.map((player) => {
      if (player.id === userId) player.inactive = true;
      if (player.isHost) player.isHost = false;
      return player;
    });

    //find actuall host
    let findHost = currentLobby.players.find((player) => {
      return player.isHost && !player.inactive;
    });

    //if no host inside game, make the next PLayer to host
    if (!findHost) {
      const activePlayerIndex = currentLobby.players.findIndex(
        (player) => !player.inactive
      );
      if (activePlayerIndex >= 0) {
        currentLobby.players[activePlayerIndex].isHost = true;
        findHost = currentLobby.players[activePlayerIndex];
      }
    }
    const lobby = await currentLobby.save();
    const lobbyId = lobby._id.toString();

    if (lobbyId) io.to(lobbyId).emit("updateRoom", { currentLobby });
  } catch (error) {
    return { err: "Cant find player to remove" };
  }
};
