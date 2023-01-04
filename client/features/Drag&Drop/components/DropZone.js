import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { DragItem } from "./DragItem";

export function DropZone(props) {
  let { cards, id, element } = props;
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      accepts: ["*"],
    },
  });

  const addSkeletons = () => {
    const blackCard = cards[0];
    let skeletons = [];

    for (let index = 0; index < blackCard?.pick; index++) {
      skeletons.push({ text: "" });
    }

    cards = [...cards, ...skeletons];
  };

  if (id === "table" && cards.length > 0) addSkeletons();

  return (
    <article ref={setNodeRef}>
      <SortableContext id={id} items={cards.map((card) => card.text)}>
        <h1>{id}</h1>
        <ul className="cardDisplay">
          {cards &&
            cards.map((card) => {
              return (
                <DragItem
                  card={card}
                  id={card.text}
                  key={card.text}
                  element={element}
                />
              );
            })}
        </ul>
      </SortableContext>
    </article>
  );
}
