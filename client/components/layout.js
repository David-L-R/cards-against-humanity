import React from "react";
import Navbar from "./Navbar";
import Head from "next/Head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Card Game</title>
      </Head>
      <header>
        <Navbar />
      </header>
      {children}
    </>
  );
};

export default Layout;
