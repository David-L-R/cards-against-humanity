import { route } from "express/lib/router";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { socket } from "../Home";
import { BiCopy } from "react-icons/Bi";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Lobby = () => {
  const router = useRouter();
  const { lobbyId, name } = router.query;
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);

  //listener to update page from server after DB entry changed
  socket.on("updateRoom", ({ playerList, err }) => {
    if (err) return console.warn(err);
    setPlayers((pre) => (pre = playerList));
  });

  useEffect(() => {
    //self update page after got redirected, use room lobby from query
    socket.emit("selfUpdate", { lobbyId });
  }, [lobbyId]);

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
              <CopyToClipboard text={lobbyId} onCopy={() => setCopied(true)}>
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
