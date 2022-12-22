import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import GameCreation from "../components/GameCreation";

export default function Home() {
  return (
    <div className={styles.container}>
      <GameCreation />
    </div>
  );
}
