import { route } from "express/lib/router";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { socket } from "../Home";

const Lobby = () => {
  const router = useRouter();
  const { lobby, name } = router.query;

  const [players, setPlayers] = useState([]);

  //listener to update page from server after DB entry changed
  socket.on("updateRoom", ({ playerList, message }) => {
    console.log("UPDATE!!");
    if (message) return console.warn(message);
    setPlayers((pre) => (pre = playerList));
  });

  useEffect(() => {
    //self update page after got redirected, use room lobby from query
    socket.emit("selfUpdate", { lobby });
  }, [lobby]);

  return (
    <>
      <h1>Lobby, waiting for players</h1>
      <h2>Lobby code: {lobby}</h2>
      <ul>
        {players &&
          players.map((player) => (
            <li key={player.playerName}>
              <p>Player Name : {player.playerName}</p>
              <p>Player ID : {player.playerId}</p>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Lobby;
