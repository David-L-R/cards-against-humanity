import React, { useState } from "react";
import { AiFillSetting } from "react-icons/ai";

const Settings = ({ setHandSize, setAmountOfRounds }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSettings(false);
  };

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

  return (
    <section
      className={
        showSettings ? "settings-container active" : "settings-container"
      }>
      <div className="heading">
        <h2>Settings</h2>
        <AiFillSetting
          className={showSettings ? "icon active" : "icon"}
          onClick={() => setShowSettings(true)}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <p style={{ color: "red" }}>
            Maximum Amount of Cards is 10. Changed back to default(10)
          </p>
        )}
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Max amount of cards, default 10"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max amount of rounds, default 10"
          onChange={(e) => setAmountOfRounds(e.target.value)}
        />
        <button type="submit">Set</button>
        <button type="submit" onClick={(e) => handleAbort}>
          Cancle
        </button>
      </form>
    </section>
  );
};

export default Settings;
