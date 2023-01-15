import React, { useEffect, useState } from "react";
import style from "../styles/cardTemplate.module.css";
import { parseCookies } from "nookies";
import BalloonContainer from "./FloatingBalloons";
import ShitContainer from "./ShitContainer";

const Winner = ({ currentTurn, checkoutRound, isCzar, amountOfPlayers }) => {
  const playerList = currentTurn?.players || [];
  //HERE
  const [playersReady, setPlayersReady] = useState(0);

  //TO HERE

  const wonPLayer = currentTurn.winner;
  const played_whites = [...wonPLayer.played_card];
  const { black_card } = currentTurn;
  const [youWon, setYouWon] = useState(false);
  const allPLayers = playerList.filter(
    (player) => player.player !== wonPLayer.player
  );
  const cookies = parseCookies();

  const handlePlayerReady = () => {
    setPlayersReady(playersReady + 1);
  };
  const addTextToBlack = (cards) => {
    //add text from thite cards to black cards
    if (cards) {
      const currentBlackText = black_card.text.split("");
      const textList = cards.map((card) => card.text);
      const newBlackText = currentBlackText
        .map((letter) => {
          if (letter === "_") {
            const sentance = textList
              .splice(0, 1)
              .map((text) => text.replaceAll(".", ""));
            if (!sentance[0]) return letter;
            return sentance[0];
          }
          return letter;
        })
        .join("");

      return newBlackText;
    }
  };

  const winnerCards = [
    ...played_whites.splice(0, 1),
    { ...black_card, text: addTextToBlack(wonPLayer.played_card) },
    ...played_whites,
  ];

  useEffect(() => {
    addTextToBlack();

    wonPLayer.player === cookies.socketId && setYouWon(true);
  }, []);

  return (
    <article className="winner-page-container">
      {youWon ? <BalloonContainer /> : isCzar ? "" : <ShitContainer />}
      {<h1>{youWon ? "You won!" : isCzar ? "You were Czar" : "You Lost"}</h1>}
      <ul className="winner-container">
        {winnerCards &&
          winnerCards.map((card) => (
            <li key={card.text}>
              <div
                className={
                  card?.pick
                    ? `${style.cardTemplateContainer} ${style.black}`
                    : `${style.cardTemplateContainer}`
                }
              >
                {card.text}
              </div>
            </li>
          ))}
      </ul>
      <li className="ready-button">
        <p
          onClick={() => {
            handlePlayerReady();
            checkoutRound();
          }}
        >
          Ready
        </p>
        <p>
          {playersReady}/{amountOfPlayers} players are ready.
        </p>
      </li>
      <ul className="player-container">
        {allPLayers &&
          allPLayers.map((player) => (
            <li key={player.played_card}>
              <div className={`${style.cardTemplateContainer} ${style.black}`}>
                {addTextToBlack(player.played_card)}
              </div>
            </li>
          ))}
      </ul>
    </article>
  );
};

export default Winner;
