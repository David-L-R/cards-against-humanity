import React, { useState } from "react";
import Navbar from "./Navbar";
import Head from "next/head";

const Layout = ({ children, socket, ...props }) => {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta key={8} name="theme-color" content="#171717" />
        <title>MMM</title>
      </Head>

      <header>
        <Navbar socket={socket} {...props} />
      </header>
      {children}
    </>
  );
};

export default Layout;
