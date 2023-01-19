import React, { useState } from "react";
import Navbar from "./Navbar";
import Head from "next/Head";

const Layout = ({ children, socket, ...props }) => {
  return (
    <>
      <Head>
        <title>Card Game</title>
      </Head>
      <header>
        <Navbar socket={socket} {...props} />
      </header>
      {children}
    </>
  );
};

export default Layout;
