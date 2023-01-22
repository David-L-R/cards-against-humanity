import { ObjectId } from "mongodb";
import { database } from "../../index.js";

export async function collectionCreateLobby({ data }) {
  try {
    const collection = database.collection("lobbyCollection");

    const lobby = await collection.insertOne({ ...data });
    const id = lobby.insertedId.toString();
    return id;
  } catch (error) {
    console.error(error);
  }
}

export async function collectionFindLobby({ lobbyId }) {
  try {
    const lobbys = database.collection("lobbyCollection");
    const lobby = await lobbys.findOne({ _id: ObjectId(lobbyId) });
    console.log("lobby", lobby);
    return lobby;
  } catch (error) {
    console.error(error);
  }
}

export async function collectionChangeLobby({ lobbyId }) {
  try {
    const lobbys = database.collection("lobbyCollection");
    const lobby = await lobbys.findOneAndUpdate({ _id: ObjectId(lobbyId) });
    console.log("lobby", lobby);
    return lobby;
  } catch (error) {
    console.error(error);
  }
}
