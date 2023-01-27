import React, { useState } from "react";
import { useAppContext } from "../context";
import { socket } from "../pages/_app";

const KickButton = ({ playerId, playerName }) => {
  const [showButton, setShowButton] = useState(false);
  const { storeData } = useAppContext();

  const handleKick = () => {
    const playerData = {
      playerId,
      lobbyId: storeData.lobbyId,
      kickPlayer: true,
      gameId: storeData.lobbyId,
    };
    socket.emit("changeGame", playerData);
  };

  return (
    <div
      className="kick-container kick-hover"
      onMouseLeave={() => setShowButton(false)}>
      <img
        className="kick-icon"
        onClick={() => setShowButton(true)}
        src="/combat-kick.png"
        alt="shoe kicking air"
      />
      {showButton && (
        <div className="kickButtonBackground">
          <button onClick={handleKick} className="kickButton">
            <p>Kick {playerName}? </p>
          </button>
        </div>
      )}
    </div>
  );
};

export default KickButton;
