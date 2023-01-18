import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import CardTemplate from "../../../components/CardTemplate";
import DragAndDropContainer from "../../../features/Drag&Drop";
import Czar from "../../../components/Czar";
import Countdown from "../../../components/Countdown";
import PlayedWhite from "../../../components/PlayedWhite";
import Winner from "../../../components/Winner";
import Error from "../../../components/Error";
import Scoreboard from "../../../components/Scoreboard";
import Loading from "../../../components/Loading";

const Game = ({ socket }) => {
  const router = useRouter();
  const [lobbyId, setLobbyId] = useState(null);
  const cookies = parseCookies();
  const [isHost, setHost] = useState(false);
  const [playerName, setPlayerName] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [hand, setHand] = useState(null);
  const [gameStage, setGameStage] = useState(null);
  const [blackCards, setBlackCards] = useState([]);
  const [playedWhite, setPlayedWhite] = useState(null);
  const [timerTrigger, setTimerTrigger] = useState(false);
  const [confirmed, setConfirmed] = useState();
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(false);
  const [cardsOnTable, setCardsOnTable] = useState(false);
  let playedBlackFromCzar = null;
  const [isCzar, setIsCzar] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [currentLobby, setCurrentLobby] = useState(false);
  const [gameIdentifier, setGameIdentifier] = useState(null);
  const [maxHandSize, setMaxHandSize] = useState(null);

  useEffect(() => {
    //getting game infos and rejoin player to socket io
    socket.on("currentGame", ({ currentGame, err }) => {
      console.log("currentGame", currentGame);
      setLoading(false);
      //if error ocurred
      if (err || !currentGame) {
        return setShowErrMessage(err);
      }
      // if players cokkie is not stored inside game Object = player is not part of the game, redirect to hompage
      if (
        !currentGame.players.find((player) => player.id === cookies.socketId)
      ) {
        setShowErrMessage(
          "Your are not part of this round, redirecting you back"
        );
        return setTimeout(() => {
          router.push("/");
        }, 3000);
      }

      //abort game if not enough player
      // if (currentGame.players.filter((player) => !player.inactive).length < 2) {
      //   setShowErrMessage(
      //     "Not enough players left. Game closed and redirecting you back!"
      //   );
      //   setTimeout(() => {
      //     router.push(`/lobby/${lobbyId}`);
      //   }, 3000);
      // }

      //if game is concluded, redirect
      // if (currentGame.concluded) {
      //   setShowErrMessage("This game goets closed, please create a new one");
      //   setTimeout(() => {
      //     router.push(`/lobby/${lobbyId}`);
      //   }, 3000);
      // }

      const lastTurnIndex = currentGame.turns.length - 1;
      const lastTurn = currentGame.turns[lastTurnIndex];
      playedBlackFromCzar = lastTurn.black_card;
      const currentCzarId = lastTurn?.czar?.id;
      const playerId = cookies.socketId;
      const currentPlayer = currentGame.players?.find(
        (player) => player.id === playerId
      );
      const confirmedWhiteCards =
        currentCzarId !== cookies.socketId &&
        lastTurn.white_cards.length > 0 &&
        lastTurn.white_cards.find((player) => player.player === playerId)
          .played_card;
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

        //if czar and stage white is is currently runnning, display white cards from users
        if (
          // currentCzarId === cookies.socketId &&
          stage === "white" ||
          stage === "deciding"
        ) {
          const playerList = lastTurn.white_cards
            .map((player) => player.played_card)
            .filter((cards) => cards.length > 0);
          setPlayedWhite(playerList.length > 0 ? playerList : null);
        }

        // during white stage, only update players screen if incoming black card differs from current one or already white cards where submitted
        if (confirmedWhiteCards.length > 0 && !isCzar) {
          setConfirmed(true);
          setCardsOnTable({
            table: {
              label: "table",
              cards: playedBlackFromCzar
                ? [playedBlackFromCzar, ...confirmedWhiteCards]
                : [],
            },
            player: { label: "player", cards: hand },
          });
        } else if (
          cardsOnTable?.table?.cards?.length < 1 ||
          !cardsOnTable ||
          cardsOnTable?.table?.cards[0]?.text !== playedBlackFromCzar?.text
        ) {
          setCardsOnTable({
            table: {
              label: "table",
              cards: playedBlackFromCzar ? [playedBlackFromCzar] : [],
            },
            player: { label: "player", cards: hand },
          });
        }
        setMaxHandSize(currentGame.handSize);
        setCurrentLobby(currentGame);
        setPlayerName(currentPlayer.name);
        setCurrentTurn(lastTurn);
        setBlackCards((prev) => (prev = black_cards));
        setHand(hand);
        setGameId(currentGame.id);
        setTimerTrigger(currentGame.timerTrigger);
        setGameStage(stage);
        setLoading(false);
      }
    });

    socket.on("newWhiteCard", ({ newWhite }) => {
      setCardsOnTable((prev) => {
        return {
          ...prev,
          player: { label: "player", cards: [...prev.player.cards, newWhite] },
        };
      });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [lobbyId, gameStage, gameIdentifier]);

  const chooseBlackCard = (selected) => {
    const playerData = {
      playedBlack: selected,
      player: { id: cookies.socketId },
      id: cookies.socketId,
      stage: "black",
      blackCards,
      gameId,
      lobbyId,
      gameIdentifier,
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
      gameIdentifier,
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
      gameIdentifier,
    };
    socket.emit("changeGame", { ...playerData });
  };

  //finish the current round and start a new one
  const checkoutRound = (id) => {
    if (
      currentLobby.turns[currentLobby.turns.length - 1].completed.find(
        (player) => player.player_id === id
      )
    )
      return;
    const playerData = {
      playerId: cookies.socketId,
      stage: "completed",
      gameId,
      lobbyId,
      gameIdentifier,
    };
    socket.emit("changeGame", { ...playerData });
  };

  //getting new white cards
  const getNewWhiteCard = () => {
    const playerData = {
      playerId: cookies.socketId,
      gameId,
      lobbyId,
      gameIdentifier,
    };

    if (cardsOnTable.player.cards.length < maxHandSize) {
      socket.emit("changeGame", { ...playerData, sendWhiteCards: true });
    }
  };

  //self update page after got redirected, use key from query as lobby id
  useEffect(() => {
    if (lobbyId) {
      setLobbyId(router.query.lobbyId);
      socket.emit("getUpdatedGame", {
        lobbyId: router.query.lobbyId,
        playerName,
        id: cookies.socketId,
        gameIdentifier,
      });
    }
  }, [lobbyId]);

  // setup lobbyID from router after router is ready
  useEffect(() => {
    if (router.query.gameId && router.query.lobbyId) {
      setGameIdentifier(router.query.gameId[0]);
      setLobbyId(router.query.lobbyId);
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

      if (gameStage === "black") setConfirmed(false);
    }
    return setTimer(false);
  }, [gameStage]);

  if (loading)
    return (
      <main>
        <Loading />
        {currentLobby && (
          <section className="scoreboard-container">
            <Scoreboard currentLobby={currentLobby} />
          </section>
        )}
      </main>
    );

  if (showErrMessage)
    return (
      <main>
        <h1>An error ocurred</h1>

        {showErrMessage && (
          <Error
            showErrMessage={showErrMessage}
            setShowErrMessage={setShowErrMessage}
          />
        )}
      </main>
    );

  return (
    <main className="game">
      {gameStage === "winner" ? (
        <>
          <div className="debuggerMonitor">
            Game player : {playerName} <br />
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
          {currentLobby && (
            <section className="scoreboard-container">
              <Scoreboard currentLobby={currentLobby} />
            </section>
          )}

          <Winner
            currentTurn={currentTurn}
            checkoutRound={checkoutRound}
            isCzar={isCzar}
            currentLobby={currentLobby}
          />
        </>
      ) : (
        <>
          <div className="debuggerMonitor">
            Game player : {playerName} <br />
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
          {currentLobby && (
            <section className="scoreboard-container">
              <Scoreboard currentLobby={currentLobby} />
            </section>
          )}
          {isCzar && blackCards && gameStage === "black" && (
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
              stage={gameStage}
              maxHandSize={maxHandSize}>
              {playedWhite && isCzar && (
                <ul className={"cardDisplay playedWhite"}>
                  {playedWhite.map(
                    (cards, index) =>
                      cards.length > 0 && (
                        <li
                          onMouseEnter={() => handleMouseOver(cards)}
                          onMouseLeave={() => handleMouseLeave(cards)}
                          key={cards[0].text + cards[0].pack + index}>
                          {cards.map((card) => (
                            <PlayedWhite card={card} key={card.text} />
                          ))}
                          <button
                            onClick={() => submitWinner(cards)}
                            className="choose-button"
                            disabled={gameStage === "deciding" ? false : true}>
                            {gameStage === "deciding"
                              ? "Choose as the Winner"
                              : "wait for palyers...."}
                          </button>
                        </li>
                      )
                  )}
                </ul>
              )}
            </DragAndDropContainer>
          ) : null}
          {/* {timerTrigger && timer && (
        <div className="timerContainer">
          <Countdown timer={timer} setTimer={setTimer} />
        </div>
      )} */}

          {/* {!timer && (
            <div className="timeMessageContainer">
              <h1>Time's up Bitch!</h1>
            </div>
          )} */}
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
