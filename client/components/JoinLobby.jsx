import { socket } from "../pages/Home";
import useLocalStorage from "./useLocalStorage";
import React, { useEffect, useRef, useState } from "react";
import { parseCookies } from "nookies";

//Join a game
const JoinGame = ({ roomKey, playerName }) => {
  let [value, setValue] = useLocalStorage("name", "");
  const cookies = parseCookies();

  const handleSubmit = (e) => {
    e.preventDefault();

    // get values from form
    const lobbyId = roomKey.current.value;
    const newPlayerName = playerName.current.value;
    const id = cookies.socketId;

    // request to server to find the game by the given id from form
    socket.emit("findRoom", { lobbyId, newPlayerName, id });
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

export default JoinGame;
