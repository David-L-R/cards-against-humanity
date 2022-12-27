import { route } from "express/lib/router";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { socket } from "../Home";

const Lobby = () => {
  const router = useRouter();
  const { lobby, name } = router.query;

  const [players, setPlayers] = useState([]);

  //listener to update page from server after DB entry changed
  socket.on("updateRoom", ({ playerList, err }) => {
    // console.log("UPDATE!!");
    // console.log(playerList);
    console.log("playerList", playerList);
    if (err) return console.warn(err);
    setPlayers((pre) => (pre = playerList));
  });

  useEffect(() => {
    //self update page after got redirected, use room lobby from query
    socket.emit("selfUpdate", { lobby });
  }, []);

  return (
    <>
      <h1>Lobby, waiting for players</h1>
      <h2>Lobby code: {lobby}</h2>
      <ul>
        {players &&
          players.map((player) => (
            <li key={player.name}>
              <p>Player Name : {player.name}</p>
              <p>Player ID : {player.id}</p>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Lobby;
