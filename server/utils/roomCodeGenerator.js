export const generateRoomCode = () => {
  const characters =
    "abcdefghijklmnopqrstuvwzABCDEFGHIJKLMNOPQRSTUVWZ0123456789";
  const roomIdLength = 5; // Indicator how long the Code would be
  const roomId = [];

  for (let i = 0; i < roomIdLength; i++) {
    //create a random character and store it in "roomId"
    const randomChar =
      characters[Math.floor(Math.random() * characters.length)];
    roomId.push(randomChar);
  }

  //change into string
  const roomIdIntoString = roomId.join().replaceAll(",", "");
  return roomIdIntoString;
};
