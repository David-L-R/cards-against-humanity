import LobbyCollection from "../database/models/lobby.js";

export const updateGameInLobby = async (game) => {
  const currentLobbyId = game.Game.id;
  const lobby = await LobbyCollection.findById(currentLobbyId);
  let currentGameIndex = lobby.games.length - 1;

  if (currentGameIndex < 0) currentGameIndex = 0;

  if (lobby.games[currentGameIndex]?.Game.concluded) {
    lobby.games.push(game);
    return await lobby.save();
  }
  lobby.games[currentGameIndex] = game;
  return await lobby.save();
};
