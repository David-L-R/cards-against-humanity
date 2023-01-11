import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CardTemplate from "../../../components/cardTemplate";
import DragAndDropContainer from "../../../features/Drag&Drop";
import { showToastAndRedirect } from "../../../utils/showToastAndRedirect";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../../Home";
import Czar from "../../../components/Czar";
import Countdown from "../../../components/Countdown";

const Game = () => {
  const router = useRouter();
  const { lobbyId, name } = router.query;
  const cookies = parseCookies();
  const [isHost, setHost] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [hand, setHand] = useState(null);
  const [gameStage, setGameStage] = useState("");
  const [blackCards, setBlackCards] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timerTrigger, setTimerTrigger] = useState(false);
  const [timer, setTimer] = useState(false);
  const [cardsOnTable, setCardsOnTable] = useState(false);
  let playedBlackFromCzar = null;
  const [isCzar, setIsCzar] = useState(false);
  let gameIdentifier = null;

  //getting game infos and rejoin player to socket io
  socket.on("currentGame", ({ currentGame, err }) => {
    console.log("currentGame", currentGame);
    if (err || !currentGame) return showToastAndRedirect(toast, router, err);
    const lastTurnIndex = currentGame.turns.length - 1;
    const lastTurn = currentGame.turns[lastTurnIndex];
    playedBlackFromCzar = lastTurn.black_card;
    const currentCzarId = lastTurn?.czar?.randomPlayer?.id;
    const playerId = cookies.socketId;
    gameIdentifier = currentGame?.gameIdentifier;
    const currentPlayer = currentGame.players?.find(
      (player) => player.id === playerId
    );

    const currentTurnIndex = currentGame.turns.length - 1;
    const currentStageIndex =
      currentGame.turns[currentTurnIndex].stage.length - 1;
    if (currentPlayer) {
      // get game stage and player cards from current game wich is response from server
      const stage =
        currentGame.turns[currentTurnIndex].stage[currentStageIndex];
      const { hand, isHost } = currentPlayer;
      const { black_cards } = currentGame.deck;

      //check if the host
      if (isHost) setHost(true);

      //check is czar
      if (currentCzarId === cookies.socketId) setIsCzar(true);
      if (err) return console.warn(err);
      setCardsOnTable({
        table: {
          label: "table",
          cards: playedBlackFromCzar ? [playedBlackFromCzar] : [],
        },
        player: { label: "player", cards: hand },
      });
      setCurrentPlayer(currentPlayer);
      setBlackCards((prev) => (prev = black_cards));
      setHand(hand);
      setGameId(currentGame.id);
      setTimerTrigger(currentGame.timerTrigger);
      setGameStage(stage);
    }
  });

  // // provide czar with 3 cards to select one
  // const drawCardsToSelect = (index) => {
  //   const cardsForChoice = blackCards.slice(index, 3);
  //   setplayedBlack((prev) => (prev = [...cardsForChoice]));
  // };

  // // changes main black array after black card got selected from czar
  // const selectBlackCard = (index) => {
  //   const [selected] = blackCards.splice(index, 1);
  //   const newCardsOnTable = { ...cardsOnTable };
  //   newCardsOnTable.table.cards = [selected];
  //   setplayedBlack((prev) => (prev = []));

  //   setCardsOnTable((prev) => (prev = newCardsOnTable));
  //   setBlackCards((prev) => [...blackCards]);
  // };

  const chooseBlackCard = (selected) => {
    const playerData = {
      playedBlack: selected,
      player: { id: currentPlayer.playerId },
      id: cookies.socketId,
      stage: "black",
      blackCards,
      gameId,
      lobbyId,
    };
    console.log("playerData", playerData);

    socket.emit("changeGame", { ...playerData });
  };

  //self update page after got redirected, use key from query as lobby id
  useEffect(() => {
    if (lobbyId)
      socket.emit("getUpdatedGame", { lobbyId, name, id: cookies.socketId });
  }, [lobbyId]);

  // if host start the game by send the server the current "starting" stage
  useEffect(() => {
    console.log("timerTrigger", timerTrigger);
    if (gameStage === "start" && isHost) {
      socket.emit("changeGame", {
        blackCards,
        player: { hand, id: currentPlayer.playerId },
        stage: "dealing",
        gameId,
        gameIdentifier,
        lobbyId,
      });
    }

    if (gameStage === "black" && timerTrigger) {
      setTimer(10);
    }
    if (gameStage === "white" && timerTrigger) {
      setTimer(10);
    }
  }, [gameStage]);

  return (
    <main className="game">
      <div className="debuggerMonitor">
        Game player : {name} <br />
        <br />
        gamestage : {gameStage}
        <br />
        Czar: {isCzar ? "yes" : "no"}
        <br />
        timerTrigger: {timerTrigger ? "true" : "false"}
        <br />
        timer:{timer}
      </div>

      {isCzar && gameStage === "black" && (
        <Czar
          blackCards={blackCards}
          chooseBlackCard={chooseBlackCard}
          setCardsOnTable={setCardsOnTable}
          setBlackCards={setBlackCards}
          gameStage={gameStage}
          timer={timer}
          setTimer={setTimer}
        />
      )}
      {console.log(cardsOnTable, "cardsOnTable")}
      {(isCzar && gameStage !== "black") || !isCzar ? (
        <DragAndDropContainer
          data={cardsOnTable}
          setData={setCardsOnTable}
          element={CardTemplate}
          isCzar={isCzar}
        />
      ) : null}
      {timerTrigger && timer && (
        <div className="timerContainer">
          <Countdown timer={timer} setTimer={setTimer} />
        </div>
      )}
      {!timer && (
        <div className="timeMessageContainer">
          <h1>Time's up Bitch!</h1>
        </div>
      )}
      <ToastContainer autoClose={3000} />
    </main>
  );
};

export default Game;
