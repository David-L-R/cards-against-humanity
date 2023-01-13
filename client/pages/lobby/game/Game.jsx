import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import CardTemplate from "../../../components/CardTemplate";
import DragAndDropContainer from "../../../features/Drag&Drop";
import { socket } from "../../Home";
import Czar from "../../../components/Czar";
import Countdown from "../../../components/Countdown";
import PlayedWhite from "../../../components/PlayedWhite";
import Winner from "../../../components/Winner";

const Game = () => {
  const router = useRouter();
  const { lobbyId, name } = router.query;
  const cookies = parseCookies();
  const [isHost, setHost] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [hand, setHand] = useState(null);
  const [gameStage, setGameStage] = useState(null);
  const [blackCards, setBlackCards] = useState([]);
  const [playedWhite, setPlayedWhite] = useState(null);
  const [timerTrigger, setTimerTrigger] = useState(false);
  const [confirmed, setConfirmed] = useState();
  let loading = false;
  const [timer, setTimer] = useState(false);
  const [cardsOnTable, setCardsOnTable] = useState(false);
  let playedBlackFromCzar = null;
  const [isCzar, setIsCzar] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [showErrMessage, setShowErrMessage] = useState(false);

  let gameIdentifier = null;

  useEffect(() => {
    //getting game infos and rejoin player to socket io
    socket.on("currentGame", ({ currentGame, err }) => {
      if (err || !currentGame) return setShowErrMessage(err);

      const lastTurnIndex = currentGame.turns.length - 1;
      const lastTurn = currentGame.turns[lastTurnIndex];
      playedBlackFromCzar = lastTurn.black_card;
      const currentCzarId = lastTurn?.czar?.id;
      const playerId = cookies.socketId;
      gameIdentifier = currentGame?.gameIdentifier;
      const currentPlayer = currentGame.players?.find(
        (player) => player.id === playerId
      );
      const confirmedWhiteCards = lastTurn.white_cards?.find(
        (player) => player.player === playerId
      )?.played_card;
      const currentTurnIndex = currentGame.turns.length - 1;
      const currentStageIndex =
        currentGame.turns[currentTurnIndex].stage.length - 1;
      if (currentPlayer) {
        // get game stage and player cards from current game wich is response from server
        const stage =
          currentGame.turns[currentTurnIndex].stage[currentStageIndex];
        let { hand, isHost } = currentPlayer;
        const { black_cards } = currentGame.deck;

        //check if the host
        if (isHost) setHost(true);

        //skipp dealing phase because of rerender
        if (stage === "dealing") return setGameStage(stage);

        //check is czar
        currentCzarId === cookies.socketId ? setIsCzar(true) : setIsCzar(false);
        //if czar and white is is currently runnning, display white cards from users
        if (
          currentCzarId === cookies.socketId &&
          (stage === "white" || stage === "deciding")
        ) {
          const playerList = lastTurn.white_cards.map(
            (player) => player.played_card
          );
          setPlayedWhite(playerList);
        }

        if (confirmedWhiteCards && !isCzar) {
          // setConfirmed(true);
          setCardsOnTable({
            table: {
              label: "table",
              cards: playedBlackFromCzar
                ? [playedBlackFromCzar, ...confirmedWhiteCards]
                : [],
            },
            player: { label: "player", cards: hand },
          });
        } else {
          setCardsOnTable({
            table: {
              label: "table",
              cards: playedBlackFromCzar ? [playedBlackFromCzar] : [],
            },
            player: { label: "player", cards: hand },
          });
        }
        setCurrentTurn(lastTurn);
        setBlackCards((prev) => (prev = black_cards));
        setHand(hand);
        setGameId(currentGame.id);
        setTimerTrigger(currentGame.timerTrigger);
        setGameStage(stage);
        loading = false;
      }
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  const chooseBlackCard = (selected) => {
    const playerData = {
      playedBlack: selected,
      player: { id: cookies.socketId },
      id: cookies.socketId,
      stage: "black",
      blackCards,
      gameId,
      lobbyId,
    };

    socket.emit("changeGame", playerData);
  };

  const whiteCardChoosed = (cards) => {
    setConfirmed(true);
    const playerData = {
      playerId: cookies.socketId,
      stage: "white",
      blackCards,
      gameId,
      lobbyId,
      playedWhite: cards,
    };
    socket.emit("changeGame", { ...playerData });
  };

  const handleMouseOver = (cards) => {
    setCardsOnTable((prev) => {
      return {
        ...prev,
        table: { ...prev.table, cards: [...prev.table.cards, ...cards] },
      };
    });
  };

  const handleMouseLeave = (cards) => {
    setCardsOnTable((prev) => {
      return {
        ...prev,
        table: { ...prev.table, cards: prev.table.cards.slice(0, 1) },
      };
    });
  };

  // sbumit choosed winner from czar
  const submitWinner = (cards) => {
    const playerData = {
      playerId: cookies.socketId,
      stage: "winner",
      gameId,
      lobbyId,
      winningCards: cards,
    };
    socket.emit("changeGame", { ...playerData });
  };

  //finish the current round and start a new one
  const checkoutRound = () => {
    const playerData = {
      playerId: cookies.socketId,
      stage: "completed",
      gameId,
      lobbyId,
    };
    socket.emit("changeGame", { ...playerData });
  };

  //self update page after got redirected, use key from query as lobby id
  useEffect(() => {
    if (router.query.lobbyId && !loading) {
      loading = true;
      socket.emit("getUpdatedGame", { lobbyId, name, id: cookies.socketId });
    }
  }, [router.isReady]);

  // if host start the game by send the server the current "starting" stage
  useEffect(() => {
    if (lobbyId) {
      if (gameStage === "start" && isHost && !loading) {
        socket.emit("changeGame", {
          blackCards,
          player: { hand, id: cookies.socketId },
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

      if (gameStage !== "deciding") setConfirmed(false);
    }
    return setTimer(false);
  }, [gameStage]);

  return (
    <main className="game">
      {gameStage === "winner" ? (
        <>
          <div className="debuggerMonitor">
            Game player : {name} <br />
            <br />
            gamestage : {gameStage}
            <br />
            Czar: {isCzar ? "yes" : "no"}
            <br />
            is Host: {isHost ? "yes" : "no"}
            <br />
            timerTrigger: {timerTrigger ? "true" : "false"}
            <br />
            timer:{timer}
            <br />
            Loadin:{loading ? "true" : "false"}
          </div>
          <Winner currentTurn={currentTurn} checkoutRound={checkoutRound} />
        </>
      ) : (
        <>
          <div className="debuggerMonitor">
            Game player : {name} <br />
            <br />
            gamestage : {gameStage}
            <br />
            Czar: {isCzar ? "yes" : "no"}
            <br />
            is Host: {isHost ? "yes" : "no"}
            <br />
            timerTrigger: {timerTrigger ? "true" : "false"}
            <br />
            timer:{timer}
            <br />
            Loadin:{loading ? "true" : "false"}
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
          {(isCzar && gameStage !== "black") || !isCzar ? (
            <DragAndDropContainer
              data={cardsOnTable}
              setData={setCardsOnTable}
              element={CardTemplate}
              isCzar={isCzar}
              whiteCardChoosed={whiteCardChoosed}
              confirmed={confirmed}
              stage={gameStage}>
              {playedWhite && isCzar && (
                <ul className={"cardDisplay playedWhite"}>
                  {playedWhite.map((cards, index) => (
                    <li
                      onMouseEnter={() => handleMouseOver(cards)}
                      onMouseLeave={() => handleMouseLeave(cards)}
                      key={cards[index] + index}>
                      {cards.map((card) => (
                        <PlayedWhite card={card} key={card.text} />
                      ))}
                      <h3
                        onClick={() => submitWinner(cards)}
                        className="choose-button"
                        disabled={gameStage === "deciding" ? false : true}>
                        Choose as the Winner
                      </h3>
                    </li>
                  ))}
                </ul>
              )}
            </DragAndDropContainer>
          ) : null}
          {/* {timerTrigger && timer && (
        <div className="timerContainer">
          <Countdown timer={timer} setTimer={setTimer} />
        </div>
      )} */}

          {!timer && (
            <div className="timeMessageContainer">
              <h1>Time's up Bitch!</h1>
            </div>
          )}
          {showErrMessage && (
            <Error
              showErrMessage={showErrMessage}
              setShowErrMessage={setShowErrMessage}
            />
          )}
        </>
      )}
    </main>
  );
};

export default Game;
