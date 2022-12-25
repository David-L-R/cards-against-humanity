import consoleSuccess from "../utils/consoleSuccess.js";

const deleteOutatedData = async (GameCollection) => {
  // Delete documents that are older than 48hours
  const currentTime = Date.now();
  const deleteThreshold = currentTime - 1; //172800000; // 48 hours in milliseconds
  const collection = await GameCollection.find();

  collection.forEach((dataSet) => {
    const DataTime = new Date(dataSet.createdAt).getTime();
    if (DataTime < deleteThreshold)
      GameCollection.deleteOne({ _id: dataSet._id }, (err) =>
        console.warn("Cannot delete data: ", err)
      );
  });
  consoleSuccess("Deleted old data after 48h successfully");
};
export default deleteOutatedData;
