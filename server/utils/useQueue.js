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

const queue = {}; // {lobby: {lobby: lobbyId, loading:Boolean, data:[{states to process, channelname}]}}
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

  const startTimer = performance.now();
  // add request from client to queue map
  queue[lobbyId] = {
    lobby: lobbyId,
    data: queue[lobbyId]?.data
      ? [...queue[lobbyId].data, { states: data, channelName }]
      : [{ states: data, channelName }],
    loading: queue[lobbyId]?.loading,
  };

  // execute queue
  if (!queue[lobbyId].loading) {
    queue[lobbyId].loading = true;
    await processQueue({ ...allData, queue, startTimer });
  }
};

const processQueue = async (allData) => {
  const { queue, data } = allData;
  const { lobbyId } = data;

  // abort loop if request array is empty
  if (queue[lobbyId].data.length === 0 || !queue[lobbyId]) {
    queue[lobbyId].loading = false;
    // delete queue[lobbyId];
    return;
  }

  const { states, channelName } = queue[lobbyId].data.shift();
  // console.log("RUN QUEUE");
  // console.log("states, channel", states, channelName);
  await callbacks[channelName]({ ...allData, ...states });

  processQueue(allData);
};

export default useQueue;
