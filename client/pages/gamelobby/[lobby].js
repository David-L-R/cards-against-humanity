import { PromiseProvider } from "mongoose";
import { useRouter } from "next/router";
import React from "react";
import GameLobby from "./GameLobby";

const lobby = (props) => {
  const router = useRouter();
  return (
    <main>
      <GameLobby {...props} {...router} />
    </main>
  );
};

export default lobby;
