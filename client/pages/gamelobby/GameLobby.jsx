import React, { useEffect, useState } from "react";
import { socket } from "../Home";

const GameLobby = ({ query }) => {
  const [roomId, setRoomId] = useState(query.roomId);
  const [players, setPlayers] = useState([]);

  //lister to update page from server
  socket.on("updateRoom", ({ playerList, message }) => {
    if (message) return alert(message);
    setPlayers((pre) => (pre = playerList));
  });

  useEffect(() => {
    //self update page after redirecting
    socket.emit("selfUpdate", { roomId });
  }, []);

  return (
    <>
      <h1>GameLobby</h1>
      <h2>Lobby code: {roomId}</h2>
      <ul>
        {players && players.map((player) => <li>{player.playerName}</li>)}
      </ul>
    </>
  );
};

export default GameLobby;
