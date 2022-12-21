import { arrayMove } from "@dnd-kit/sortable";
import { insertAtIndex, removeAtIndex } from "../utils/array";

export const handleDragStart = ({ active }, setActiveId) => {
  setActiveId(active.id);
};

export const handleDragCancel = (setActiveId) => {
  setActiveId(null);
};

export const handleDragEnd = ({ active, over }, setActiveId, setRaw) => {
  if (!over) {
    setActiveId(null);
    return;
  }

  if (active.id !== over.id) {
    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }
    const activeIndex = active.data.current.sortable.index;
    const overIndex = over?.data?.current?.sortable.index;

    setRaw((old) => {
      old[activeContainer].cards = arrayMove(
        old[activeContainer].cards,
        activeIndex,
        overIndex
      );
      return old;
    });
  }

  setActiveId(null);
};

export const handleDragOver = ({ active, over }, setRaw) => {
  if (active.id !== over?.id) {
    const activeContainer = active?.data.current?.sortable?.containerId;
    const overContainer = over?.data?.current?.sortable.containerId;
    const activeIndex = active?.data.current?.sortable?.index;
    const overIndex = over?.data?.current?.sortable?.index;

    if (!overContainer || !activeContainer || activeContainer === overContainer)
      return;
    setRaw((old) => {
      const newObj = { ...old };
      const newItem = old[activeContainer].cards[activeIndex];
      newObj[activeContainer].cards = removeAtIndex(
        newObj[activeContainer].cards,
        activeIndex
      );
      newObj[overContainer].cards = insertAtIndex(
        newObj[overContainer].cards,
        overIndex,
        newItem
      );

      return newObj;
    });
  }
};
