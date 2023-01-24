import React, { useState } from "react";
import { AiFillSetting, AiOutlinePlus } from "react-icons/ai";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
  BsPlusLg,
} from "react-icons/bs";
import { BiMinus } from "react-icons/bi";

const Settings = ({
  setHandSize,
  setAmountOfRounds,
  showSettings,
  setShowSettings,
}) => {
  const [error, setError] = useState(false);
  const [value, setValue] = useState(10);
  const [roundsValue, setRoundsValue] = useState(10);

  const handleAbort = (e) => {
    e.preventDefault();
    setShowSettings(false);
    setAmountOfRounds(10);
    setHandSize(10);
  };

  const handleChange = (value) => {
    if (value > 10) {
      setHandSize(10);
      return setError(true);
    }
    setError(false);
    setHandSize(value);
  };

  const handleIncrement = () => {
    if (value < 10) {
      setValue(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 1) {
      setValue(value - 1);
    }
  };

  const handleRoundsIncrement = () => {
    if (roundsValue < 20) {
      setRoundsValue(roundsValue + 1);
    }
  };

  const handleRoundsDecrement = () => {
    if (roundsValue > 1) {
      setRoundsValue(roundsValue - 1);
    }
  };

  return (
    <>
      <ul className="settingsInputContainer">
        {error && (
          <li>
            <h2 style={{ color: "red" }}>
              Maximum Amount of Cards is 10. Changed back to default(10)
            </h2>
          </li>
        )}
        <li>
          <h3>Amount of Cards per Player</h3>
        </li>
        <li>
          <button onClick={handleDecrement}>
            <BsFillArrowDownSquareFill className="settingsButton" />
          </button>
          <input
            className="settingsInput"
            type="number"
            value={value}
            min="1"
            max="10"
            placeholder="Default 10"
            onChange={(e) => handleChange(e.target.value)}
          />
          <button onClick={handleIncrement}>
            <BsFillArrowUpSquareFill className="settingsButton" />
          </button>
        </li>
        <li>
          <h3>Max amount of rounds</h3>
        </li>
        <li>
          <button onClick={handleRoundsDecrement}>
            <BsFillArrowDownSquareFill className="settingsButton" />
          </button>
          <input
            className="settingsInput"
            value={roundsValue}
            type="number"
            placeholder="Default 10"
            onChange={(e) => setRoundsValue(parseInt(e.target.value))}
          />
          <button onClick={handleRoundsIncrement}>
            <BsFillArrowUpSquareFill className="settingsButton" />
          </button>
        </li>
      </ul>
    </>
  );
};

export default Settings;
