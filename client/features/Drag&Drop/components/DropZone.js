import React from "react";
import { DragOverlay, useDndMonitor, useDroppable } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DragItem } from "./DragItem";
import { useState, useEffect } from "react";
import CardTemplate from "../../../components/CardTemplate";
import { motion as m } from "framer-motion";
import { RiH1 } from "react-icons/Ri";

export function DropZone(props) {
  let { cards, id, element, isCzar, whiteCardChoosed, confirmed, stage } =
    props;
  const [blackCard, setBlackCard] = useState(null);
  const [skelletons, setSkelletons] = useState(null);
  const [blackText, setBlackText] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { setNodeRef } = useDroppable({
    id: id,
    disabled:
      cards.length >= blackCard?.pick + 1 ||
      cards.length === 0 ||
      (confirmed && blackCard)
        ? true
        : false,
  });
  //Rener skelettons based on the amount of white cards that are missing, using CSS classes to hide
  const createSkelleton = () => {
    if (!blackCard) return;
    const maxAmountSkelleton = blackCard.pick;
    const hasWhiteCards = cards.length - 1;
    const amountToRender = maxAmountSkelleton - hasWhiteCards;
    const skelletonCollection = [];

    for (let i = 0; i < maxAmountSkelleton; i++) {
      const skelleton = { text: "", key: i, show: false };

      for (let j = i; j < amountToRender; j++) {
        skelleton.show = true;
      }

      skelletonCollection.push(skelleton);
    }

    setSkelletons((pre) => [...skelletonCollection].reverse());
  };

  const addTextToBlack = () => {
    if (!blackText) return;
    //add text from thite cards to black cards
    if (cards.length <= 0) return;
    const currentBlackText = cards[0].text.split(``);
    const textList = cards.slice(1).map((card) => card.text);

    const newBlackText = currentBlackText
      .map((letter) => {
        if (letter === "_") {
          const [sentance] = textList
            .splice(0, 1)
            .map((text) => text.replaceAll(".", ""));
          if (!sentance) return letter;
          return <span className="white-in-black">{sentance}</span>;
        }
        return letter;
      })
      .map((letter) => <>{letter}</>);

    setBlackText(newBlackText);
  };

  //update skeletons after card got dropped somewhere else
  useDndMonitor({
    onDragEnd() {
      createSkelleton();
      addTextToBlack();
    },
  });

  useEffect(() => {
    if (id === "table") {
      setBlackCard(cards[0]);
      addTextToBlack();
    }
    !blackText && setBlackText(cards.length > 0 && cards[0].text);
  }, [cards]);

  useEffect(() => {
    createSkelleton();
  }, [blackCard]);
  /*
  if (isCzar && !blackCard) return;*/

  return (
    <SortableContext
      id={id}
      items={cards.map((card) => card && card.text)}
      strategy={horizontalListSortingStrategy}
    >
      <article
        className={
          isCzar && blackCard
            ? "czarSelecteWhites blackHand" //blue
            : !isCzar && !blackCard
            ? "czarSelecteWhites whiteHand" //red
            : isCzar && !blackCard
            ? "czarSelecteWhites whiteHandOut"
            : null
        }
      >
        {id === "table" && !isCzar && !blackCard && (
          <div className="czarIsChoosing">
            <h1>Czar is Choosing a Black Card</h1>
            <p className="pleaseBePatient">Please be Patient</p>
          </div>
        )}
        <div
          className={
            blackCard ? "onTable black-on-table" : "onTable whiteCardTable"
          }
        >
          <m.ul
            className={
              confirmed && blackCard ? "cardDisplay confirmed" : "cardDisplay"
            }
            ref={setNodeRef}
            initial={{ y: -500, rotate: 20 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{
              y: 1300,

              transition: { duration: 0.5 },
            }}
          >
            {cards &&
              cards.map((card, index) => {
                return (
                  <DragItem
                    card={card}
                    allCards={cards}
                    id={card.text}
                    key={card.text + card.pack + index}
                    element={element}
                    confirmed={confirmed}
                    blackText={blackText}
                    style={
                      (isCzar && id === "table" && index < 1) || !isCzar
                        ? null
                        : { opacity: "0", position: "absolute" }
                    }
                  />
                );
              })}

            {skelletons && stage === "white" && !isCzar
              ? skelletons.map((skell, index) => (
                  <li
                    key={skell.key}
                    className={
                      !skell.show
                        ? `hide-skell skeleton${index}`
                        : `skeleton${index}`
                    }
                  >
                    <CardTemplate card={skell} index={index} />
                  </li>
                ))
              : null}
            {blackCard && cards.length === blackCard.pick + 1 && !isCzar && (
              <>
                <li
                  onClick={() => {
                    whiteCardChoosed([...cards.slice(1)]);
                    setIsConfirmed(true);
                  }}
                  className={
                    !confirmed && !isCzar
                      ? "selectButton active"
                      : "selectButton "
                  }
                >
                  <h3>Confirm</h3>
                </li>
                {isConfirmed && (
                  <h3 className="waitText">
                    Please wait Czar will choose a winner shortly...
                  </h3>
                )}
              </>
            )}
          </m.ul>
        </div>
      </article>
    </SortableContext>
  );
}
