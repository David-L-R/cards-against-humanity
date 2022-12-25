export const generateRoomCode = () => {
  const characters =
    "abcdefghijklmnopqrstuvwzABCDEFGHIJKLMNOPQRSTUVWZ0123456789";
  const roomIdLength = 5;
  const roomId = [];
  for (let i = 0; i < roomIdLength; i++) {
    //acces random character
    const randomChar =
      characters[Math.floor(Math.random() * characters.length)];
    roomId.push(randomChar);
  }
  const roomIdIntoString = roomId.join().replaceAll(",", "");
  return roomIdIntoString;
};
