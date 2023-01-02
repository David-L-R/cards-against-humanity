import { useRouter } from "next/router";
import React from "react";
import Lobby from "./Lobby";

const index = (props) => {
  const router = useRouter();
  return (
    <>
      <Lobby {...props} {...router} />
    </>
  );
};

export default index;
