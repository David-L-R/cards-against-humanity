import { socket } from "../pages/Home";
import useLocalStorage from "./useLocalStorage";
import React, { useEffect, useRef, useState } from "react";
import { parseCookies } from "nookies";

//Join a game
const JoinGame = ({ roomKey, playerName }) => {
  let [value, setValue] = useLocalStorage("name", "");
  let [roomCode, setRoomeCode] = useState("");
  const cookies = parseCookies();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (roomCode) {
      // get values from form
      const lobbyId = roomCode;
      const newPlayerName = playerName.current.value;
      const id = cookies.socketId;

      // request to server to find the game by the given id from form
      socket.emit("findRoom", { lobbyId, newPlayerName, id });
    }
  };

  // pull code from URL
  const displayRoomCode = (url) => {
    const startIndex = url.indexOf("lobby") + 6;
    const endIndex = url.indexOf("?");
    const roomCode = url.slice(startIndex, endIndex);
    if (url.length <= 50) return setRoomeCode("Wrong code. Check your link");

    setRoomeCode(roomCode);
  };

  useEffect(() => {
    roomKey.current.focus();
  }, []);

  return (
    <div className="lobbyJoinFormContainer">
      <h2>Join a Game.</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="lobbyJoinForm">
        <p>Enter Your Name:</p>
        <input
          maxLength={15}
          ref={playerName}
          type="text"
          placeholder="Name"
          required
          className="lobbyJoinInputField"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <p>Enter Room Code:</p>
        <input
          ref={roomKey}
          type="text"
          placeholder="code"
          required
          value={roomCode}
          className="lobbyJoinInputField"
          onChange={(e) => displayRoomCode(e.target.value)}
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

export default JoinGame;
