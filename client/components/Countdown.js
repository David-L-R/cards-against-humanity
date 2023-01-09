import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

function Countdown({ timer, setTimer }) {
  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      setTimer(null);
      return <div className="timer">Time's up!</div>;
    } else
      return (
        <div className="timer">
          <div className="value">{remainingTime}</div>
        </div>
      );
  };

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
