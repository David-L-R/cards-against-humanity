import React, { useEffect, useRef, useState } from "react";
import style from "../styles/cardTemplate.module.css";
import { AnimatePresence, motion as m } from "framer-motion";
import { unmountComponentAtNode } from "react-dom";

const Czar = ({
  blackCards,
  chooseBlackCard,
  setCardsOnTable,
  setBlackCards,
  gameStage,
  timer,
  setTimer,
}) => {
  const [showBlackCards, setshowBlackCards] = useState([]);
  const [activeIndex, setActiveIndex] = useState(false);

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

  const selectCard = ({ index, element, event }) => {
    //update all black cards

    if (index) {
      const [selected] = blackCards.splice(index, 1);

      setBlackCards(() => [...blackCards]);
      setActiveIndex(index);
      setTimeout(() => {
        setshowBlackCards(null);
        chooseBlackCard(selected);
      }, 2000);
      setTimer(false);
      return;
    }

    const [selected] = showBlackCards.splice(1, 1);
    setBlackCards(() => [...blackCards]);
    setActiveIndex(index);
    setTimeout(() => {
      setshowBlackCards(null);
      chooseBlackCard(selected.card);
    }, 2000);

    setTimer(false);
    return;
  };

  useEffect(() => {
    if (timer === null) {
      selectCard({ index: null });
    }
  }, [timer]);

  useEffect(() => {
    randomBlackCards();
  }, []);
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
            showBlackCards.map((cardItem, blackIndex) => (
              <li
                key={cardItem.card.text}
                data-index={cardItem.index}
                className={
                  blackIndex === (showBlackCards.length - 1) / 2
                    ? "middle"
                    : blackIndex === showBlackCards.length - 1
                    ? "highest"
                    : "lowest"
                }
              >
                {cardItem.index === activeIndex ? (
                  <m.div
                    key={cardItem.card.text + blackIndex}
                    initial={
                      blackIndex === (showBlackCards.length - 1) / 2
                        ? {
                            top: "30%",
                            left: "43%",
                          }
                        : blackIndex === showBlackCards.length - 1
                        ? { top: "30%", left: "58%" }
                        : { top: "30%", left: "28%" }
                    }
                    animate={{
                      top: "50%",
                      left: "50%",
                      translateX: "-50%",
                      translateY: "-50%",
                      zIndex: "auto",
                      opacity: 1,
                      scale: 2,
                      rotate: 360,
                      position: "fixed",
                    }}
                    transition={{ duration: 0.3 }}
                    /*
                    exit={{
                      top: "50%",
                      left: "50%",
                      translateX: "-500%",
                      translateY: "-50%",
                      zIndex: "500000",
                      opacity: 1,
                      scale: 2,
                      rotate: 360,
                      position: "fixed",
                      transition: { duration: 5.75 },
                    }}
                    */
                    className={` ${style.black} czarPicking`}
                    onClick={(e) => {
                      selectCard({
                        index: cardItem.index,

                        event: e,
                      });
                    }}
                  >
                    {cardItem.card.text}
                  </m.div>
                ) : (
                  <li>
                    <div
                      className={` ${style.black} czarPicking`}
                      onClick={(e) => {
                        selectCard({
                          index: cardItem.index,

                          event: e,
                        });
                      }}
                    >
                      {cardItem.card.text}
                    </div>
                  </li>
                )}
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Czar;
