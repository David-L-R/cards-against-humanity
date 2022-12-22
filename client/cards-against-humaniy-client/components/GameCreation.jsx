import { useState } from "react";

const GameCreation = () => {
  const [players, setPlayers] = useState(4);
  const [rounds, setRounds] = useState(10);

  async function handleSubmit(e) {
    e.preventDefault();
    if (players >= 3 && players <= 10 && rounds >= 3 && rounds <= 30) {
      let maxPlayers = parseInt(players);
      let maxRounds = parseInt(rounds);

      const data = { maxPlayers, maxRounds };
      try {
        const response = await fetch("http://localhost:5555/sethost", {
          method: "POST",
          body: JSON.stringify(data),
        });
        console.log("server response", response.status);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <form>
      <div>
        <label>Amount of players</label>
        <input
          type="number"
          min="3"
          max="10"
          required
          placeholder="4 (default)"
          onChange={(e) => setPlayers((old) => (old = e.target.value))}
        />
      </div>
      <div>
        <label>Amount of rounds</label>
        <input
          type="number"
          min="3"
          max="30"
          required
          placeholder="10 (default)"
          onChange={(e) => setRounds((old) => (old = e.target.value))}
        />
      </div>
      <button type="submit" onClick={handleSubmit}>
        Send
      </button>
    </form>
  );
};

export default GameCreation;
