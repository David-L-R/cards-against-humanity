import LobbyCollection from "../database/models/lobby.js";
import {
  collectionChangeLobby,
  collectionFindLobby,
} from "../database/MongoBd/crudOperations.js";

export const updateGameInLobby = async (game) => {
  const currentLobbyId = game.Game.id;
  const lobby = await collectionFindLobby({ lobbyId: currentLobbyId });
  let currentGameIndex = lobby.games.length - 1;

  if (currentGameIndex < 0) currentGameIndex = 0;

  if (lobby.games[currentGameIndex]?.Game.concluded) {
    lobby.games.push(game);
    await collectionChangeLobby({
      lobbyId: currentLobbyId,
      currentLobby: lobby,
    });

    return;
  }
  lobby.games[currentGameIndex] = game;
  await collectionChangeLobby({ lobbyId: currentLobbyId, currentLobby: lobby });

  return;
};
