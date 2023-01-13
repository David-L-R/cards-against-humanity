import style from "../styles/cardTemplate.module.css";
import { useState, useEffect } from "react";
import { useDndMonitor } from "@dnd-kit/core";

const CardTemplate = (props) => {
  const { id, isBlackCard, card, blackText } = props;
  let cardClass;

  (() => {
    //Add classname for black cards, white cards or skellettons
    if (card) {
      const { pick, pack } = card;

      if (pick) {
        return (cardClass = `${style.cardTemplateContainer} ${style.black}`);
      } else if (pack >= 0 && pack !== undefined) {
        return (cardClass = `${style.cardTemplateContainer}`);
      }
      return (cardClass = `${style.cardTemplateContainer} ${"skeleton"}`);
    }
    return (cardClass = `${style.cardTemplateContainer}`);
  })();

  return (
    <>
      <div className={cardClass}>{!isBlackCard ? id : blackText}</div>
    </>
  );
};

export default CardTemplate;
