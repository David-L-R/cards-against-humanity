import React, { Children, cloneelement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function DragItem(props) {
  const { card, id, element, allCards } = props;
  const CustomComponent = element;
  const isBlackCard = card.pick;
  const isSkelettonCard = card.text === "";

  const { attributes, listeners, setNodeRef, transform, transition, sortable } =
    useSortable({
      id: id,
      disabled: isBlackCard ? true : false,
      data: {
        cardProps: { ...card },
        allCards: [...allCards],
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    listStyle: "none",
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={isBlackCard || isSkelettonCard ? null : style}
      {...listeners}
      {...attributes}>
      {element ? (
        <CustomComponent
          {...props}
          isBlackCard={isBlackCard ? true : false}
          allcards={allCards}
        />
      ) : (
        <h2> {id}</h2>
      )}
    </li>
  );
}
