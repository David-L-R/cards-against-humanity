import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RiVipCrown2Fill } from "react-icons/Ri";

const Scoreboard = ({ currentLobby }) => {
  const { players, turns } = currentLobby;
  const currentTurn = turns && turns[turns.length - 1];
  const { stage, white_cards, czar } = currentTurn
    ? currentTurn
    : { stage: null, white_cards: null };

  const submittedWhiteCards = (playerId) => {
    if (white_cards && currentLobby) {
      const player = white_cards.find((player) => player.player === playerId);

      //display checkmark after submittetd white cards during "white" gamestage
      if (
        stage[stage.length - 1] === "white" ||
        stage[stage.length - 1] === "deciding"
      ) {
        if (player && player.played_card && player.played_card.length > 0)
          return true;
      }
      if (stage[stage.length - 1] === "winner") {
        const readyPlayer = currentTurn.completed.find(
          (player) => player.player_id === playerId
        );
        console.log("readyPlayer", readyPlayer);
        if (readyPlayer) return true;
      }
    }
    return false;
  };

  return (
    <>
      <ul>
        {players &&
          players.map((player) => (
            <li key={player.id}>
              <div>
                {czar && czar.id === player.id && (
                  <div className={"crown-background"}>
                    <RiVipCrown2Fill className="crown" />
                  </div>
                )}
                <AiOutlineCheckCircle
                  className={
                    !submittedWhiteCards(player.id)
                      ? "checkmark"
                      : "checkmark active"
                  }
                />
                <img className="avatar" src="/favicon.ico" alt="" />
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