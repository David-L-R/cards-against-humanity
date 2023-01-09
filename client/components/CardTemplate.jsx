import style from "../styles/cardTemplate.module.css";
import { useState, useEffect } from "react";
import { useDndMonitor } from "@dnd-kit/core";

const CardTemplate = (props) => {
  const { id, isBlackCard, allcards, card, index } = props;

  const [blackText, setBlackText] = useState(allcards && allcards[0].text);
  let cardClass;
  const [changeText, setChangeText] = useState(false);

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

  const addTextToBlack = () => {
    if (!allcards) return;
    //add text from thite cards to black cards
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
    setChangeText(false);
    return setBlackText(newBlackText);
  };

  useDndMonitor({
    onDragEnd({ over }) {
      setChangeText(true);
    },
  });

  useEffect(() => {
    isBlackCard && addTextToBlack();
  }, [changeText]);

  return <div className={cardClass}>{!isBlackCard ? id : blackText}</div>;
};

export default CardTemplate;
