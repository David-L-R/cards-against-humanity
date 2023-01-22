import processQueue from "./processQueue.js";

const queue = {}; // {lobby: {lobby: lobbyId, loading:Boolean, data:[{data to precess}]}, channel: listenerName}

const useQueue = (allData) => {
  const { data, channelName } = allData;
  const { lobbyId } = data;

  // add request from client to queue map
  queue[lobbyId] = {
    lobby: lobbyId,
    data: queue[lobbyId]?.data ? [...queue[lobbyId].data, data] : [data],
    loading: queue[lobbyId]?.loading ? queue[lobbyId].loading : false,
    channelName,
  };

  console.log("queue", queue);
  console.log("queue[lobbyId].data", queue[lobbyId].data);

  // execute queue
  if (!queue[lobbyId].loading) {
    queue[lobbyId].loading = true;
    processQueue({ ...allData, ...data, queue });
  }
};
export default useQueue;
