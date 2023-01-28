import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import React, { useEffect, useState } from "react";
import AvatarCustomizer from "./AvatarCustomizer";
import { parseCookies } from "nookies";
import { socket } from "../pages/_app";
import { useAppContext } from "../context";
import { useRouter } from "next/router";
import emotions from "../utils/avatarEmotions.js";

const Avatar = ({ userName, playerId, playerAvatar }) => {
  const cookies = parseCookies();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [currGameId, setCurrGameId] = useState(false);
  const { storeData, setStoreData } = useAppContext();
  const avatarOptions = {
    seed: userName,
    ...playerAvatar,
  };

  const handleSetAvatarOptions = (value, key) => {
    const newOptions = { ...avatarOptions };
    newOptions[key] = [value];
    storeAvatarSettings(newOptions);
  };

  const handlEemotions = (emotions) => {
    const newOptions = { ...avatarOptions, ...emotions };

    storeAvatarSettings(newOptions);
  };

  const storeAvatarSettings = (options) => {
    // if in runnning game, also update Game object
    if (currGameId) {
      socket.emit("changeGame", {
        lobbyId: storeData.lobbyId,
        gameId: storeData.lobbyId,
        playerId: playerId,
        avatar: options,
        changeAvatar: true,
      });
      return;
    }
    socket.emit("updateLobby", {
      lobbyId: storeData.lobbyId,
      id: playerId,
      avatar: options,
    });
  };

  //create avatar based on options
  const AvatarSVG = ({ avatarOptions }) => {
    const avatar = createAvatar(avataaars, { ...avatarOptions });
    const svg = avatar.toString();

    return (
      <div
        onClick={() => playerId === cookies.socketId && setShowSettings(true)}
        className={"avatar-image"}
        style={
          playerId === cookies.socketId
            ? { cursor: "pointer", border: "2px solid gold" }
            : null
        }
        dangerouslySetInnerHTML={{ __html: svg }}
      ></div>
    );
  };

  useEffect(() => {
    storeAvatarSettings(avatarOptions);
  }, []);

  useEffect(() => {
    if (router.query.gameId) return setCurrGameId(router.query.gameId);
    setCurrGameId(false);
  }, [router.isReady]);

  return (
    <div>
      <AvatarSVG avatarOptions={avatarOptions} />
      {showSettings && (
        <>
          <AvatarCustomizer
            handleSetAvatarOptions={handleSetAvatarOptions}
            setShowSettings={setShowSettings}
          >
            <div className="avatar-preview">
              <AvatarSVG avatarOptions={avatarOptions} />
              <div>
                <h3>EMOTIONS</h3>
                <ul>
                  {emotions &&
                    emotions.map((emotion) => (
                      <li>
                        <button
                          style={{ textTransform: "uppercase" }}
                          onClick={() => handlEemotions(emotion.settings)}
                        >
                          {emotion.label}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </AvatarCustomizer>
        </>
      )}
    </div>
  );
};
export default Avatar;
