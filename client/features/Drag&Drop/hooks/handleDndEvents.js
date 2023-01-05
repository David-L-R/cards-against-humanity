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
    const activeContainer = active.data.current?.sortable?.containerId;
    const overContainer = over.data.current?.sortable?.containerId;
    const activeIndex = active.data.current.sortable.index;
    const overIndex = over?.data?.current?.sortable.index;

    if ((overContainer && overContainer) === "table" && overIndex === 0) return;
    //dont move black card

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

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
    const overContainer = over?.data?.current?.sortable?.containerId;
    const activeIndex = active?.data.current?.sortable?.index;
    const overIndex = over?.data?.current?.sortable?.index;

    console.log("active", active?.data.current);
    console.log("activeContainer", active?.data.current?.sortable);
    console.log("over", over?.data?.current);

    if (!overContainer || !activeContainer || activeContainer === overContainer)
      return;

    if (overContainer === "table") {
      //dont move black card

      const currentListLength = over?.data?.current?.sortable?.items.length;

      // if (overIndex === 0) return;

      setRaw((prev) => {
        const newDeck = { ...prev };
        const incoming = newDeck.player.cards.splice(activeIndex, 1);
        let cards = newDeck.table.cards;

        newDeck.table.cards = [...cards.splice(0, 1), ...incoming, ...cards];
        console.log("cards", newDeck.table.cards);

        return newDeck;
      });

      const pick = over?.data?.current?.allCards[0]?.pick;
      const maxLength = pick * 2 + 1;
      const currentLength = over?.data?.current?.allCards.length;

      // if (currentLength >= maxLength) return;
    }

    // if (activeContainer === "table" && overContainer !== "table") {
    //   setRaw(pre => {

    //   })
    // }

    // if (!overContainer || !activeContainer || activeContainer === overContainer)
    //   return;
    // setRaw((old) => {
    //   const newObj = { ...old };
    //   const newItem = old[activeContainer].cards[activeIndex];
    //   newObj[activeContainer].cards = removeAtIndex(
    //     newObj[activeContainer].cards,
    //     activeIndex
    //   );
    //   newObj[overContainer].cards = insertAtIndex(
    //     newObj[overContainer].cards,
    //     overIndex,
    //     newItem
    //   );

    //   return newObj;
    // });
  }
};
