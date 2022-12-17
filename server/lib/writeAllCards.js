import { writeFile } from "fs/promises";
import { getAllCards } from "../database/exports.js";

//write cards from DB to FileSystem
async function writeAllCards() {
  const allCards = await getAllCards();

  try {
    const content = JSON.stringify(allCards);
    writeFile("./data/allCards.json", content);
  } catch (error) {
    console.error(
      ` was not able to write content to allCards.json; error: `,
      error
    );
  }
}

export { writeAllCards };
