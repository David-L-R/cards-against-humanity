import style from "../styles/cardTemplate.module.css";
import { useState, useEffect } from "react";

const CardTemplate = (props) => {
  const { id, isBlackCard, allcards, card } = props;
  const [blackText, setBlackText] = useState(null);
  const cardClass = "";

  const addClassName = () => {
    if (card) {
      const { pick, pack } = card;

      if (pick) {
        return (cardClass = `${style.cardTemplateContainer} ${style.black}`);
      } else if (pack >= 0 && pack !== undefined) {
        return (cardClass = `${style.cardTemplateContainer}`);
      }
      return (cardClass = `${style.cardTemplateContainer} ${style.skeleton}`);
    }
    cardClass = `${style.cardTemplateContainer}`;
  };

  const addTextToBlack = () => {
    const blackText = allcards[0].text.split("");
    const textList = allcards.slice(1).map((card) => card.text);

    const newBlackText = blackText
      .map((letter) => {
        if (letter === "_") {
          const sentance = textList.splice(0, 1);
          if (!sentance[0]) return letter;
          return sentance[0];
        }
        return letter;
      })
      .join(" ");

    return setBlackText(newBlackText);
  };

  useEffect(() => {
    addClassName();
    isBlackCard && addTextToBlack();
  }, [allcards]);

  return <div className={cardClass}>{!isBlackCard ? id : blackText}</div>;
};

export default CardTemplate;
