import React, { useEffect, useState } from "react";
import style from "../styles/cardTemplate.module.css";

const Czar = ({
  blackCards,
  chooseBlackCard,
  setCardsOnTable,
  setBlackCards,
}) => {
  const [showBlackCards, setshowBlackCards] = useState([]);

  const randomBlackCards = () => {
    const amountCardsToSelect = 3;
    const cardsToDisplay = [];
    for (let i = 0; i < amountCardsToSelect; i++) {
      const randomIndex = Math.floor(Math.random() * blackCards.length - 1);
      cardsToDisplay.push({
        card: blackCards[randomIndex],
        index: randomIndex,
      });
    }
    return setshowBlackCards((prev) => [...cardsToDisplay]);
  };

  const selectCard = ({ index }) => {
    //update all black cards
    const [selected] = blackCards.splice(index, 1);
    setBlackCards(() => [...blackCards]);
    //update Drad and Drop data
    setCardsOnTable((prev) => {
      const newDeck = { ...prev };
      newDeck.table.cards = [selected];
      return newDeck;
    });
    setshowBlackCards(null);
    chooseBlackCard(selected);
  };

  useEffect(() => {
    randomBlackCards();
  }, []);

  if (!showBlackCards) return;

  return (
    <section className="czarSelectionContainer">
      <div>
        <h1 className="czarPickingH1">You are the Czar!</h1>
        <h2>Select a Card </h2>
      </div>
      <div>
        <ul className="czarPickingContainer">
          {showBlackCards &&
            showBlackCards.map((cardItem) => (
              <li key={cardItem.card.text}>
                {
                  <div
                    className={` ${style.black} czarPicking`}
                    onClick={() => selectCard({ index: cardItem.index })}
                  >
                    {cardItem.card.text}
                  </div>
                }
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Czar;
