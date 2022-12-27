import allCards from "../../data/allCards.json" assert { type: "json" };

const getAllCards = (req, res) => {
  if (!allCards)
    return res.status(500).send("Server error, could not find Cards");

  res.status(200).send(allCards);
};

export default getAllCards;
