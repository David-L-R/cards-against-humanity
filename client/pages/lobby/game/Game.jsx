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
import { useAppContext } from "../../../context";
import GameEnd from "../../../components/GameEnd";

const Game = ({ socket }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [lobbyId, setLobbyId] = useState(null);
  const cookies = parseCookies();
  const [isHost, setHost] = useState(false);
  const [playerName, setPlayerName] = useState(null);
  const [isInactive, setIsInactive] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [hand, setHand] = useState(null);
  const [gameStage, setGameStage] = useState(null);
  const [blackCards, setBlackCards] = useState([]);
  const [playedWhite, setPlayedWhite] = useState(null);
  const [timerTrigger, setTimerTrigger] = useState(false);
  const [confirmed, setConfirmed] = useState();
  let [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(false);
  const [cardsOnTable, setCardsOnTable] = useState(false);
  let playedBlackFromCzar = null;
  const [isCzar, setIsCzar] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [currentLobby, setCurrentLobby] = useState(false);
  const [gameIdentifier, setGameIdentifier] = useState(null);
  const [maxHandSize, setMaxHandSize] = useState(null);
  const [closingGame, setClosingGame] = useState(false);
  const [gameEnds, setGameEnds] = useState(false);
  const { storeData, setStoreData } = useAppContext();

  const chooseBlackCard = (selected) => {
    const playerData = {
      playedBlack: selected,
      playerId: cookies.socketId,
      stage: "black",
      blackCards,
      gameId,
      lobbyId,
    };
    // if czar left == timer runs out
    if (!selected)
      return socket.emit("changeGame", { ...playerData, leavedGame: true });

    socket.emit("changeGame", playerData);
  };

  const whiteCardChoosed = (cards) => {
    setTimer(false);
    const playerData = {
      playerId: cookies.socketId,
      stage: "white",
      blackCards,
      gameId,
      lobbyId,
      playedWhite: cards,
    };

    //if timer runs out, submit random white cards based on black cards pick
    if (!cards) {
      const pick = cardsOnTable.table.cards[0].pick;
      playerData.playedWhite = cardsOnTable.player.cards.splice(0, pick);
      setCardsOnTable((prev) => ({ ...cardsOnTable }));

      socket.emit("changeGame", { ...playerData });
      socket.emit("changeGame", { ...playerData, leavedGame: true });
      return;
    }

    socket.emit("changeGame", { ...playerData, leavedGame: false });
    setConfirmed(true);
  };

  //display text from white cards inside black card while char is choosing winner
  const handleMouseOver = (cards) => {
    setCardsOnTable((prev) => {
      return {
        ...prev,
        table: { ...prev.table, cards: [...prev.table.cards, ...cards] },
      };
    });
  };

  //delete text again from white cards inside black card while char is choosing winner
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

    if (!cards) {
      playerData.winningCards = playedWhite[0];
      socket.emit("changeGame", { ...playerData });
      socket.emit("changeGame", { ...playerData, leavedGame: true });
      return;
    }

    socket.emit("changeGame", { ...playerData });
  };

  //clicking the ready button, stores ready state in DB
  const checkoutRound = (id, inactive) => {
    setTimer(false);

    //prevent player from smashing ready button like an idiot ^^
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
    };

    if (inactive) {
      socket.emit("changeGame", { ...playerData, leavedGame: true });
      return;
    }

    socket.emit("changeGame", { ...playerData });
  };

  //getting new white cards
  const getNewWhiteCard = () => {
    const playerData = {
      playerId: cookies.socketId,
      gameId,
      lobbyId,
    };

    if (cardsOnTable.player.cards.length < maxHandSize) {
      socket.emit("changeGame", {
        ...playerData,
        sendWhiteCards: true,
      });
    }
  };

  //  clsoes the game and display the game end component
  const handleClosingGame = (input) => {
    const force = input?.force;
    if (isHost || force) {
      const playerData = {
        playerId: cookies.socketId,
        gameId,
        lobbyId: storeData.lobbyId,
        closeGame: true,
      };
      socket.emit("changeGame", { ...playerData });
    }
  };

  const processGame = ({ currentGame, err, kicked }) => {
    //if player got kicket
    const player = currentGame?.players.find(
      (player) => player.id === cookies.socketId
    );
    if (kicked && !player && currentGame)
      setShowErrMessage("You got kicked! Redirecting you back"),
        setTimeout(() => {
          router.push("/");
        }, 3500);

    //if error ocurred
    if (err || (!currentGame && !kicked)) {
      setShowErrMessage(
        err ? err : "You are not part of this game! Redirecting you back"
      );
      setTimeout(() => {
        router.push("/");
      }, 3000);
      return;
    }

    //if game was closed, show Game end component
    if (currentGame.concluded) {
      setGameEnds(true);
      setTimer(false);
    }

    //if less then 3 players, let host decide to close the game
    // if (currentGame.players.filter((player) => !player.inactive).length < 3)
    //   setClosingGame(true);

    //if less then 2 players, close the game after 3.5s, else abort the closing function
    if (
      currentGame.players.filter((player) => !player.inactive).length < 2 &&
      !currentGame.concluded
    ) {
      setShowErrMessage(
        "Not enough Players left, game will be closed within 3 seconds"
      );
      handleClosingGame({ force: true });

      setTimeout(() => {
        router.push(`/lobby/${storeData.lobbyId}`);
      }, 3500);
      return;
    }

    // if players cookie is not stored inside game Object = player is not part of the game, redirect to hompage
    if (!currentGame.players.find((player) => player.id === cookies.socketId)) {
      setShowErrMessage("Your are not part of this game, redirecting you back");
      return setTimeout(() => {
        router.push(`/`);
      }, 3000);
    }

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
        ?.played_card;
    const currentTurnIndex = currentGame.turns.length - 1;
    const currentStageIndex =
      currentGame.turns[currentTurnIndex].stage.length - 1;
    if (currentPlayer) {
      // get game stage and player cards from current game wich is response from server
      const stage =
        currentGame.turns[currentTurnIndex].stage[currentStageIndex];
      let { hand, isHost } = currentPlayer;
      const { black_cards } = currentGame.deck;

      //set inactive state if player missed a round and display it as error
      currentPlayer.inactive ? setIsInactive(true) : setIsInactive(false);

      //check if the host
      if (isHost)
        setHost(true), setStoreData((prev) => ({ ...prev, isHost: true }));

      //skipp dealing phase because of rerender
      if (stage === "dealing") return setGameStage(stage);

      //check is czar
      currentCzarId === cookies.socketId
        ? (setIsCzar(true),
          currentCzarId === cookies.socketId &&
            gameStage !== "winner" &&
            setTimer(false))
        : setIsCzar(false);

      //if czar and stage white is is currently runnning, display white cards from users
      if (stage === "white" || stage === "deciding") {
        const playerList = lastTurn.white_cards
          .map((player) => player.played_card)
          .filter((cards) => cards.length > 0);
        setPlayedWhite(playerList.length > 0 ? playerList : null);
      }

      // during white stage, only update players screen if incoming black card differs from current one or already white cards where submitted
      if (confirmedWhiteCards?.length > 0 && !isCzar && currentPlayer) {
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
        console.log("cardsOnTable", cardsOnTable);
        console.log("cardsOnTable", !cardsOnTable);
        console.log(
          "third",
          cardsOnTable?.table?.cards[0]?.text !== playedBlackFromCzar?.text
        );
        console.log("current black", cardsOnTable?.table?.cards[0]?.text);
        console.log("income black", playedBlackFromCzar?.text);
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
    }
  };

  useEffect(() => {
    //getting whole game infos, also rejoin player to socket io
    socket.on("currentGame", ({ currentGame, err, kicked }) => {
      setLoading(false);
      processGame({ currentGame, err, kicked });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [router.isReady]);

  //self update page after got redirected, use key from query as lobby id
  useEffect(() => {
    if (lobbyId) {
      socket.emit("getUpdatedGame", {
        lobbyId: router.query.lobbyId,
        playerName,
        id: cookies.socketId,
      });
    }
  }, [lobbyId]);

  // setup lobbyID from router after router is ready
  useEffect(() => {
    if (router.query.gameId && router.query.lobbyId) {
      setGameIdentifier(router.query.gameId[0]);
      setLobbyId(router.query.lobbyId);
      setStoreData((prev) => ({
        ...prev,
        lobbyId: router.query.lobbyId,
        gameIdentifier: router.query.gameId[0],
      }));
    }
  }, [router.isReady]);

  // start dealing phase automalicly after game starts
  useEffect(() => {
    if (lobbyId) {
      if (gameStage === "start" && isHost && !loading) {
        socket.emit("changeGame", {
          blackCards,
          player: { hand, id: cookies.socketId },
          stage: "dealing",
          gameId,
          lobbyId,
        });
      }

      if (gameStage === "black" && timerTrigger) {
        setTimer(45);
      }

      if (gameStage === "white" && timerTrigger) {
        setTimer(60);
      }

      if (gameStage === "deciding" && timerTrigger) {
        setTimer(60);
      }

      if (gameStage === "winner" && timerTrigger) {
        setTimer(30);
      }

      if (gameStage === "black") setConfirmed(false);
    }
  }, [gameStage, isCzar]);

  // timer runs out logic
  useEffect(() => {
    // choose random white cards, submit and set player inactive
    if (timer === null && gameStage === "white" && !isCzar) {
      whiteCardChoosed(null);
    }

    // set czar inactive and assign a new one
    if (timer === null && gameStage === "black" && isCzar) {
      chooseBlackCard();
    }

    // set czar inactive and assign a new one
    if (timer === null && gameStage === "deciding" && isCzar) {
      submitWinner();
    }

    if (timer === null && gameStage === "winner") {
      checkoutRound(cookies.socketId, true);
    }
  }, [timer]);

  if (loading && !currentLobby)
    return (
      <main>
        <Loading />
        {currentLobby && (
          <>
            <Scoreboard currentLobby={currentLobby} socket={socket} />
          </>
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

  if (gameEnds) return <GameEnd currentGame={currentLobby} />;

  if (closingGame && !gameEnds)
    return (
      <main>
        <h1>{"To less players, continue with game anyway?"}</h1>
        {isHost && closingGame >= 2 && (
          <ul>
            <li>
              <button onClick={() => setClosingGame(false)}>Continue</button>
            </li>
            <li>
              <button onClick={handleClosingGame}>
                Close and back to lobby
              </button>
            </li>
          </ul>
        )}
      </main>
    );

  return (
    <main className="game">
      {gameStage === "winner" ? (
        <>
          <div className="debuggerMonitor" style={{ paddingRight: "4rem" }}>
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
            <>
              <Scoreboard currentLobby={currentLobby} />
            </>
          )}

          <Winner
            currentTurn={currentTurn}
            checkoutRound={checkoutRound}
            isCzar={isCzar}
            currentLobby={currentLobby}>
            {isInactive && (
              <div className="errMessage">
                {"You are inactive, you are able to turn back in each stage"}
              </div>
            )}
            {/* {timerTrigger && (
              <div className="timerContainer">
                <Countdown timer={timer} setTimer={setTimer} />
              </div>
            )} */}
          </Winner>
        </>
      ) : (
        <>
          <div className="debuggerMonitor" style={{ paddingRight: "4rem" }}>
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
              <Scoreboard
                currentLobby={currentLobby}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </section>
          )}

          {isInactive && (
            <div className="errMessage">
              {"You are inactive, you are able to turn back in each stage"}
            </div>
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
              getNewWhiteCard={getNewWhiteCard}
              setCardsOnTable={setCardsOnTable}
              loading={loading}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
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
          {timerTrigger && (
            <div className="timerContainer">
              <Countdown timer={timer} setTimer={setTimer} />
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
      <button
        style={{ color: "red", textDecoration: "underline" }}
        onClick={() => handleClosingGame()}>
        <h1>CLOSE GAME TO CHECK "GAME END" PAGE</h1>
      </button>
    </main>
  );
};

export default Game;
