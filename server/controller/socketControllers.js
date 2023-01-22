import LobbyCollection from "../database/models/lobby.js";
import GameCollection from "../database/models/game.js";
import randomName from "../utils/randomName.js";
import {
  collectionCreateLobby,
  collectionFindLobby,
} from "../database/MongoBd/crudOperations.js";

export const createNewLobby = async (data) => {
  const { hostName, id, socket } = data;
  const lobby = {
    games: [],
    waiting: [{ name: hostName, id, isHost: true, inactive: false, points: 0 }],
    players: [],
  };
  try {
    const lobbyId = await collectionCreateLobby({ lobby });

    socket.emit("LobbyCreated", { lobbyId, hostName });
    socket.join(lobbyId);
  } catch (err) {
    console.error(err);
    socket.emit("error", { err });
    process.exit();
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

  // searche game in MongoDb
  try {
    const lobby = await collectionFindLobby({ lobbyId });

    // update player list in DB
    lobby.players.push(player);

    //join player into room and send lobbyId back
    socket.join(lobbyId);
    socket.emit("foundRoom", {
      noRoom: false,
      lobbyId,
      playerName: newPlayerName,
    });

    //updateing room
    io.to(lobbyId).emit("updateRoom", { currentLobby: lobby });
    await lobby.save();
  } catch (error) {
    return socket.emit("foundRoom", {
      noRoom: true,
      err: "Can't find game",
    });
  }
};

export const updateClient = async (data) => {
  const { lobbyId, socket, joinGame, id, io, newPLayerName, avatar } = data;
  socket.userId = id;

  if (!lobbyId || !id)
    return socket.emit("updateRoom", {
      err: "Cant find game to join. Wrong lobby id or player id",
    });

  try {
    const currentLobby = await collectionFindLobby({ lobbyId });
    if (!currentLobby) throw new Error("Lobby not Found");
    const foundPLayer = currentLobby.waiting.find((player) => player.id === id);

    // delte players from lobby.players to be available for a game rejoining  lobby
    currentLobby.players = currentLobby.players.filter(
      (currPlayer) => currPlayer.id !== id
    );

    if (newPLayerName) foundPLayer.name = newPLayerName;

    if (foundPLayer) {
      foundPLayer.inactive = false;
      foundPLayer.avatar = avatar && avatar;
      const playerIndex = currentLobby.waiting.findIndex(
        (player) => player.id === id
      );
      if (playerIndex === 0) {
        foundPLayer.isHost = true;
        //change alle other player to be not the host
        currentLobby.waiting = currentLobby.waiting.map((player, index) => {
          if (index === 0) return player;
          player.isHost = false;
          return player;
        });
      }
    }
    // join new player after using invitation link
    if (!foundPLayer && joinGame) {
      const newPLayer = {
        id,
        isHost: false,
        inactive: false,
        name: randomName(),
        points: 0,
      };
      currentLobby.waiting.push(newPLayer);
    }
    socket.join(lobbyId);

    io.to(lobbyId).emit("updateRoom", {
      currentLobby,
    });
    await currentLobby.save();
  } catch (err) {
    console.error(err);
    socket.emit("updateRoom", {
      err: "cant update Client",
    });
  }
};

export const setPlayerInactive = async ({ io, userId }) => {
  //set player inactive on disconnect
  try {
    const lobbyList = await LobbyCollection.find({
      "waiting.id": userId,
    });
    const currentLobby = lobbyList[lobbyList.length - 1];
    if (!currentLobby) return;

    //set leaving player inactive if they are in a running game
    const currenGameIndex = currentLobby?.games?.length - 1;
    if (currenGameIndex && currenGameIndex >= 0) {
      const gameId = currentLobby._id.toString();
      const currentGame = await GameCollection.findOne({
        "Game.id": gameId,
        "Game.gameIdentifier": currenGameIndex,
      });
      const currentTurn =
        currentGame.Game.turns[currentGame.Game.turns.length - 1];
      const currenCzar = currentTurn?.czar;
      currentGame.Game.players = currentGame.Game.players.map((player) => {
        if (player.id === userId) player.inactive = true;
        return player;
      });

      // if czar leaves, assign a new one
      if (currenCzar?.id === userId) {
        currentTurn.czar = currentGame.Game.players.find(
          (player) => !player.inactive
        );
        //reset the current turn and start with a new czar
        currentTurn.stage = ["start", "dealing", "black"];
        currentTurn.white_cards = currentTurn.white_cards.map((player) => ({
          ...player,
          played_card: [],
        }));
        currentTurn.black_card = null;
      }
      io.to(gameId).emit("currentGame", { currentGame: currentGame.Game });
      await currentGame.save();
    }
    //search for player that needs to be set inactive from lobby

    currentLobby.waiting = currentLobby.waiting.map((player) => {
      if (player.id === userId) player.inactive = true;
      if (player.isHost) player.isHost = false;
      return player;
    });

    //find actuall host
    let findHost = currentLobby.waiting.find((player) => {
      return player.isHost && !player.inactive;
    });

    //if no host inside game, make the next PLayer to host
    if (!findHost) {
      const activePlayerIndex = currentLobby.waiting.findIndex(
        (player) => !player.inactive
      );
      if (activePlayerIndex >= 0) {
        currentLobby.waiting[activePlayerIndex].isHost = true;
        findHost = currentLobby.waiting[activePlayerIndex];
      }
    }
    const lobby = await currentLobby.save();
    const lobbyId = lobby._id.toString();

    if (lobbyId) io.to(lobbyId).emit("updateRoom", { currentLobby });
  } catch (error) {
    console.error(error);
    return { err: "Cant find player to remove" };
  }
};
