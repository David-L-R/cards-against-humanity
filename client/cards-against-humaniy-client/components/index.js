import React from "react";
import Card from "./Card";
import Countdown from "./Countdown";

function index() {
  return (
    <div>
      <h1 className="temph1">Countdown</h1>
      <Countdown />
      <h1 className="temph1">Card</h1>
      <Card />
    </div>
  );
}

export default index;
