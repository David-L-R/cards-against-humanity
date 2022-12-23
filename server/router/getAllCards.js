import { existsSync } from "fs";
import { readFile } from "fs/promises";

const allCards = async (req, res) => {
  const cardFile = existsSync("./data/allCards.json");

  if (!cardFile)
    return res.status(500).send("Server error, could not find Cards");
  try {
    const allcards = await readFile("./data/allCards.json", "utf8");
    res.status(200).send(allcards);
  } catch (error) {
    console.error("Could not read file: ", error);
    res.status(500).send("Server error, Could not read file");
  }
};

export default allCards;
