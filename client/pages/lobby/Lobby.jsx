import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiCopy } from "react-icons/Bi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { io } from "socket.io-client";
import { parseCookies } from "nookies";

const socket = io("http://localhost:5555", {
  reconnection: true, // enable reconnection
  reconnectionAttempts: 5, // try to reconnect 5 times
  reconnectionDelay: 3000, // increase the delay between reconnection attempts to 3 seconds
});

const Lobby = () => {
  const router = useRouter();
  const { lobbyId, name } = router.query;
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const cookies = parseCookies();

  //listener to update page from server after DB entry changed
  socket.on("updateRoom", ({ err, playerList, host }) => {
    console.log("host", host);
    if (err) return console.warn(err);

    setPlayers((pre) => (pre = playerList));

    console.error(err);
  });

  socket.on("userDisconnected", () =>
    socket.emit("currentID", { id: cookies.socketId })
  );

  useEffect(() => {
    //self update page after got redirected, use room lobby from query
    socket.emit("selfUpdate", { lobbyId, name, id: cookies.socketId });
  }, [lobbyId]);

  //hello David :) WE good at naming conventions😘😘
  const toggleSomething = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <>
      <div className="waitingLobbyContainer">
        <div className="waitingLobbyCard">
          <div className="waitingLobbyTextWrapper">
            <h1>
              Waiting for players
              <div className="loadingContainer">
                <div className="loader">
                  <div class="circle" id="a"></div>
                  <div class="circle" id="b"></div>
                  <div class="circle" id="c"></div>
                </div>
              </div>
            </h1>
          </div>
          <div className="lobbyIdContainer">
            <h3>Game code: </h3>
            <div className="lobbyIdCopyField">
              {copied ? <p className="tempCopyText">Copied!</p> : null}
              <CopyToClipboard text={lobbyId} onCopy={toggleSomething}>
                <p>
                  {lobbyId}
                  <BiCopy className="icon" />
                </p>
              </CopyToClipboard>
            </div>
          </div>
          <div className="waitingLobbyButtonWrapper">
            <button className="lobbyButton">
              <span>Ready</span>
            </button>
          </div>
          <div className="dragContainer">
            <ul>
              {players &&
                players.map((player) => (
                  <li key={player.name}>
                    <h2>{player.name.toUpperCase()}</h2>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;

/*
<h1>Lobby, waiting for players</h1>
      <h2>Lobby code: {lobbyId}</h2>
      <ul>
        {players &&
          players.map((player) => (
            <li key={player.name}>
              <p>Player Name : {player.name}</p>
              <p>Player ID : {player.id}</p>
            </li>
          ))}
      </ul>

*/
