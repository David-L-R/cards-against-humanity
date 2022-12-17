import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { writeAllCards } from "./writeAllCards.js";

async function initialLoadData() {
  const folder = existsSync("./data");

  //if data folder not exists, create new one
  if (!folder) {
    try {
      const folder = new URL(`../data`, import.meta.url);
      const createDir = await mkdir(folder, { recursive: true });
      console.log(`created folder: ${createDir} `);
    } catch (error) {
      console.error("Could not create folder: ", error);
    }
  }

  writeAllCards();
}

export { initialLoadData };
