import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { BiCopy } from "react-icons/Bi";
import { RiVipCrown2Fill } from "react-icons/Ri";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { parseCookies, setCookie } from "nookies";
import { socket } from "../Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { showToastAndRedirect } from "../../utils/showToastAndRedirect";
import { motion as m } from "framer-motion";
import randomInsult from "../../utils/randomInsult";

const Lobby = () => {
  const router = useRouter();
  const { lobbyId, name, joinGame } = router.query;
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const cookies = parseCookies();
  const [isHost, setHost] = useState(false);
  const [inactive, setInactive] = useState(false);
  const amountOfRounds = useRef(null);
  const handSize = useRef(null);
  const [linkInvation, setlinkInvation] = useState("");

  //listener to update page from server after DB entry changed
  socket.on("updateRoom", ({ currentLobby, err }) => {
    const { players } = currentLobby;
    const player = players.find((player) => player.id === cookies.socketId);
    if (!currentLobby)
      return showToastAndRedirect(
        toast,
        router,
        "No Lobby found, please host a new game"
      );
    if (player) {
      const { isHost, inactive } = player;
      //check if the host
      isHost ? setHost(true) : setHost(false);
      inactive ? setInactive(true) : setInactive(false);

      if (err) return console.warn(err);

      setPlayers((pre) => (pre = players));
    }
  });

  // creates new game if host and redirect everyone to game
  socket.on("newgame", ({ newGameData }) => {
    const stage = newGameData.Game.turns[0].stage[0];
    const gameId = newGameData.Game.gameIdentifier;
    if (lobbyId) {
      if (stage === "start") {
        let gamePath = {
          pathname: `/lobby/game`,
          query: {
            name,
            lobbyId: lobbyId,
            game: gameId,
          },
        };
        router.push(gamePath);
      }
    }
  });

  useEffect(() => {
    if (!cookies.socketId)
      setCookie(null, "socketId", socket.id, { path: "/" });
    setlinkInvation(`${window?.location.href}&joinGame=true`);
  }, []);

  useEffect(() => {
    //self update page after got redirected, use key from query as lobby id
    if (lobbyId && cookies.socketId)
      socket.emit("updateLobby", { lobbyId, id: cookies.socketId, joinGame });
  }, [lobbyId, cookies.socketId]);

  //hello David :) WE good at naming conventions😘😘
  const toggleSomething = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleGameCreation = () => {
    // const setRounds = amountOfRounds.current.value;
    // const maxHandSize = handSize.current.value;
    socket.emit("createGameObject", { lobbyId }); //setRounds, maxHandSize,
  };

  const changePLayerName = (newPLayerName) => {
    socket.emit("updateLobby", {
      lobbyId,
      id: cookies.socketId,
      newPLayerName,
    });
  };

  return (
    <>
      <div className="waitingLobbyContainer">
        <div className="waitingLobbyCard">
          <m.div
            className="framerContainer"
            initial={{ y: -500, rotate: -30 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{
              x: -1300,
              rotate: -120,
              transition: { duration: 0.75 },
            }}>
            <div className="waitingLobbyTextWrapper">
              <h1>
                Waiting for players&nbsp;
                <span className="loadingContainer">
                  <div className="loader">
                    <div className="circle" id="a" />
                    <div className="circle" id="b" />
                    <div className="circle" id="c" />
                  </div>
                </span>
              </h1>
            </div>
            <div className="lobbyIdContainer">
              <h3>Invite your Friends: </h3>
              <div className="lobbyIdCopyField">
                {copied ? (
                  <p className="tempCopyText">Copied to clipboard!</p>
                ) : null}
                <CopyToClipboard text={linkInvation} onCopy={toggleSomething}>
                  <div className="input-icon-wrapper">
                    <p>Click to copy invitation link</p>
                    <BiCopy className="icon" />
                  </div>
                </CopyToClipboard>
              </div>
            </div>
            <div className="waitingLobbyButtonWrapper">
              {isHost && (
                <button className="lobbyButton" onClick={handleGameCreation}>
                  <span>Ready</span>
                </button>
              )}
            </div>
            <input
              type="text"
              onChange={(e) => changePLayerName(e.target.value)}
              placeholder="Change name"
            />
          </m.div>
          <div className="dragContainer">
            <ul>
              {players &&
                players.map((player) => (
                  <li
                    key={player.name}
                    className={player.inactive ? "inactive" : null}>
                    <h2>{player.name.toUpperCase()}</h2>
                    {player.inactive && (
                      <p>is disconnected and {randomInsult()}</p>
                    )}
                    {player.isHost && (
                      <div className="hostCrown">
                        <RiVipCrown2Fill />
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <ToastContainer autoClose={3000} />
      </div>
    </>
  );
};

export default Lobby;
