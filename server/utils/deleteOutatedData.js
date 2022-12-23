import consoleSuccess from "../utils/consoleSuccess.js";

const deleteOutatedData = (GameCollection) => {
  // Delete documents that are older than 48hours
  const currentTime = Date.now();
  const deleteThreshold = currentTime - 172800; // 48 hours in milliseconds

  GameCollection.deleteMany(
    { "timestamps.createdAt": { $lt: deleteThreshold } },
    (error) => {
      if (error) return console.error(error);
      consoleSuccess("Deleted outdated documents successfully");
    }
  );
};
export default deleteOutatedData;
