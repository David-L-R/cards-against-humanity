import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5555");
const Home = () => {
  const playerName = useRef("");
  const amountPLayer = useRef(0);
  const roomKey = useRef("");
  const [hostOrJoin, setHostOrJoin] = useState(null);
  const router = useRouter();

  //If new room was createt, redirect to Lobby with room data
  // socket.on("roomCreated", ({ roomId, hostName }) => {
  //   router.push({
  //     pathname: `/gamelobby/${hostName}`,
  //     query: { roomId },
  //   });
  // });

  socket.on("LobbyCreated", ({ lobbyId, hostName }) => {
    console.log("lobby created");
    router.push({
      pathname: `/lobby/${lobbyId}`,
      query: { name: hostName },
    });
  });

  //redirecting to lobby with data after server found the game in DB
  socket.on("findRoom", (data) => {
    const { noRoom, roomId, playerName, message } = data;
    if (noRoom) return alert(message);
    router.push({
      pathname: `/gamelobby/${playerName}`,
      query: { roomId },
    });
  });

  //Hosting a new game
  const HostGame = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const hostName = playerName.current.value;
      socket.emit("createNewLobby", { hostName });
    };
    return (
      <form onSubmit={(e) => handleSubmit(e)}>
        <input ref={playerName} type='text' placeholder='Enter Name' required />
        <button type='submit'>Host Game</button>
      </form>
    );
  };

  //Join a game
  const JoinGame = () => {
    const handleSubmit = (e) => {
      e.preventDefault();

      // get values from form
      const roomId = roomKey.current.value;
      const newPlayerName = playerName.current.value;

      // request to server to find the game by the given id from form
      socket.emit("findRoom", { roomId, newPlayerName });
    };

    return (
      <form onSubmit={(e) => handleSubmit(e)}>
        <input ref={playerName} type='text' placeholder='Enter Name' required />
        <input
          ref={roomKey}
          type='text'
          placeholder='Enter room code'
          required
        />
        <button type='submit'>Join Game</button>
      </form>
    );
  };

  return (
    <>
      <h1>Landing Page</h1>
      <div>
        <button onClick={() => setHostOrJoin("host")}>Host new Game</button>
        <button onClick={() => setHostOrJoin("join")}>Join Game</button>
      </div>
      <div>
        {hostOrJoin === "host" ? (
          <HostGame />
        ) : hostOrJoin === "join" ? (
          <JoinGame />
        ) : null}
      </div>
    </>
  );
};

export default Home;
