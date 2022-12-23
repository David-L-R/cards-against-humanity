import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Time's up!</div>;
  }

  return (
    <div className="timer">
      <div className="value">{remainingTime}</div>
    </div>
  );
};

function Countdown() {
  return (
    <div className="timer-wrapper">
      <CountdownCircleTimer
        isPlaying
        size={100}
        strokeWidth={17}
        strokeLinecap="butt"
        trailStrokeWidth={0}
        duration={45}
        colors={["#fff", "#EB455F", "#EB455F"]}
        colorsTime={[10, 5, 0]}
        onComplete={() => ({ shouldRepeat: true, delay: 1 })}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
}
export default Countdown;
