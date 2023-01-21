import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import React, { useEffect, useState } from "react";
import AvatarCustomizer from "./AvatarCustomizer";
import { parseCookies } from "nookies";
import { socket } from "../pages/_app";
import { useAppContext } from "../context";
import { useRouter } from "next/router";

const Avatar = ({ userName, playerId, playerAvatar }) => {
  const cookies = parseCookies();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [currGameId, setCurrGameId] = useState(false);
  const { storeData } = useAppContext();
  const avatarOptions = {
    seed: userName,
    ...playerAvatar,
  };
  const handleSetAvatarOptions = (value, key) => {
    const newOptions = { ...avatarOptions };
    newOptions[key] = [value];
    storeAvatarSettings(newOptions);
  };

  const storeAvatarSettings = (options) => {
    socket.emit("updateLobby", {
      lobbyId: storeData.lobbyId,
      id: cookies.socketId,
      avatar: options,
    });

    // if in runnning game, also update Game object
    if (currGameId) {
      socket.emit("changeGame", {
        lobbyId: storeData.lobbyId,
        gameId: storeData.lobbyId,
        playerId: cookies.socketId,
        avatar: options,
        gameIdentifier: currGameId,
        changeAvatar: true,
      });
    }
  };

  //create avatar based on options
  const AvatarSVG = ({ avatarOptions }) => {
    const avatar = createAvatar(avataaars, { ...avatarOptions });
    const svg = avatar.toString();

    return (
      <div
        onClick={() => playerId === cookies.socketId && setShowSettings(true)}
        className={"avatar-image"}
        style={playerId === cookies.socketId ? { cursor: "pointer" } : null}
        dangerouslySetInnerHTML={{ __html: svg }}></div>
    );
  };

  useEffect(() => {
    if (router.query.gameId) return setCurrGameId(router.query.gameId);
    setCurrGameId(false);
  }, [router.isReady]);

  return (
    <div>
      <AvatarSVG avatarOptions={avatarOptions} />
      {showSettings && (
        <AvatarCustomizer
          handleSetAvatarOptions={handleSetAvatarOptions}
          setShowSettings={setShowSettings}>
          <AvatarSVG avatarOptions={avatarOptions} />
        </AvatarCustomizer>
      )}
    </div>
  );
};
export default Avatar;
