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

export function DropZone(props) {
  let { cards, id, element, isCzar } = props;
  const [blackCard, setBlackCard] = useState(null);
  const [skelletons, setSkelletons] = useState(null);
  const { setNodeRef } = useDroppable({
    id: id,
    disabled:
      cards.length >= blackCard?.pick + 1 || cards.length === 0 ? true : false,
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

  //update skeletons after card got dropped somewhere else
  useDndMonitor({
    onDragEnd() {
      createSkelleton();
    },
  });

  useEffect(() => {
    if (id === "table") setBlackCard(cards[0]);
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
      strategy={horizontalListSortingStrategy}>
      <article
        className={
          isCzar && blackCard
            ? "czarSelecteWhites blackHand" //blue
            : isCzar && !blackCard
            ? "czarSelecteWhites whiteHand" //red
            : null
        }>
        {/*isCzar && blackCard && (
          <div className="">
            <h2>Choose a white card</h2>
          </div>
        )*/}

        <div
          className={
            blackCard ? "onTable black-on-table" : "onTable whiteCardTable"
          }>
          <m.ul
            className="cardDisplay"
            ref={setNodeRef}
            initial={{ x: -1100, rotate: 20 }}
            animate={{ x: 0, rotate: 0 }}
            exit={{
              y: 1300,

              transition: { duration: 0.5 },
            }}>
            {cards &&
              cards.map((card) => {
                return (
                  <DragItem
                    card={card}
                    allCards={cards}
                    id={card.text}
                    key={card.text}
                    element={element}
                  />
                );
              })}
            {/* <li className="skeleton-wrapper"> */}
            {skelletons &&
              skelletons.map((skell, index) => (
                <li
                  key={skell.key}
                  className={
                    !skell.show
                      ? `hide-skell skeleton${index}`
                      : `skeleton${index}`
                  }>
                  <CardTemplate card={skell} index={index} />
                </li>
              ))}
            {/* </li> */}
          </m.ul>
        </div>
      </article>
    </SortableContext>
  );
}
