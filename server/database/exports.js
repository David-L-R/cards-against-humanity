import { CardDeck } from "./cardModels.js";

//this function needs an object as param, creates a very new card set.
async function createNewCardSet(newSet) {
  let { white, black, name, official = false } = newSet && newSet;

  if (!validateType({ white, black, name, official })) return;

  const { whiteCards, blackCards } = processData(white, black, name);

  addToDatabase(name, whiteCards, blackCards, official);
}

function validateType({ white, black, name, official = false }) {
  const red = "\x1b[31m";

  if (!white || !Array.isArray(white)) {
    console.log(red, `"white" is: "${white}", but must be a "array`);
    return false;
  }

  if (!black || !Array.isArray(black)) {
    console.log(red, `"black" is: "${black}", but must be a "array"`);
    return false;
  }

  if (!name || typeof name !== "string") {
    console.log(red, `new card set needs to have a name`);
    return false;
  }
  return true;
}

function processData(white, black, name) {
  const whiteCards = white.map((card) => {
    card.pack = name;
    return card;
  });
  const blackCards = black.map((card) => {
    card.pack = name;
    return card;
  });

  return { whiteCards, blackCards };
}

async function addToDatabase(name, whiteCards, blackCards, official) {
  try {
    const card = await CardDeck.create({
      cardSetName: name,
      white: whiteCards,
      black: blackCards,
      official: official,
    });
    console.log(`added black Card: ${card}`);
    return card;
  } catch (error) {
    return console.log(red, "error adding cards to DB: ", error);
  }
}

async function getAllCards() {
  try {
    const allCards = CardDeck.find();

    return allCards;
  } catch (error) {
    return console.log("failed to get all cards: ", error);
  }
}

export { createNewCardSet, getAllCards };
