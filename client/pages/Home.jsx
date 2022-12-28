import { is } from "@react-spring/shared";
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

  //If new lobby was createt, redirect to Lobby with room data
  socket.on("LobbyCreated", ({ lobbyId, hostName }) => {
    router.push({
      pathname: `/lobby/${lobbyId}`,
      query: { name: hostName },
    });
  });

  //redirecting to lobby with data after server found the game in DB
  socket.on("findRoom", (data) => {
    const { noRoom, lobbyId, playerName, message } = data;
    if (noRoom) return alert(message);
    router.push({
      pathname: `/lobby/${lobbyId}`,
      query: { name: playerName },
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
      <form onSubmit={(e) => handleSubmit(e)} className="lobbyForm">
        <input
          ref={playerName}
          type="text"
          placeholder="Enter Name"
          required
          className="lobbyInputField"
        />

        <div className="lobbyButtonWrapper">
          <button type="submit" className="lobbyButton">
            <span>Host Game</span>
          </button>
        </div>
      </form>
    );
  };

  //Join a game
  const JoinGame = () => {
    const handleSubmit = (e) => {
      e.preventDefault();

      // get values from form
      const lobbyId = roomKey.current.value;
      const newPlayerName = playerName.current.value;

      // request to server to find the game by the given id from form
      socket.emit("findRoom", { lobbyId, newPlayerName });
    };

    return (
      <div className="lobbyJoinFormContainer">
        <h2>Join a Game.</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="lobbyJoinForm">
          <p>Enter Your Name:</p>
          <input
            ref={playerName}
            type="text"
            placeholder="Name"
            required
            className="lobbyJoinInputField"
          />
          <p>Enter Room Code:</p>
          <input
            ref={roomKey}
            type="text"
            placeholder="code"
            required
            className="lobbyJoinInputField"
          />
          <div className="lobbyButtonWrapper">
            <button type="submit" className="lobbyButton">
              <span>Join Game</span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  const [isHostActive, setIsHostActive] = useState(false);
  const [isJoinActive, setIsJoinActive] = useState(false);
  const handleHostClick = (event) => {
    setIsHostActive(true);
    if (setIsJoinActive) setTimeout(() => setIsJoinActive(false), 150);
  };
  const handleJoinClick = (event) => {
    setIsJoinActive(true);
    if (setIsHostActive) setTimeout(() => setIsHostActive(false), 150);
  };
  return (
    <>
      <div className="lobbyCardsContainer">
        <div
          className={
            // i added a new class on the very parent elemt on each card, to change z-index and
            isHostActive // the perspective
              ? "lobbyContainer lobbyContainer-active"
              : " lobbyContainer "
          }
        >
          <div
            id={isJoinActive ? "lobbyHidden" : "lobbyVisible"}
            className={isHostActive ? "lobbyCard lobbyCardRotate" : "lobbyCard"}
            onClick={() => {
              setHostOrJoin("host");
              handleHostClick();
            }}
          >
            <div className="lobbyFront">
              <h2>Host a New Game.</h2>
            </div>
            <div className="lobbyBack">
              <h2>I'm the Host but my Homies calls me</h2>
              {hostOrJoin === "host" ? <HostGame /> : null}
            </div>
          </div>
        </div>
        <div
          className={
            isJoinActive
              ? "lobbyContainer  lobbyContainer-active " // also here
              : " lobbyContainer"
          }
        >
          <div
            id={isHostActive ? "lobbyHostHidden" : "lobbyHostVisible"}
            className={
              isJoinActive ? "lobbyCard lobbyJoinCardRotate" : "lobbyCard"
            }
            onClick={(e) => {
              setHostOrJoin("join");
              handleJoinClick();
            }}
          >
            <div
              className={
                isHostActive ? "lobbyFront lobbyjoinhidden" : "lobbyFront"
              }
            >
              <h2>Join a Game.</h2>
            </div>
            <div className="lobbyBack">
              {hostOrJoin === "join" ? <JoinGame /> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

/*
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
*/
