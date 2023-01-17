import React, { useEffect, useState } from "react";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { IoIosArrowBack } from "react-icons/Io";

function Navbar({ socket }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [lobbyId, setLobbyId] = useState(null);
  const cookies = parseCookies();

  const backToLobby = () => {
    if (lobbyId) {
      const playerData = {
        playerId: cookies.socketId,

        gameId: lobbyId,
        leavedGame: true,
      };
      console.log("playerData", playerData);
      socket.emit("changeGame", playerData);
      router.push({
        pathname: `/lobby/${lobbyId}`,
      });
    }
  };

  useEffect(() => {
    if (router.query.lobbyId) {
      if (Array.isArray(router.query.lobbyId))
        return setLobbyId(router.query.lobbyId[0]);
      setLobbyId(router.query.lobbyId);
    }
  }, [router.isReady, router]);

  return (
    <nav className="navContainer">
      <div className="backButtonContainer">
        {lobbyId && (
          <h2 className="backButton">
            <button onClick={backToLobby}>
              <IoIosArrowBack />
            </button>
          </h2>
        )}
      </div>
      <div className="dropdown">
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
              <svg
                className="navIconSVG"
                width="75"
                height="75"
                viewBox="0 0 251 251"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="251" height="251" fill="white" />
                <circle cx="125.5" cy="130.5" r="110.5" fill="white" />
                <ellipse
                  cx="125.5"
                  cy="196.5"
                  rx="69.5"
                  ry="53.5"
                  fill="black"
                />
                <circle cx="125.5" cy="108.5" r="34.5" fill="black" />
                <circle
                  cx="125.5"
                  cy="125.5"
                  r="115.5"
                  stroke="white"
                  stroke-width="20"
                />
                <path
                  d="M119.276 193.647V192.741C119.293 189.634 119.569 187.157 120.101 185.311C120.652 183.464 121.451 181.973 122.498 180.836C123.546 179.7 124.806 178.67 126.28 177.747C127.381 177.037 128.366 176.3 129.237 175.536C130.107 174.773 130.799 173.929 131.314 173.006C131.829 172.065 132.086 171.017 132.086 169.863C132.086 168.638 131.793 167.564 131.207 166.641C130.621 165.717 129.831 165.007 128.837 164.51C127.86 164.013 126.777 163.764 125.588 163.764C124.434 163.764 123.342 164.022 122.312 164.537C121.282 165.034 120.439 165.779 119.782 166.774C119.125 167.75 118.77 168.967 118.716 170.423H107.85C107.939 166.871 108.791 163.942 110.407 161.634C112.022 159.308 114.162 157.576 116.825 156.44C119.489 155.286 122.427 154.709 125.641 154.709C129.174 154.709 132.299 155.295 135.016 156.467C137.733 157.621 139.863 159.299 141.408 161.5C142.953 163.702 143.725 166.357 143.725 169.464C143.725 171.541 143.379 173.388 142.686 175.004C142.012 176.602 141.062 178.022 139.837 179.265C138.612 180.49 137.164 181.6 135.495 182.594C134.093 183.429 132.939 184.299 132.033 185.204C131.145 186.11 130.479 187.157 130.036 188.347C129.609 189.537 129.387 191.001 129.37 192.741V193.647H119.276ZM124.549 210.692C122.773 210.692 121.255 210.071 119.995 208.828C118.752 207.567 118.139 206.058 118.157 204.3C118.139 202.56 118.752 201.069 119.995 199.826C121.255 198.583 122.773 197.962 124.549 197.962C126.236 197.962 127.718 198.583 128.997 199.826C130.275 201.069 130.923 202.56 130.941 204.3C130.923 205.472 130.613 206.547 130.009 207.523C129.423 208.482 128.651 209.254 127.692 209.84C126.733 210.408 125.685 210.692 124.549 210.692Z"
                  fill="white"
                />
              </svg>
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
