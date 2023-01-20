import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import React, { useEffect, useState } from "react";
import AvatarCustomizer from "./AvatarCustomizer";
import { parseCookies, setCookie } from "nookies";

const Avatar = ({ userName }) => {
  const cookies = parseCookies();

  const [avatarOptions, setAvatarOptions] = useState({
    seed: userName,
  });

  const handleSetAvatarOptions = (value, key) => {
    setAvatarOptions((prev) => {
      const newOptions = { ...prev };
      newOptions[key] = [value];
      return newOptions;
    });
  };

  //create avatar based on options
  const AvatarSVG = ({ avatarOptions }) => {
    const avatar = createAvatar(avataaars, { ...avatarOptions });
    const svg = avatar.toString();

    //store avatar in cookie
    setCookie(null, "avatar", JSON.stringify(avatarOptions), { path: "/" });

    return (
      <div className="avatar" dangerouslySetInnerHTML={{ __html: svg }}></div>
    );
  };

  useEffect(() => {
    setAvatarOptions((prev) => ({ ...prev, seed: userName }));
  }, [userName]);

  useEffect(() => {
    if (cookies.avatar) setAvatarOptions((prev) => JSON.parse(cookies.avatar));
  }, []);

  return (
    <div>
      <AvatarSVG avatarOptions={avatarOptions} />
      <AvatarCustomizer handleSetAvatarOptions={handleSetAvatarOptions} />
    </div>
  );
};
export default Avatar;
