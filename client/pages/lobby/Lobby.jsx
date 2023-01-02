import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiCopy } from "react-icons/Bi";
import { RiVipCrown2Fill } from "react-icons/Ri";
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
  const [host, setHost] = useState(false);

  //listener to update page from server after DB entry changed
  socket.on("updateRoom", ({ err, playerList, isHost }) => {
    //check if the host
    if (cookies.socketId === isHost?.id) setHost(true);

    if (err) return console.warn(err);

    setPlayers((pre) => (pre = playerList));
  });

  useEffect(() => {
    //self update page after got redirected, use key from query as lobby id
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
                  <div className="circle" id="a"></div>
                  <div className="circle" id="b"></div>
                  <div className="circle" id="c"></div>
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
            {host && (
              <button className="lobbyButton">
                <span>Ready</span>
              </button>
            )}
          </div>
          <div className="dragContainer">
            <ul>
              {players &&
                players.map((player) => (
                  <li key={player.name}>
                    <h2>{player.name.toUpperCase()}</h2>
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
      </div>
    </>
  );
};

export default Lobby;
