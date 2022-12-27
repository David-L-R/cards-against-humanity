import GameCollection from "../../database/models/game.js";

const updateGame = async (req, res) => {
  const { playerIndex, gameId } = parseInt(req.body);

  if (!playerIndex || !gameId)
    return res
      .status(400)
      .json({ message: "Please add player Index and gameId" });

  //Search MongoDb game data by gameID
  const currentGame = await GameCollection.findById(gameId);

  if (!currentGame)
    return res
      .status(400)
      .json({ message: "Cant find game, please add or check gameId" });

  //Your code
  //change data with socket.io like this
  //currentGame.players = 1002;

  const updatedGame = await currentGame.save();

  res.status(200).json({ message: "Game updated", gameId, updatedGame });
};

export default updateGame;
