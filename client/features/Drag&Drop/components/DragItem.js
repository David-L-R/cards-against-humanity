import React, { Children, cloneelement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function DragItem(props) {
  const { card, id, element } = props;
  const CustomComponent = element;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    listStyle: "none",
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {element ? <CustomComponent {...props} /> : <h2> {id}</h2>}
    </li>
  );
}
