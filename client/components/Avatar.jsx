import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-avataaars-sprites";
import React from "react";
import parse from "html-react-parser";
import AvatarCustomizer from "./AvatarCustomizer";
import { useState } from "react";

const Avatar = ({ UserName, savedAvatar }) => {
  const [avatarOptions, setAvatarOptions] = useState({
    seed: UserName,
  });

  const handleSetAvatarOptions = (value, key) => {
    setAvatarOptions((prev) => {
      const newOptions = { ...prev };
      newOptions[key] = [value];
      return newOptions;
    });
  };

  //create avatar based on options
  function GetAvatar({ avatarOptions, savedAvatar }) {
    let Ava = createAvatar(style, { ...avatarOptions });
    return <div dangerouslySetInnerHTML={{ __html: Ava }}></div>;
    //return parse(savedAvatar ? savedAvatar : Ava);
  }
  return (
    <div className="avatar-image">
      <GetAvatar avatarOptions={avatarOptions} savedAvatar={savedAvatar} />
      <AvatarCustomizer handleSetAvatarOptions={handleSetAvatarOptions} />
    </div>
  );
};
export default Avatar;
