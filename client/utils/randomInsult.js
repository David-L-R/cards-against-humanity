const randomInsult = () => {
  const reason = [
    "with your Mom ",
    "just goes pooping",
    "is dancing in the rain",
    "just cries",
    "search for some cotton",
  ];
  const randomIndex = Math.floor(Math.random() * (reason.length - 1));

  return reason[randomIndex];
};

export default randomInsult;
