import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { socket } from "../pages/Home";
import useLocalStorage from "./useLocalStorage";

//Hosting a new game
const HostGame = ({ playerName }) => {
  let [value, setValue] = useLocalStorage("name", "");
  const cookies = parseCookies();

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
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      <div className="lobbyButtonWrapper">
        <button type="submit" className="lobbyButton">
          <span>Host Game</span>
        </button>
      </div>
    </form>
  );
};

export default HostGame;
