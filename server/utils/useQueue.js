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
import { queue } from "../index.js";

const callbacks = {
  changeGame: changeGame,
  getUpdatedGame: sendCurrentGame,
  createGameObject: createGame,
  disconnect: setPlayerInactive,
  findRoom: findRoomToJoin,
  updateLobby: updateClient,
  createNewLobby: createNewLobby,
};

const useQueue = async (allData) => {
  const { data, channelName } = allData;
  const { lobbyId } = data;

  // add request from client to queue map
  queue[lobbyId] = {
    lobby: lobbyId,
    data: queue[lobbyId]?.data
      ? [...queue[lobbyId].data, { states: data, channelName }]
      : [{ states: data, channelName }],
    loading: queue[lobbyId]?.loading,
  };
  // queue[lobbyId].lobby = 2;
  // queue[lobbyId].data.push({ states: data, channelName });

  showQueue();

  // execute queue
  if (!queue[lobbyId].loading) {
    queue[lobbyId].loading = true;
    processQueue({ ...allData, queue });
  }
};

const processQueue = async (allData) => {
  const { queue, data } = allData;
  const { lobbyId } = data;

  // abort loop if request array is empty
  if (queue[lobbyId].data.length === 0) {
    queue[lobbyId].loading = false;
    //delete queue[lobbyId];
    return;
  }

  const { states, channelName } = queue[lobbyId].data.shift();
  try {
    await callbacks[channelName]({ ...allData, ...states });
  } catch (error) {
    console.log("queue loob error!", error);
  }

  processQueue(allData);
};

const showQueue = () => {
  console.log(
    "---------------------------------------------------------------",
    queue
  );
};

export default useQueue;
