import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useAppContext } from "../context";

function Countdown({ timer, setTimer, lobbyId, socket, isCzar }) {
  const { storeData, setStoreData } = useAppContext();
  let currentTimer = timer;

  const renderTime = ({ remainingTime }) => {
    currentTimer = remainingTime;
    if (remainingTime === 0) {
      setTimer(null);
      currentTimer = null;
    } else
      return (
        <div className="timer">
          <div className="value">{remainingTime}</div>
        </div>
      );
  };

  const synchronizeTimer = ({ timer, requestSync }) => {
    // console.log("currentTimer", currentTimer);
    if (timer === "sendSync" && isCzar) {
      return socket.emit("sendTimer", {
        timer: currentTimer,
        lobbyId: storeData.lobbyId,
      });
    }
    if (isCzar) {
      return socket.emit("sendTimer", { timer, lobbyId: storeData.lobbyId });
    }
    if (requestSync && !isCzar) {
      socket.emit("sendTimer", { requestSync, lobbyId: storeData.lobbyId });
    }
  };

  if (timer) synchronizeTimer({ timer });

  useEffect(() => {
    //start timer wich is send from czar
    socket.on("getTimer", ({ timer, requestSync }) => {
      setTimer(timer);
      if (requestSync) {
        synchronizeTimer({ timer: "sendSync" });
      }
    });
    if (!isCzar) synchronizeTimer({ requestSync: true });

    return () => {};
  }, []);

  if (!timer) return null;

  return (
    <div className="timer-wrapper">
      <CountdownCircleTimer
        isPlaying
        size={100}
        strokeWidth={17}
        strokeLinecap="butt"
        trailStrokeWidth={0}
        duration={timer}
        colors={["#fff", "#EB455F", "#EB455F"]}
        colorsTime={[10, 5, 0]}
        onComplete={() => ({ shouldRepeat: false, delay: 1 })}>
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
}
export default Countdown;
