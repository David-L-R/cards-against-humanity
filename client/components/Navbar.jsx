import React, { useEffect, useState } from "react";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/Io";
import { CgProfile } from "react-icons/cg";
import { ImProfile } from "react-icons/im";
import { BsBug } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { BsCardChecklist } from "react-icons/bs";
import { AiOutlineDollarCircle, AiOutlineMail } from "react-icons/ai";
import Settings from "./Settings";
import { useAppContext } from "../context";
import Error from "./Error";
import GameRules from "./GameRules";
import ReportBug from "./ReportBug";
import Contact from "./Contact";
import { BiLogOut } from "react-icons/bi";
import Profile from "./Profile";

function Navbar(props) {
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showBug, setShowBug] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { socket, setHandSize, setAmountOfRounds, handSize, amountOfRounds } =
    props;
  const { data: session } = useSession();
  const { storeData } = useAppContext();
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [reconnect, setReconnect] = useState(false);
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
    if (socket) {
      socket.on("disconnect", (reason) => {
        setShowErrMessage(
          "Server connectrion lost! Please reload or go back to Hompage"
        );
      });

      socket.io.on("reconnect", () => {
        setShowErrMessage(false);
        setReconnect("Successfully reconnected with Server");
        setTimeout(() => {
          setReconnect(false);
        }, 5000);
      });
    }

    if (router.query.lobbyId && router.query.gameId) {
      setGameIdentifier(router.query.gameId[0]);
      setLobbyId(router.query.lobbyId);
    }

    if (Array.isArray(router.query.lobbyId)) {
      setGameIdentifier(null);
      return setLobbyId(router.query.lobbyId[0]);
    }
  }, [router.isReady, router, socket]);

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
      <div
        className="accountMenu"
        onMouseLeave={() => {
          setShowProfile(false);
          setShowSettings(false);
        }}
      >
        <ul>
          {session ? (
            <>
              <li id="sidebar-item">
                <div
                  id="settingsToggle"
                  onClick={() => setShowProfile((prev) => !prev)}
                >
                  <div className="navbarProfilePic">
                    <img
                      className="navIcon"
                      src={session.user.image}
                      alt={session.user.name}
                      referrerpolicy="no-referrer"
                    />
                  </div>
                  <div className="navBarText">
                    {session.user.name}
                    <span
                      className={
                        showProfile
                          ? "arrowDownIcon "
                          : "arrowDownIcon openArrow"
                      }
                    >
                      <IoIosArrowDown />
                    </span>
                  </div>
                </div>
              </li>
              <li id={showProfile ? "openSettings" : "closeSettings"}>
                <ul className="settingsInputContainer">
                  <li
                    className="profileMenu"
                    onClick={() => setShowProfileMenu(true)}
                  >
                    <span className="profileMenuIcon">
                      <ImProfile />
                    </span>
                    Profile
                  </li>
                  <li className="profileMenu" onClick={signOut}>
                    <span className="profileMenuIcon">
                      <BiLogOut />
                    </span>{" "}
                    Sign out
                  </li>
                </ul>
              </li>
            </>
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

          {lobbyId && !gameIdentifier && storeData?.isHost ? (
            <>
              <li id="sidebar-item">
                <div
                  id="settingsToggle"
                  onClick={() => setShowSettings((prev) => !prev)}
                >
                  <div className="navbarIcons">
                    <FiSettings />
                  </div>
                  <div className="navBarText">
                    Settings
                    <span
                      className={
                        showSettings
                          ? "arrowDownIcon "
                          : "arrowDownIcon openArrow"
                      }
                    >
                      <IoIosArrowDown />
                    </span>
                  </div>
                </div>
              </li>
              <li id={showSettings ? "openSettings" : "closeSettings"}>
                <Settings
                  showSettings={showSettings}
                  setShowSettings={setShowSettings}
                  setHandSize={setHandSize}
                  setAmountOfRounds={setAmountOfRounds}
                  handSize={handSize}
                  amountOfRounds={amountOfRounds}
                />
              </li>
            </>
          ) : (
            <li style={{ color: "grey" }}>
              <div className="navbarIcons">
                <FiSettings />
              </div>
              <div className="navBarText">Settings</div>
            </li>
          )}

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
          <li onClick={() => setShowContact(true)}>
            <div className="navbarIcons">
              <AiOutlineMail />
            </div>
            <div className="navBarText">Contact us</div>
          </li>
        </ul>
        <p className="copyright">
          Copyright © 2023 Man Makes Monster. All rights reserved.
        </p>
        <Profile
          setShowProfileMenu={setShowProfileMenu}
          showProfileMenu={showProfileMenu}
          className="gameRulesContent"
        />

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
        <Contact
          setShowContact={setShowContact}
          showContact={showContact}
          className="gameRulesContent"
        />
      </div>
      <Error
        showErrMessage={showErrMessage}
        setShowErrMessage={setShowErrMessage}
        success={reconnect}
      />
    </>
  );
}

export default Navbar;
