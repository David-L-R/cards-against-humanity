import React, { useEffect, useState } from "react";
import { socket } from "../pages/_app.js";

function WhiteCard({ getNewWhiteCard, setCardsOnTable }) {
  const [isActive, setIsActive] = useState(false);
  const [newWhiteCard, setNewWhiteCard] = useState(null);
  const [loading, setLoading] = useState(false);

  //start a request to server to get a new card
  const handleClick = (event) => {
    if (!loading) {
      setLoading(true);
      getNewWhiteCard();
    }
  };

  //listens for a new white card, set state to activate the animation
  useEffect(() => {
    socket.on("newWhiteCard", ({ newWhite }) => {
      setNewWhiteCard((prev) => ({ ...newWhite }));
    });
    return () => {
      socket.removeListener("newWhiteCard");
    };
  }, [loading]);

  //wiats for 1 second before add new white card to hand
  useEffect(() => {
    if (isActive && newWhiteCard) {
      setTimeout(() => {
        setIsActive(false);
        setCardsOnTable((prev) => {
          return {
            ...prev,
            player: {
              label: "player",
              cards: [...prev.player.cards, newWhiteCard],
            },
          };
        });
        setNewWhiteCard(null);
      }, 500);
    }
    setLoading(false);
  }, [isActive]);

  //start animation after receiving a card from socket listener
  useEffect(() => {
    newWhiteCard && setIsActive(true);
  }, [newWhiteCard]);

  return (
    <div className="whiteCardContainer">
      <div
        className={isActive ? "whiteCard whiteIsFlipped" : "whiteCard"}
        onClick={handleClick}>
        <div className="whiteCardFace whiteCardFace--front">
          <h2>Cards Against Humanity.</h2>

          <div className="whiteCardFaceButton">
            <p>Click To Reveal</p>
          </div>
        </div>
        <div className="whiteCardFace whiteCardFace--back">
          <div className="whiteCardContent">
            <div className="whiteCardHeader">{newWhiteCard?.text}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhiteCard;
