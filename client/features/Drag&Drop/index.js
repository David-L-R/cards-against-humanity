import React, { useState } from "react";
import {
  rectIntersection,
  pointerWithin,
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
import CardTemplate from "../../components/CardTemplate.jsx";

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
      collisionDetection={pointerWithin}
      onDragStart={(e) => handleDragStart(e, setActiveId)}
      onDragCancel={() => handleDragCancel(setActiveId)}
      onDragOver={(e) => handleDragOver(e, setData)}
      onDragEnd={(e) => handleDragEnd(e, setActiveId, setData)}>
      <div className="droppable-container">
        {Object.entries(data).map(([key], index) => {
          return index === 0 ? (
            <div key={key}>
              <DropZone
                cards={data[key].cards}
                id={data[key].label}
                element={element}
                key={data[key].label}
                activeId={activeId}
                {...props}
              />
              {children}
            </div>
          ) : (
            <div key={key}>
              <DropZone
                cards={data[key].cards}
                id={data[key].label}
                element={element}
                key={data[key].label}
                activeId={activeId}
                {...props}
              />
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeId ? <CardTemplate id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default DragAndDropContainer;
