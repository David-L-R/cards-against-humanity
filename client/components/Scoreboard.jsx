import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RiVipCrown2Fill } from "react-icons/Ri";

const Scoreboard = ({ currentLobby }) => {
  const { players } = currentLobby;
  return (
    <>
      <ul>
        {players &&
          players.map((player) => (
            <li key={player.id}>
              <div>
                {player.isHost && (
                  <div className="crown-background">
                    <RiVipCrown2Fill className="crown" />
                  </div>
                )}
                <AiOutlineCheckCircle
                  className={player.inactive ? "checkmark" : "checkmark active"}
                />
                <img src="/favicon.ico" alt="" />
                <span className="player-name">{player.name}</span>
                <span className="player-points">{player.points}</span>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Scoreboard;
