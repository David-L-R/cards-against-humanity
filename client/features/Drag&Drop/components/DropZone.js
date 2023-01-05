import React from "react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DragItem } from "./DragItem";
import { useState, useEffect } from "react";
import CardTemplate from "../../../components/cardTemplate";

export function DropZone(props) {
  let { cards, id, element, activeId } = props;
  const [blackCard, setBlackCard] = useState(null);
  const [skelletons, setSkelletons] = useState(null);
  const { setNodeRef } = useDroppable({
    id: id,
  });

  function createSkelleton() {
    if (!blackCard) return;
    //Rener skelettons based on the amount of white cards that are missing
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
  }

  useEffect(() => {
    if (id === "table") setBlackCard(cards[0]);
  }, [cards]);

  useEffect(() => {
    blackCard && createSkelleton();
  }, [blackCard, cards]);

  return (
    <article>
      <SortableContext
        id={id}
        items={cards.map((card) => card && card.text)}
        strategy={horizontalListSortingStrategy}>
        <h1>{id}</h1>

        <ul className="cardDisplay" ref={setNodeRef}>
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
          <li className="skeleton-wrapper">
            {skelletons &&
              skelletons.map((skell) => (
                <div
                  key={skell.key}
                  className={!skell.show ? "hide-skell " : null}>
                  <CardTemplate card={skell} />
                </div>
              ))}
          </li>
        </ul>
      </SortableContext>
    </article>
  );
}
