import React, { useState } from "react";
import Navbar from "./Navbar";
import Head from "next/Head";

const Layout = ({ children, socket, ...props }) => {
  return (
    <>
      {console.log(
        "%cWant to know how we did it? %cAsk us %cAndy Schunke LinkedIn: https://www.linkedin.com/in/andy-schunke/ %cDanni Malka LinkedIn: https://www.linkedin.com/in/danni-malka-58a5b1117/",
        "padding: 50px 20% 10px 20%; color: white; font-family: Arial; font-size: 4em; font-weight: bolder; text-shadow: #000 5px 5px; background: black;",
        "padding: 10px 45% 10px 50%; color: white; font-family: Arial; font-size: 1.5em; font-weight: normal; text-shadow: #000 1px 1px; background: black; width: 100%;",
        "background: black; padding: 10px 30% 10px 30%;",
        "background: black; padding: 10px 30% 50px 30%;"
      )}

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
