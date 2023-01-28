import { getCache, storeToCache } from "../cache/useCache.js";
import LobbyCollection from "../database/models/lobby.js";

export const updateGameInLobby = async (game) => {
  const lobbyId = game.id;
  const currentLobbyData = await getCache({ lobbyId });
  const { currentLobby } = currentLobbyData;
  let currentGameIndex = currentLobby.games.length - 1;

  if (currentGameIndex < 0) currentGameIndex = 0;

  if (currentLobby.games[currentGameIndex]?.concluded) {
    const copyedGame = { ...game, deck: null };
    currentLobby.games.push(copyedGame);
    await storeToCache({ lobbyId, currentLobby });
    return LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();
  }

  const copyedGame = { ...game, deck: null };
  currentLobby.games[currentGameIndex] = copyedGame;
  await storeToCache({ lobbyId, currentLobby });
  return LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();
};
