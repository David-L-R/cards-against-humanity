import { useRouter } from "next/router";
import React from "react";
import { useAppContext } from "../context";
import Confetti from "react-confetti";
import BalloonContainer from "./FloatingBalloons";
import Avatar from "./Avatar.jsx";

function GameEnd({ currentGame }) {
  const amountOfRoundsPlayed = currentGame.turns.length;
  const maxRounds = currentGame.setRounds;
  const { storeData } = useAppContext();
  const { lobbyId } = storeData;
  const router = useRouter();
  const winningPlayers = currentGame.players
    .sort((a, b) => b.points - a.points)
    .filter((_, index) => index < 3);

  let overallWinner = 0;
  currentGame.players.forEach((player) => {
    if (player.points > overallWinner) overallWinner = player;
  });
  const allPLayersWithStats = currentGame.players.map((player) => ({
    playerName: player.name,
    points: player.points,
    timesCzar: currentGame.turns.filter((turn) => turn.czar?.id === player.id)
      .length,
    wonRounds: currentGame.turns.filter(
      (turn) => turn.winner.player === player.id
    ).length,
    playedWhites: currentGame.turns
      .filter((turn) =>
        turn.white_cards.find((currPlayer) => currPlayer.player === player.id)
      )
      .map(
        (turn) =>
          turn.white_cards.find((currPlayer) => currPlayer.player === player.id)
            .played_card.length
      )
      .reduce((sum, value) => sum + value, 0),
    playedBlacks: currentGame.turns
      .filter((turn) => turn.czar.id === player.id)
      .map((turn) => turn.black_card).length,
  }));

  const backToLobby = () => {
    router.push(`/lobby/${lobbyId}`);
  };

  return (
    <>
      <div className="confettiContainer">
        <Confetti />
      </div>

      <div className="gameEndContainer">
        <BalloonContainer totalBaloon={4} style={{ width: "100%" }} />
        <div className="gameEndTextField">
          <h2 className="winnerh1Text">And the Winner is...</h2>
          <h1>{`${overallWinner.name}!`}</h1>

          <div className="avatarsContainer">
            {winningPlayers &&
              winningPlayers.map((player, index) => {
                if (index === 0)
                  return (
                    <div className="winnerAvatarContainer">
                      <Avatar playerAvatar={player?.avatar} />
                    </div>
                  );
                if (index === 1)
                  return (
                    <div className="avatar2nd">
                      <Avatar playerAvatar={player?.avatar} />
                      <h3>{`${player.name}`}</h3>
                    </div>
                  );
                if (index === 2)
                  return (
                    <div className="avatar3rd">
                      <Avatar playerAvatar={player?.avatar} />
                      <h3>{`${player.name}`}</h3>
                    </div>
                  );
              })}
          </div>
        </div>
        <div className="pedestal">
          <div className="linearGradient">
            <button
              onClick={backToLobby}
              style={{ zIndex: "1" }}
              className="backToLobby"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
      <div className="shit11">
        <img src="/poopemoji.svg" />
      </div>
    </>
  );
}

export default GameEnd;
