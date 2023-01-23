import React, { useEffect, useState } from "react";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { IoIosArrowBack } from "react-icons/Io";
import { CgProfile } from "react-icons/cg";
import { BsBug } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { BsCardChecklist } from "react-icons/bs";
import { AiOutlineDollarCircle, AiOutlineMail } from "react-icons/ai";
import Settings from "./Settings";
import { useAppContext } from "../context";
import GameRules from "./GameRules";
import ReportBug from "./ReportBug";

function Navbar(props) {
  const [showRules, setShowRules] = useState(false);
  const [showBug, setShowBug] = useState(false);
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

  const handleDonate = () => {
    window.open(
      "https://www.paypal.com/donate/?hosted_button_id=GYX5SR7ZTMGQA",
      "_blank",
      "height=500px,width=500px"
    );
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
    <>
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
      </nav>
      <div className="accountMenu">
        <ul>
          {session ? (
            <li className="loggedInProfileContainer">
              <div>
                <img src={session.user.image} alt={session.user.name} />
              </div>

              <div>
                <p> {session.user.name}</p>
                <button>Profile</button>
                <button onClick={signOut}>Sign out</button>
              </div>
            </li>
          ) : (
            <li className="loggedOutProfileContainer">
              <div className="navbarIcons">
                <CgProfile />
              </div>
              <div className="navBarText">
                <button onClick={signIn}>Sign In</button>
              </div>
            </li>
          )}

          <li>
            {/*{lobbyId && !gameIdentifier && storeData?.isHost && (
                <Settings
                  setHandSize={setHandSize}
                  setAmountOfRounds={setAmountOfRounds}
                  handSize={handSize}
                  amountOfRounds={amountOfRounds}
                />
              )}*/}
            <div className="navbarIcons">
              <FiSettings />
            </div>
            <div className="navBarText">Settings</div>
          </li>
          <li onClick={() => setShowBug(true)}>
            <div className="navbarIcons">
              <BsBug />
            </div>
            <div className="navBarText">Report a Bug</div>
          </li>
          <li onClick={handleDonate}>
            <div className="navbarIcons">
              <AiOutlineDollarCircle />
            </div>
            <div className="navBarText">Buy us Coffee</div>
          </li>
          <li onClick={() => setShowRules(true)}>
            <div className="navbarIcons">
              <BsCardChecklist />
            </div>
            <div className="navBarText">Game Rules</div>
          </li>
          <li>
            <div className="navbarIcons">
              <AiOutlineMail />
            </div>
            <div className="navBarText">Contact us</div>
          </li>
        </ul>
        <p className="copyright">
          Copyright © 2023 Man Makes Monster. All rights reserved.
        </p>

        <ReportBug
          setShowBug={setShowBug}
          showBug={showBug}
          className="gameRulesContent"
        />
        <GameRules
          setShowRules={setShowRules}
          showRules={showRules}
          className="gameRulesContent"
        />
      </div>
    </>
  );
}

/*
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
      */

export default Navbar;
