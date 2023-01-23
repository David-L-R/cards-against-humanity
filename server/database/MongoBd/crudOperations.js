import { ObjectId } from "mongodb";
import { database } from "../../index.js";

export async function collectionCreateLobby({ lobby }) {
  try {
    const collection = database.collection("lobbyCollection");
    const createdLobby = await collection.insertOne({
      ...lobby,
    });
    const id = createdLobby.insertedId.toString();

    return id;
  } catch (error) {
    console.error(error);
  }
}

export async function collectionFindLobby({ lobbyId, userId }) {
  try {
    const lobbys = database.collection("lobbyCollection");
    let filter = { _id: ObjectId(lobbyId) };
    if (userId)
      filter = {
        "waiting.id": userId,
      };
    const curser = lobbys.find(filter).sort({ _id: -1 }).limit(1);
    //.sort({ timestamp: -1, createdAt: -1 });
    const [lobby] = await curser.toArray();
    return lobby;
  } catch (error) {
    console.error(error);
  }
}

export async function collectionChangeLobby({ lobbyId, currentLobby }) {
  try {
    const lobbys = database.collection("lobbyCollection");

    const filter = { _id: ObjectId(lobbyId) };
    const updateDoc = { $set: currentLobby };

    const lobby = await lobbys.updateOne(filter, updateDoc);

    return lobbyId;
  } catch (error) {
    console.error(error);
  }
}

export async function collectionCreateGame(Game) {
  try {
    const collection = database.collection("gameCollection");
    await collection.insertOne({
      ...Game,
      timestamp: { $currentDate: { createdAt: { $type: "timestamp" } } },
    });

    return Game;
  } catch (error) {
    console.error(error);
  }
}

export async function collectionFindGame({ lobbyId, gameIdentifier }) {
  try {
    const games = database.collection("gameCollection");
    const filter = {
      "Game.id": lobbyId,
      "Game.gameIdentifier": parseInt(gameIdentifier),
    };

    const game = await games.findOne(filter);

    return game;
  } catch (error) {
    console.error(error);
  }
}

export async function collectionChangeGame({
  lobbyId,
  gameIdentifier,
  currentGame,
}) {
  try {
    const games = database.collection("gameCollection");
    const filter = {
      "Game.id": lobbyId,
      "Game.gameIdentifier": parseInt(gameIdentifier),
    };

    const updateDoc = { $set: currentGame };
    const game = await games.updateOne(filter, updateDoc);

    return game;
  } catch (error) {
    console.error(error);
  }
}
