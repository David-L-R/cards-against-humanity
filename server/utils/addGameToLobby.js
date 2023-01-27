import { getCache, storeToCache } from "../cache/useCache.js";
import LobbyCollection from "../database/models/lobby.js";

export const updateGameInLobby = async (game) => {
  const lobbyId = game.id;
  const currentLobbyData = await getCache({ lobbyId });
  const { currentLobby } = currentLobbyData;
  let currentGameIndex = currentLobby.games.length - 1;

  if (currentGameIndex < 0) currentGameIndex = 0;

  if (currentLobby.games[currentGameIndex]?.concluded) {
    currentLobby.games.push(game);
    await storeToCache({ lobbyId, currentLobby });
    return LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();
  }
  currentLobby.games[currentGameIndex] = game;
  await storeToCache({ lobbyId, currentLobby });
  return LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();
};
