import React, { useState } from "react";

const KickButton = ({ playerId }) => {
  const [showButton, setShowButton] = useState(false);
  return (
    <div className="kick-container" onMouseLeave={() => setShowButton(false)}>
      <img
        className="kick-icon"
        onClick={() => setShowButton(true)}
        src="/combat-kick.png"
        alt="shoe kicking air"
      />
      {showButton && <button>F1nIsH HiM!</button>}
    </div>
  );
};

export default KickButton;
