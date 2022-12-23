import GameCollection from "../../database/models/game.js";

const createGame = async (req, res) => {
  const players = parseInt(req.body?.players);

  if (!players)
    return res.status(400).json({ message: "Please add a number of players" });

  const newGame = await GameCollection.create({ players });

  res
    .status(201)
    .json({ message: "New Game Created ", gameId: newGame._id, newGame });
};

export default createGame;
