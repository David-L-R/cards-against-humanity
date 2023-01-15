import { is } from "@react-spring/shared";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { io } from "socket.io-client";
import { motion as m } from "framer-motion";
import JoinGame from "../components/JoinLobby.jsx";
import HostGame from "../components/HostGame.jsx";
import Error from "../components/Error.jsx";

export const socket = io("http://localhost:5555/", {
  reconnection: true, // enable reconnection
  reconnectionAttempts: 5, // try to reconnect 5 times
  reconnectionDelay: 3000, // increase the delay between reconnection attempts to 3 seconds
});
const Home = () => {
  const playerName = useRef("");
  const roomKey = useRef("");
  const cookies = parseCookies();
  const [hostOrJoin, setHostOrJoin] = useState(null);
  const router = useRouter();
  const [showErrMessage, setShowErrMessage] = useState(false);
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

  useEffect(() => {
    setCookie(null, "socketId", socket.id, { path: "/" });
  }, [socket.id]);

  useEffect(() => {
    //If new lobby was createt, redirect to Lobby with room data
    socket.on("LobbyCreated", ({ lobbyId, hostName }) => {
      router.push({
        pathname: `/lobby/${lobbyId}`,
      });
    });

    //redirecting to lobby with data after server found the game in DB
    socket.on("foundRoom", (data) => {
      try {
        const { noRoom, lobbyId, playerName, err } = data;
        if (noRoom) {
          setShowErrMessage(err);
          return;
        }
        if (!lobbyId || !playerName) {
          throw new Error("Invalid lobbyId or playerName");
        }
        router.push({
          pathname: `/lobby/${lobbyId}`,
        });
      } catch (error) {
        console.error(error);
        alert("An error occurred while trying to navigate to the lobby");
      }
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <>
      <main className="lobbyCardsContainer">
        <m.div
          className="hostMotion"
          initial={{ y: -500, rotate: 30 }}
          animate={{ y: 0, rotate: 0 }}
          exit={{
            x: -1300,
            rotate: -120,
            transition: { duration: 0.75 },
          }}>
          <div
            className={
              // i added a new class on the very parent elemt on each card, to change z-index and
              isHostActive // the perspective
                ? "lobbyContainer lobbyContainer-active"
                : " lobbyContainer "
            }>
            <div
              id={isJoinActive ? "lobbyHidden" : "lobbyVisible"}
              className={
                isHostActive ? "lobbyCard lobbyCardRotate" : "lobbyCard"
              }
              onClick={() => {
                setHostOrJoin("host");
                handleHostClick();
              }}>
              <div className="lobbyFront">
                <h2>Host a New Game.</h2>
              </div>
              <div className="lobbyBack">
                <h2>I'm the Host but my Homies calls me</h2>
                {hostOrJoin === "host" ? (
                  <HostGame playerName={playerName} />
                ) : null}
              </div>
            </div>
          </div>
        </m.div>
        <m.div
          className="joinMotion"
          initial={{ y: 500, rotate: -30 }}
          animate={{ y: 0, rotate: 0 }}
          exit={{
            y: 1000,
            rotate: 120,
            transition: { duration: 0.75 },
          }}>
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
                {hostOrJoin === "join" ? (
                  <JoinGame roomKey={roomKey} playerName={playerName} />
                ) : null}
              </div>
            </div>
          </div>
        </m.div>
      </main>

      {showErrMessage && (
        <Error
          showErrMessage={showErrMessage}
          setShowErrMessage={setShowErrMessage}
        />
      )}
    </>
  );
};

export default Home;
