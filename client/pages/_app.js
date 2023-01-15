import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/layout";

function MyApp({ Component, router, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Component key={router.pathname} {...pageProps} />;
        </AnimatePresence>
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
