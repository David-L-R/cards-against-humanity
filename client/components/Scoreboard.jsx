import React, { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { VscDebugDisconnect } from "react-icons/vsc";
import { RiVipCrown2Fill } from "react-icons/Ri";
import { CgCloseO } from "react-icons/Cg";
import { useSession } from "next-auth/react";
import { useAppContext } from "../context";
import KickButton from "./KickButton";
import { parseCookies } from "nookies";
import Avatar from "./Avatar.jsx";

const Scoreboard = ({ currentLobby, socket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKick, setShowKick] = useState(false);
  const cookies = parseCookies();
  const { players, turns } = currentLobby;
  const currentTurn = turns && turns[turns.length - 1];
  const { stage, white_cards, czar } = currentTurn
    ? currentTurn
    : { stage: null, white_cards: null };
  const { storeData } = useAppContext();
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
        if (readyPlayer) return true;
      }
    }
    return false;
  };

  const openMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className="sideMenu"
        style={{
          marginLeft: isOpen ? "0" : "-350px",
          boxShadow: isOpen
            ? "20px 2px 31px 4px rgba(135,129,129,0.52)"
            : "none",
        }}>
        <div
          className="scoreButton"
          onClick={openMenu}
          style={{
            opacity: isOpen ? "0" : "1",
            cursor: isOpen ? "default" : "pointer",
          }}>
          <p>SCORES</p>
        </div>
        <button onClick={openMenu}>
          <CgCloseO />
        </button>
        <ul>
          <h1>SCOREBOARD</h1>

          <li className="scoreboardTitles">
            <div>Status</div>
            <div>Name</div>
            <div>Score</div>
          </li>
          {players &&
            players.map((player) => (
              <li
                key={player.id}
                className={player.inactive ? "inactive-player" : null}
                onMouseEnter={(e) => setShowKick(e.target.dataset.id)}
                onMouseLeave={() => setShowKick(false)}
                data-id={player.id}>
                <div>
                  {storeData.isHost &&
                  showKick === player.id &&
                  player.id !== cookies.socketId ? (
                    <KickButton playerId={player.id} socket={socket} />
                  ) : !player.inactive ? (
                    <AiOutlineCheckCircle
                      className={
                        !submittedWhiteCards(player.id)
                          ? "checkmark"
                          : "checkmark active"
                      }
                    />
                  ) : (
                    <VscDebugDisconnect className="disconnect-icon" />
                  )}
                </div>
                <div className="profileContainer">
                  {czar && czar.id === player.id && (
                    <div className={"crown-background"}>
                      <RiVipCrown2Fill className="crown" />
                    </div>
                  )}
                  <img className="avatar" src="/favicon.ico" alt="" />
                  <Avatar userName={player.name} />

                  <span className="player-name">{player.name}</span>
                </div>
                <div>
                  <span className="player-points">{player.points}</span>
                </div>
              </li>
            ))}
        </ul>
        {turns?.length > 0 && (
          <div className="scoreStats">
            <div className="fuckingClass">
              <h4>
                turn: {turns.length}/{currentLobby.setRounds}
              </h4>
            </div>
            <div>
              <h4>Players: {players.length}</h4>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Scoreboard;
/*
 return (
    <>
      <ul>
        {turns?.length > 0 && (
          <div className="fuckingClass">
            <h4>
              turn: {turns.length}/{currentLobby.setRounds}
            </h4>
            <h4>Players: {players.length}</h4>
          </div>
        )}
        {players &&
          players.map((player) => (
            <li
              key={player.id}
              className={player.inactive ? "inactive-player" : null}
            >
              <div>
                {czar && czar.id === player.id && (
                  <div className={"crown-background"}>
                    <RiVipCrown2Fill className="crown" />
                  </div>
                )}
                {!player.inactive ? (
                  <AiOutlineCheckCircle
                    className={
                      !submittedWhiteCards(player.id)
                        ? "checkmark"
                        : "checkmark active"
                    }
                  />
                ) : (
                  <VscDebugDisconnect className="disconnect-icon" />
                )}
                <img className="avatar" src="/favicon.ico" alt="" />
                <span className="player-name">{player.name}</span>
                <span className="player-points">{player.points}</span>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
  */
