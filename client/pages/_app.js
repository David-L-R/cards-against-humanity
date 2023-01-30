import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/layout";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { ContextWrapper } from "../context";

export const socket = io("http://localhost:5555/", {
  reconnection: true, // enable reconnection
  reconnectionAttempts: 5, // try to reconnect 5 times
  reconnectionDelay: 3000, // increase the delay between reconnection attempts to 3 seconds
});

function MyApp({ Component, router, pageProps: { session, ...pageProps } }) {
  const cookies = parseCookies();
  const [amountOfRounds, setAmountOfRounds] = useState(10);
  const [handSize, setHandSize] = useState(10);

  useEffect(() => {
    if (socket.id && !cookies.socketId)
      setCookie(null, "socketId", socket.id, { path: "/" });
  }, [socket.id]);

  useEffect(() => {
    socket.emit("cachUser", { cookieId: cookies.socketId });
  }, [cookies.socketId]);

  return (
    <ContextWrapper>
      <SessionProvider session={session}>
        <Layout
          socket={socket}
          setHandSize={setHandSize}
          setAmountOfRounds={setAmountOfRounds}
          handSize={handSize}
          amountOfRounds={amountOfRounds}>
          <AnimatePresence mode="wait" initial={false}>
            <Component
              key={router.pathname}
              {...pageProps}
              handSize={handSize}
              amountOfRounds={amountOfRounds}
              socket={socket}
            />
            ;
          </AnimatePresence>
        </Layout>
      </SessionProvider>
    </ContextWrapper>
  );
}

export default MyApp;
