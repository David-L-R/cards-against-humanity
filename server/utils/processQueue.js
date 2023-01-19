import { changeGame } from "../controller/gameController.js";

const processQueue = async ({ queue, lobbyId, io, socket }) => {
  // abort loop if request array is empty
  if (queue[lobbyId].data.length === 0) {
    delete queue[lobbyId];
    return;
  }

  const data = queue[lobbyId].data.shift();

  await changeGame({ ...data, io, socket });

  processQueue({ lobbyId, io, socket, queue });
};

export default processQueue;
