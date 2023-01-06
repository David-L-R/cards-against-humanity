import React, { useEffect, useState } from "react";
import style from "../styles/cardTemplate.module.css";

const BlackCardInDeck = ({ card, confirmBlack, drawBlack, index }) => {
  const [randomDeg, setrandomDeg] = useState(0);
  const [active, setactive] = useState(false);
  const [rejected, setrejected] = useState(false);

  let presentOptions = {
    position: "absolute",
    top: `50%`,
    transform: `translateY(-50%) translateZ(0) rotateX(0deg) rotateY(0deg)
    rotateZ(0deg)`,
    scale: "1.5",
    zIndex: 10,
  };

  let defaultOptions = {
    transform: `translateZ(50px) rotateX(50deg) rotateY(-10deg) rotateZ(${
      randomDeg + 30
    }deg)`,
  };

  let rejectOptions = {
    left: 0,
    transform: `translateX(-1000px) rotateZ(180deg) `,
  };
  const randomCardTurn = () =>
    setrandomDeg(Math.floor(Math.random() * 20 - 10));

  const selectCard = () => {
    if (!active) {
      setactive(true);
      drawBlack(index);
    }
  };

  const confirmCard = () => {
    if (active) confirmBlack();
  };

  const rejectCard = () => {
    if (active) setrejected(true);
  };

  useEffect(() => {
    randomCardTurn();
  }, []);

  return (
    <li
      onClick={selectCard}
      className={`${style.cardTemplateContainer} ${style.black}`}
      style={
        !active && !rejected
          ? defaultOptions
          : rejected
          ? rejectOptions
          : presentOptions
      }>
      {card.text}
      {active && (
        <div>
          <button onClick={confirmCard}>Conform</button>
          <button onClick={rejectCard}>Reject</button>
        </div>
      )}
    </li>
  );
};

export default BlackCardInDeck;
