import React, { useEffect, useState } from "react";
import { motion as m } from "framer-motion";

function WhiteCard({ getNewWhiteCard, loading }) {
  const [isActive, setIsActive] = useState(false);
  const [cardId, setCardId] = useState(0);

  const handleClick = (event) => {
    setIsActive(getNewWhiteCard());
  };

  useEffect(() => {
    setCardId(Math.random());
  }, [isActive]);

  useEffect(() => {
    !loading && setIsActive(false);
  }, [loading]);

  return (
    <m.div className="whiteCardContainer">
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
            <div className="whiteCardHeader"></div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

export default WhiteCard;
