import { MongoClient } from "mongodb";
import consoleSuccess from "../../utils/consoleSuccess.js";

export const connectToCluster = async (uri) => {
  let mongoClient;

  try {
    mongoClient = new MongoClient(process.env.DB_URI);
    // await mongoClient.connect();

    consoleSuccess("Successfully connected to MongoDB Atlas!");
    const db = mongoClient.db("table");

    return db;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
};
