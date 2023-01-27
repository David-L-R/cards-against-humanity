import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

const calc = (x, y) => [
  -(y - window.innerHeight / 2) / 20,
  (x - window.innerWidth / 2) / 20,
  1.1,
];

const trans = (x, y, s) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

function Card() {
  const [isActive, setIsActive] = useState(false);
  const handleClick = (event) => {
    setIsActive((current) => !current);
  };

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 10, tension: 200, friction: 50 },
  }));
  return (
    <animated.div
      className="cardContainer"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: props.xys.to(trans) }}
    >
      <div
        className={isActive ? "card isFlipped" : "card"}
        onClick={handleClick}
      >
        <div className="cardFace cardFace--front">
          <h2>Man Makes Monster.</h2>
        </div>
        <div className="cardFace cardFace--back">
          <div className="cardContent">
            <div className="cardHeader">
              <h2>
                I don't mean to brag but they call me the Michael Jordan of
                _____________.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
}

export default Card;
