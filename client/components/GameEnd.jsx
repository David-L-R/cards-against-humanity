import { useRouter } from "next/router";
import React from "react";
import { useAppContext } from "../context";

function GameEnd({ currentGame }) {
  const amountOfRoundsPlayed = currentGame.turns.length;
  const maxRounds = currentGame.setRounds;
  const { storeData } = useAppContext();
  const router = useRouter();

  let overallWinner = 0;
  currentGame.players.forEach((player) => {
    if (player.points > overallWinner) overallWinner = player;
  });
  const allPLayersWithStats = currentGame.players.map((player) => ({
    playerName: player.name,
    points: player.points,
    timesCzar: currentGame.turns.filter((turn) => turn.czar.id === player.id)
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
    </main>
  );
}

export default GameEnd;
