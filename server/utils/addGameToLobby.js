import LobbyCollection from "../database/models/lobby.js";

export const addNewGameToLobby = async (game) => {
  const currentLobbyId = game.Game.id;
  const lobby = await LobbyCollection.findById(currentLobbyId);

  lobby.games.push(game);
  const response = await lobby.save();
  return response;
};
