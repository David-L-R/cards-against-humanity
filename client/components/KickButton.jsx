import React, { useState } from "react";
import { useAppContext } from "../context";
import { socket } from "../pages/_app";

const KickButton = ({ playerId }) => {
  const [showButton, setShowButton] = useState(false);
  const { storeData } = useAppContext();

  const handleKick = () => {
    const playerData = {
      playerId,
      lobbyId: storeData.lobbyId,
      gameIdentifier: storeData.gameIdentifier,
      kickPlayer: true,
      gameId: storeData.lobbyId,
    };
    socket.emit("changeGame", playerData);
  };

  return (
    <div className="kick-container" onMouseLeave={() => setShowButton(false)}>
      <img
        className="kick-icon"
        onClick={() => setShowButton(true)}
        src="/combat-kick.png"
        alt="shoe kicking air"
      />
      {showButton && <button onClick={handleKick}>F1nIsH HiM!</button>}
    </div>
  );
};

export default KickButton;
