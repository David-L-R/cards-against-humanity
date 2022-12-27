import { useRouter } from "next/router";
import React from "react";
import Lobby from "./Lobby";

const lobby = (props) => {
  const router = useRouter();
  return <Lobby {...props} {...router} />;
};

export default lobby;
