import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { socket } from "../Home";

const GameLobby = () => {
  const router = useRouter();
  const roomId = router.query.roomId;
  const [players, setPlayers] = useState([]);

  //listener to update page from server after DB entry changed
  socket.on("updateRoom", ({ playerList, message }) => {
    console.log("UPDATE!!");
    if (message) return console.warn(message);
    setPlayers((pre) => (pre = playerList));
  });

  useEffect(() => {
    //self update page after got redirected, use room ID from query
    socket.emit("selfUpdate", { roomId });
  }, [roomId]);

  return (
    <>
      <h1>GameLobby, waiting for players</h1>
      <h2>Lobby code: {roomId}</h2>
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

export default GameLobby;
