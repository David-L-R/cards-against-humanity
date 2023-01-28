import NodeCache from "node-cache";
import LobbyCollection from "../database/models/lobby.js";
import GameCollection from "../database/models/game.js";
import { colorToRgba } from "@react-spring/shared";

//stdTTL = livetime, this will delte data after 48h
export const serverCache = new NodeCache({ stdTTL: 86400 });

export const storeToCache = async ({ lobbyId, currentLobby, currentGame }) => {
  let currentLobbyData = await getCache({ lobbyId });

  if (!lobbyId) return console.error("no lobby ID!");

  currentLobby && (currentLobbyData.currentLobby = currentLobby);
  currentGame && (currentLobbyData.currentGame = currentGame);

  // store user id combared to lobbyID
  if (currentLobbyData.currentLobby)
    currentLobbyData.currentLobby.waiting.forEach((player) =>
      serverCache.set(
        player.id,
        JSON.stringify(currentLobbyData.currentLobby._id)
      )
    );
  const success = serverCache.set(lobbyId, JSON.stringify(currentLobbyData));
  if (!success) throw new Error("Store to cache failed!");
  return currentLobbyData;
};

export const getCache = async ({ lobbyId }) => {
  if (!lobbyId || typeof lobbyId !== "string")
    return new Error("no valid lobbyId to searche for in 'getCache'");

  let currentLobbyData = await serverCache.get(lobbyId);

  if (!currentLobbyData) {
    const lobbyFromDB = await LobbyCollection.findById(lobbyId);
    const gameIdent =
      lobbyFromDB.games.length - 1 >= 0 ? lobbyFromDB.games.length - 1 : 0;
    const gameFromDb = await GameCollection.findOne({
      id: lobbyId,
      gameIdentifier: gameIdent,
    });
    const currentLobbyData = {
      currentLobby: lobbyFromDB ? lobbyFromDB : null,
      currentGame: gameFromDb ? gameFromDb : null,
    };

    const success = serverCache.set(lobbyId, JSON.stringify(currentLobbyData));
    if (!success) throw new Error("Store to cache failed!");

    return currentLobbyData;
  }
  return JSON.parse(currentLobbyData);
};

export const getLobbyIdFromCache = ({ userId }) => {
  if (!userId) throw new Error("no userId to search for lobby id");
  const lobbyId = serverCache.take(userId);
  if (!lobbyId) throw new Error("cand find lobby id in 'getLobbyIdFromCache");
  return JSON.parse(lobbyId);
};
