import { is } from "@react-spring/shared";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { io } from "socket.io-client";

const socket = io("http://localhost:5555", {
  reconnection: true, // enable reconnection
  reconnectionAttempts: 5, // try to reconnect 5 times
  reconnectionDelay: 3000, // increase the delay between reconnection attempts to 3 seconds
});
const Home = () => {
  const playerName = useRef("");
  const roomKey = useRef("");
  const [hostOrJoin, setHostOrJoin] = useState(null);
  const router = useRouter();
  const cookies = parseCookies();
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    setCookie(null, "socketId", socket.id, { path: "/" });
  }, [socket.id]);

  //If new lobby was createt, redirect to Lobby with room data
  socket.on("LobbyCreated", ({ lobbyId, hostName }) => {
    router.push({
      pathname: `/lobby/${lobbyId}`,
      query: { name: hostName },
    });
  });

  //redirecting to lobby with data after server found the game in DB
  socket.on("foundRoom", (data) => {
    try {
      const { noRoom, lobbyId, playerName, err } = data;
      if (noRoom) {
        setShowErrMessage(true);
        return;
      }
      if (!lobbyId || !playerName) {
        throw new Error("Invalid lobbyId or playerName");
      }
      router.push({
        pathname: `/lobby/${lobbyId}`,
        query: { name: playerName },
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred while trying to navigate to the lobby");
    }
  });

  //Hosting a new game
  const HostGame = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const hostName = playerName.current.value;
      const id = cookies.socketId;
      if (!id) return console.warn("NO ID");
      socket.emit("createNewLobby", { hostName, id });
    };
    return (
      <form onSubmit={(e) => handleSubmit(e)} className="lobbyForm">
        <input
          maxLength={15}
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
      const id = cookies.socketId;

      // request to server to find the game by the given id from form
      socket.emit("findRoom", { lobbyId, newPlayerName, id });
    };

    return (
      <div className="lobbyJoinFormContainer">
        <h2>Join a Game.</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="lobbyJoinForm">
          <p>Enter Your Name:</p>
          <input
            autoFocus
            maxLength={15}
            ref={playerName}
            type="text"
            placeholder="Name"
            required
            className="lobbyJoinInputField"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
          }>
          <div
            id={isJoinActive ? "lobbyHidden" : "lobbyVisible"}
            className={isHostActive ? "lobbyCard lobbyCardRotate" : "lobbyCard"}
            onClick={() => {
              setHostOrJoin("host");
              handleHostClick();
            }}>
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
          }>
          <div
            id={isHostActive ? "lobbyHostHidden" : "lobbyHostVisible"}
            className={
              isJoinActive ? "lobbyCard lobbyJoinCardRotate" : "lobbyCard"
            }
            onClick={(e) => {
              setHostOrJoin("join");
              handleJoinClick();
            }}>
            <div
              className={
                isHostActive ? "lobbyFront lobbyjoinhidden" : "lobbyFront"
              }>
              <h2>Join a Game.</h2>
            </div>
            <div className="lobbyBack">
              {hostOrJoin === "join" ? <JoinGame /> : null}
            </div>
          </div>
        </div>
      </div>
      <div className="errorBox">
        {showErrMessage ? (
          <div
            className="errMessage"
            onClose={setTimeout(() => setShowErrMessage(false), 5000)}>
            Invalid Room Code - please try again
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Home;
