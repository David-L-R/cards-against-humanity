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
  const router = useRouter();

  const winningPlayers = currentGame.players
    .sort((a, b) => b.points - a.points)
    .filter((_, index) => index < 3);
  console.log(winningPlayers, "winningPlayers");

  // const sortedPlayers = players.sort((a, b) => b.points - a.points);

  /*
  function findSecondWinner(players) {
    const sortedPlayers = players.sort((a, b) => b.points - a.points);
    return sortedPlayers[1];
  }
  //map over the return statment players.map foreach player
  const secondWinner = findSecondWinner(currentGame.players);
  */

  function findThirdWinner(players) {
    if (players.length < 3) {
      return null;
    }
    const sortedPlayers = players.sort((a, b) => b.points - a.points);
    return sortedPlayers[2];
  }
  const thirdWinner = findThirdWinner(currentGame.players);
  if (thirdWinner === null) {
    console.log("can't find player");
  } else {
    console.log("player found");
  }

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

  return (
    <>
      <div className="confettiContainer">
        <Confetti width="2000px" height="2000px" />
      </div>
      <div className="gameEndContainer">
        <BalloonContainer totalBaloon={4} style={{ width: "100%" }} />
        <div className="gameEndTextField">
          <h1>And the Winner is...</h1>
          <h1 className="WinnnerName">{`${overallWinner.name}!`}</h1>
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
                    </div>
                  );
              })}
          </div>
          {/*<div className="winnerAvatarContainer">
              <Avatar />
            </div>
            <div className="avatar2nd">
              <Avatar />
              <h3></h3>
            </div>
            <div className="avatar3rd">
              <Avatar />
              <h3></h3>
  </div>*/}
        </div>
        <img src="/pedestal2.svg" alt="a Fucking Pedestal" />
      </div>
      <div className="shit11">
        <img src="/poopemoji.svg" />
      </div>
    </>
  );
}

export default GameEnd;

/*
<main style={{ paddingLeft: "10rem" }}>
      <h1>Game ends, .... Really pretty just for you Danni!!!!</h1>
      <h2>{`WINNER!! is ${overallWinner.name} with ${overallWinner.points} points`}</h2>
      <p>{`Played ${amountOfRoundsPlayed} rounds out of ${maxRounds}`}</p>

      <ul>
        {allPLayersWithStats &&
          allPLayersWithStats.map((player) => (
            <div>
              <h1>{player.playerName}</h1>
              <p>{`got ${player.points} Points`}</p>
              <p>{`was ${player.timesCzar} times Czar`}</p>
              <p>{`won ${player.wonRounds} round(s)`}</p>
              <p>{`played ${player.playedWhites} white card(s)`}</p>
              <p>{`played ${player.playedBlacks} black card(s)`}</p>
            </div>
          ))}
      </ul>

      <button style={{ color: "red" }}>
        <h3 onClick={() => router.push(`/lobby/${storeData.lobbyId}`)}>
          Back to Lobby!!!!!
        </h3>
      </button>
      <img src="/pedestal.svg" alt="" />
    </main>
    */
