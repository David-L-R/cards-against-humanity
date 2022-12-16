import { blackCard, whiteCard } from "./cardModels.js";

// function to add cards tom the Database
//USAGE example: addCardToDB({type:"black", text:"You look exactly like ....."})
async function addCardToDB(param) {
  const red = "\x1b[31m";
  const { type, text } = param && param;

  //error handle if data type is wrong
  if (!type || !text || typeof type !== "string" || typeof text !== "string") {
    return console.log(
      red,
      `can not add to Database! "type" is: "${type}", but must be a "string; "text" is: "${text}", but must be a "string"`
    );
  }

  //error handle is card type (black or white) is wrong
  if (type !== "black" && type !== "white")
    return console.log(
      red,
      `type is "${type}"! But must be eighter "black" or "white"`
    );

  //actuall divide between black or white cards
  if (type === "black") {
    try {
      const card = await blackCard.create({
        type: type,
        text: text,
      });
      console.log(`added black Card: ${card}`);
      return card;
    } catch (error) {
      return console.log(red, "error adding black card to DB: ", error);
    }
  }

  if (type === "white") {
    try {
      const card = await whiteCard.create({
        type: type,
        text: text,
      });
      console.log(`added white Card: ${card}`);
      return card;
    } catch (error) {
      return console.log(red, "error adding white card to DB: ", error);
    }
  }
}

async function getAllBlackCards() {
  try {
    return await blackCard.find();
  } catch (error) {
    return console.log("failed to get all black cards: ", error);
  }
}

async function getAllWhiteCards() {
  try {
    return await whiteCard.find();
  } catch (error) {
    return console.log("failed to get all white cards: ", error);
  }
}

async function getAllCards() {
  const whiteCards = whiteCard.find();
  const blackCards = blackCard.find();

  try {
    const cards = await Promise.all([whiteCards, blackCards]);
    const formattedCards = cards.reduce((prev, curr) => [...prev, ...curr]);

    return formattedCards;
  } catch (error) {
    return console.log("failed to get all cards: ", error);
  }
}

async function findCardByText(text) {
  const cards = await getAllCards();
  const filterByText = cards.filter((card) =>
    card.text.toLowerCase().includes(text.toLowerCase())
  );

  return filterByText;
}

export {
  findCardByText,
  getAllCards,
  addCardToDB,
  getAllBlackCards,
  getAllWhiteCards,
};
