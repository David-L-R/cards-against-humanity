import React, { useEffect, useState } from "react";

function random(num) {
  return Math.floor(Math.random() * num);
}

function getRandomStyles() {
  let r = random(255);
  let g = random(255);
  let b = random(255);
  let mt = random(200);
  let ml = random(20);
  let dur = random(8) + 5;
  return {
    //backgroundColor: `rgba(${r},${g},${b},0.7)`,
    backgroundColor: `red`,
    color: `rgba(${r},${g},${b},0.7)`,
    boxShadow: `inset -7px -3px 10px rgba(255,255,255,0.7)`,
    margin: `${mt}px 0 0 ${ml}px`,
    animation: `float ${dur}s ease-in infinite`,
  };
}

function BalloonContainer() {
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    createBalloons(10);
  }, []);

  function createBalloons(num) {
    for (var i = num; i > 0; i--) {
      setBalloons((prevBalloons) => [
        ...prevBalloons,
        <div className="balloon" style={getRandomStyles()} />,
      ]);
    }
  }

  function removeBalloons() {
    setBalloons([]);
  }

  return (
    <div id="balloon-container" onClick={removeBalloons}>
      {balloons}
    </div>
  );
}

export default BalloonContainer;
