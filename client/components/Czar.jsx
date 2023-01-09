import React, { useEffect, useState } from "react";
import style from "../styles/cardTemplate.module.css";
import { motion as m } from "framer-motion";

const Czar = ({
  blackCards,
  chooseBlackCard,
  setCardsOnTable,
  setBlackCards,
  gameStage,
  timer,
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
    if (index) {
      const [selected] = blackCards.splice(index, 1);

      setBlackCards(() => [...blackCards]);
      //update Drad and Drop data
      setCardsOnTable((prev) => {
        const newDeck = { ...prev };
        newDeck.table.cards = [selected.card];
        return newDeck;
      });
      setshowBlackCards(null);
      return chooseBlackCard(selected);
    }

    const [selected] = showBlackCards.splice(1, 1);
    setBlackCards(() => [...blackCards]);
    //update Drad and Drop data
    setCardsOnTable((prev) => {
      const newDeck = { ...prev };
      newDeck.table.cards = [selected.card];
      return newDeck;
    });
    setshowBlackCards(null);
    return chooseBlackCard(selected.card);
  };

  useEffect(() => {
    if (timer === null) {
      selectCard({ index: null });
    }
  }, [timer]);

  useEffect(() => {
    randomBlackCards();
  }, []);
  console.log("gameStage", gameStage);
  if (!showBlackCards || gameStage !== "black") return;

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
                  <m.div
                    className={` ${style.black} czarPicking`}
                    onClick={() => selectCard({ index: cardItem.index })}
                  >
                    {cardItem.card.text}
                  </m.div>
                }
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Czar;
