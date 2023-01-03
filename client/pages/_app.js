import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, router, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AnimatePresence mode="wait" initial={false}>
        <Component key={router.pathname} {...pageProps} />;
      </AnimatePresence>
    </SessionProvider>
  );
}

export default MyApp;
