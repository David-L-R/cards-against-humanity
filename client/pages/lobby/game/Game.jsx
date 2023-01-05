import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CardTemplate from "../../../components/cardTemplate";
import DragAndDropContainer from "../../../features/Drag&Drop";
import { showToastAndRedirect } from "../../../utils/showToastAndRedirect";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../../Home";

const Game = () => {
  const router = useRouter();
  const { lobbyId, name } = router.query;
  const cookies = parseCookies();
  const [isHost, setHost] = useState(false);
  const [game, setGame] = useState(null);
  const [hand, setHand] = useState(null);
  const [gameStage, setGameStage] = useState("");
  const [whiteCards, setWhiteCards] = useState([]);
  const [blackCards, setBlackCards] = useState([]);
  const [playedBlack, setPlayedBlack] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timerTrigger, setTimerTrigger] = useState(false);
  const [cardsOnTable, setCardsOnTable] = useState(false);

  const [isCzar, setIsCzar] = useState(false);
  let gameIdentifier = null;

  //getting games infos and rejoin player to socket io
  socket.on("currentGame", ({ currentGame, err }) => {
    if (err || !currentGame) return showToastAndRedirect(toast, router, err);

    const lastTurn = currentGame.turns.length - 1;
    const currentCzarId = currentGame.turns[lastTurn]?.czar?.randomPlayer?.id;
    const playerId = cookies.socketId;
    gameIdentifier = currentGame?.gameIdentifier;
    const currentPlayer = currentGame.players?.find(
      (player) => player.id === playerId
    );

    const currentTurnIndex = currentGame.turns.length - 1;
    const currentStageIndex =
      currentGame.turns[currentTurnIndex].stage.length - 1;

    // get game stage and player cards from current game wich is response from server
    const stage = currentGame.turns[currentTurnIndex].stage[currentStageIndex];
    const { hand, isHost } = currentPlayer;
    const { white_cards, black_cards } = currentGame.deck;
    const { timerTrigger } = currentGame;

    //check if the host
    if (isHost) setHost(true);

    //check is czar
    if (currentCzarId === cookies.socketId) setIsCzar(true);
    if (err) return console.warn(err);
    setCardsOnTable({
      table: { label: "table", cards: [] },
      player: { label: "player", cards: hand },
    });
    setCurrentPlayer(currentPlayer);
    setTimerTrigger(timerTrigger);
    setWhiteCards((prev) => (prev = white_cards));
    setBlackCards((prev) => (prev = black_cards));
    setGameStage(stage);
    setHand(hand);
    setGame(currentGame);
  });

  const drawBlack = () => {
    const blackCardsDeckLength = blackCards.length - 1;
    const randomIndex = Math.floor(Math.random() * blackCardsDeckLength);
    //const [black] = blackCards.splice(randomIndex, 1);
    const [black] = blackCards.splice(0, 1);
    setPlayedBlack((prev) => [...prev, black]);
    setBlackCards((prev) => (prev = blackCards));
  };

  const confirmBlack = () => {
    const confirmedBlack = playedBlack[playedBlack.length - 1];
    const newCardsOnTable = { ...cardsOnTable };

    //add skelettons based on black cards pick
    let skeletons = [];
    for (let index = 0; index < confirmedBlack?.pick; index++) {
      skeletons.push({ text: "" });
    }
    //newCardsOnTable.table.cards = [confirmedBlack, ...skeletons];
    newCardsOnTable.table.cards = [confirmedBlack];

    setCardsOnTable((prev) => (prev = newCardsOnTable));
  };

  useEffect(() => {
    //self update page after got redirected, use key from query as lobby id
    if (lobbyId)
      socket.emit("getUpdatedGame", { lobbyId, name, id: cookies.socketId });
  }, [lobbyId]);

  useEffect(() => {
    // if host start the game by send the server the current "starting" stage
    if (gameStage === "start" && isHost) {
      socket.emit("changeGame", {
        deck: { white_cards: whiteCards, black_cards: blackCards },
        player: { hand, id: currentPlayer.playerId },
        stage: "dealing",
        gameId: game.id,
        gameIdentifier,
        lobbyId,
      });
    }
  }, [gameStage]);

  return (
    <>
      <div>
        Game player : {name} <br />
        <br />
        gamestage : {gameStage}
        <br />
        Czar: {isCzar ? "yes" : "no"}
      </div>

      <button onClick={drawBlack}>Choose Black Card</button>
      <button onClick={confirmBlack}>Confirm Black Card</button>
      <DragAndDropContainer
        data={cardsOnTable}
        setData={setCardsOnTable}
        element={CardTemplate}
      />
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default Game;
