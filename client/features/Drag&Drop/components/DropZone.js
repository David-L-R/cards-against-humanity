import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { DragItem } from "./DragItem";

export function DropZone(props) {
  const { cards, id, element } = props;
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <article ref={setNodeRef} className="drop-container">
      <SortableContext id={id} items={cards.map((card) => card.text)}>
        <h1>{id}</h1>
        <ul>
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
