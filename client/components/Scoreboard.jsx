import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RiVipCrown2Fill } from "react-icons/Ri";
import { useSession } from "next-auth/react";

const Scoreboard = ({ currentLobby }) => {
  const { data: session } = useSession();
  const { players } = currentLobby;
  return (
    <>
      <ul>
        {players &&
          players.map((player) => (
            <li key={player.id}>
              <div>
                <AiOutlineCheckCircle
                  className={player.inactive ? "checkmark" : "checkmark active"}
                />
                {player.isHost && (
                  <div className="crown-background">
                    <RiVipCrown2Fill className="crown" />
                  </div>
                )}

                <img src="/favicon.ico" alt="default" />

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
