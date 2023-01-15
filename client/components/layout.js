import React from "react";
import Navbar from "./Navbar";
import Head from "next/Head";

const Layout = ({ children, socket }) => {
  return (
    <>
      <Head>
        <title>Card Game</title>
      </Head>
      <header>
        <Navbar socket={socket} />
      </header>
      {children}
    </>
  );
};

export default Layout;
