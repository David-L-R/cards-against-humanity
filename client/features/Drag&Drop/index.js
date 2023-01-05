import React, { useState } from "react";
import {
  rectIntersection,
  closestCenter,
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DropZone } from "./components/DropZone.js";
import {
  handleDragStart,
  handleDragCancel,
  handleDragEnd,
  handleDragOver,
} from "./hooks/handleDndEvents.js";
import CardTemplate from "../../components/cardTemplate.js";

function DragAndDropContainer(props) {
  const { setData, data, children, element } = props;
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => handleDragStart(e, setActiveId)}
      onDragCancel={() => handleDragCancel(setActiveId)}
      onDragOver={(e) => handleDragOver(e, setData)}
      onDragEnd={(e) => handleDragEnd(e, setActiveId, setData)}>
      {children}
      {Object.entries(data).map(([key, value]) => {
        return (
          <DropZone
            cards={data[key].cards}
            id={data[key].label}
            element={element}
            key={data[key].label}
            activeId={activeId}
            {...props}
          />
        );
      })}
      <DragOverlay>
        {activeId ? <CardTemplate id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default DragAndDropContainer;
