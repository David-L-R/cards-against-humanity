import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/layout";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { parseCookies, setCookie } from "nookies";

const socket = io("http://localhost:5555/", {
  reconnection: true, // enable reconnection
  reconnectionAttempts: 5, // try to reconnect 5 times
  reconnectionDelay: 3000, // increase the delay between reconnection attempts to 3 seconds
});

function MyApp({ Component, router, pageProps: { session, ...pageProps } }) {
  const cookies = parseCookies();

  useEffect(() => {
    if (socket.id && !cookies.socketId)
      setCookie(null, "socketId", socket.id, { path: "/" });
  }, [socket.id]);

  return (
    <SessionProvider session={session}>
      <Layout socket={socket}>
        <AnimatePresence mode="wait" initial={false}>
          <Component key={router.pathname} {...pageProps} socket={socket} />;
        </AnimatePresence>
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
