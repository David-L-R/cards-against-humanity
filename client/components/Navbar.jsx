import React, { useEffect, useState } from "react";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { IoIosArrowBack } from "react-icons/Io";
import Settings from "./Settings";
import { useAppContext } from "../context";

function Navbar(props) {
  const { socket, setHandSize, setAmountOfRounds, handSize, amountOfRounds } =
    props;
  const { data: session } = useSession();
  const { storeData } = useAppContext();

  const router = useRouter();
  const [lobbyId, setLobbyId] = useState(null);
  const cookies = parseCookies();
  const [gameIdentifier, setGameIdentifier] = useState(null);
  const backToLobby = () => {
    if (lobbyId) {
      const playerData = {
        playerId: cookies.socketId,
        lobbyId,
        gameId: lobbyId,
        leavedGame: true,
        gameIdentifier,
      };
      socket.emit("changeGame", playerData);
      router.push({
        pathname: `/lobby/${lobbyId}`,
      });
    }
  };

  useEffect(() => {
    if (router.query.lobbyId && router.query.gameId) {
      setGameIdentifier(router.query.gameId[0]);
      setLobbyId(router.query.lobbyId);
    }

    if (Array.isArray(router.query.lobbyId)) {
      setGameIdentifier(null);
      return setLobbyId(router.query.lobbyId[0]);
    }
  }, [router.isReady, router]);

  return (
    <nav className="navContainer">
      <div className="backButtonContainer">
        {lobbyId && gameIdentifier && (
          <h2 className="backButton">
            <button onClick={backToLobby}>
              <IoIosArrowBack />
            </button>
          </h2>
        )}
      </div>
      <div className="fuckitDannisadvice">
        {lobbyId && !gameIdentifier && storeData?.isHost && (
          <Settings
            setHandSize={setHandSize}
            setAmountOfRounds={setAmountOfRounds}
            handSize={handSize}
            amountOfRounds={amountOfRounds}
          />
        )}
        <div className="dropdownContainer">
          {session ? (
            <>
              <div className="dropdownIcon">
                <p className="greetingText"> {session.user.name}</p>
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="navIcon"
                />
              </div>

              <div className="dropdown-content">
                <button>Profile</button>
                <button onClick={signOut}>Sign out</button>
              </div>
            </>
          ) : (
            <>
              <img className="navIconSVG" src="/avatarPlaceholder.svg" alt="" />
              <div className="dropdown-content">
                <button onClick={signIn}>Login</button>
                <button onClick={signIn}>Sign up</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
