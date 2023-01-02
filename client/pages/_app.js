import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";

function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component key={router.pathname} {...pageProps} />;
    </AnimatePresence>
  );
}

export default MyApp;
