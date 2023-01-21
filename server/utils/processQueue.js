import {
  changeGame,
  createGame,
  sendCurrentGame,
} from "../controller/gameController.js";
import {
  createNewLobby,
  findRoomToJoin,
  setPlayerInactive,
  updateClient,
} from "../controller/socketControllers.js";

const callbacks = {
  changeGame: changeGame,
  getUpdatedGame: sendCurrentGame,
  createGameObject: createGame,
  disconnect: setPlayerInactive,
  findRoom: findRoomToJoin,
  updateLobby: updateClient,
  createNewLobby: createNewLobby,
};

const processQueue = async (allData) => {
  const { queue, lobbyId } = allData;

  // abort loop if request array is empty
  if (queue[lobbyId].data.length === 0) {
    delete queue[lobbyId];
    return;
  }

  const data = queue[lobbyId].data.shift();
  const channelName = queue[lobbyId].channelName;

  await callbacks[channelName]({ ...allData, ...data });

  processQueue(allData);
};

export default processQueue;
