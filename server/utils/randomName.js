const randomName = () => {
  const names = [
    "Anal Intruder",
    "Dick Master",
    "King Dingeling",
    "Lana Reverse",
    "MOM",
  ];
  const randomIndex = Math.floor(Math.random() * (names.length - 1));
  return names[randomIndex];
};

export default randomName;
