import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { socket } from "../Home";

const GameLobby = () => {
  const router = useRouter();
  const roomId = router.query.roomId;
  const [players, setPlayers] = useState([]);

  //lister to update page from server
  socket.on("updateRoom", ({ playerList, message }) => {
    if (message) return console.warn(message);
    setPlayers((pre) => (pre = playerList));
  });

  useEffect(() => {
    //self update page after redirecting
    socket.emit("selfUpdate", { roomId });
  }, [roomId]);

  return (
    <>
      <h1>GameLobby, waiting for players</h1>
      <h1>TODO!!! Delete user be disconnecting!!</h1>
      <h2>Lobby code: {roomId}</h2>
      <ul>
        {players &&
          players.map((player) => (
            <li key={player.playerName}>
              Player Name :{player.playerName}, Player ID : {player.playerId}
            </li>
          ))}
      </ul>
    </>
  );
};

export default GameLobby;
