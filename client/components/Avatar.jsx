import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-avataaars-sprites";
import React from "react";
import parse from "html-react-parser";

const Avatar = ({
  UserName,
  hairStyle,
  baldChance,
  hatColor,
  hairColor,
  accessories,
  accessoriesColor,
  facialHair,
  facialHairChance,
  facialHairColor,
  clothes,
  clothesColor,
  eyes,
  eyebrow,
  mouth,
  skin,
  clotheGraphics,
  savedAvatar,
}) => {
  function GetAvatar() {
    let Ava = createAvatar(style, {
      seed: UserName,
      top: hairStyle && hairStyle,
      topChance: baldChance && baldChance,
      hatColor: hatColor && hatColor,
      hairColor: hairColor && hairColor,
      accessories: accessories && accessories,
      accessoriesColor: accessoriesColor && accessoriesColor,
      facialHair: facialHair && facialHair,
      facialHairChance: facialHairChance && facialHairChance,
      facialHairColor: facialHairColor && facialHairColor,
      clothes: clothes && clothes,
      clothesColor: clothesColor && clothesColor,
      eyes: eyes && eyes,
      eyebrow: eyebrow && eyebrow,
      mouth: mouth && mouth,
      skin: skin && skin,
      clotheGraphics: clotheGraphics && clotheGraphics,

      // ... and other options
    });

    return parse(savedAvatar ? savedAvatar : Ava);
  }

  //   console.log("svg", svg);
  return (
    <div className="avatar-image">
      <GetAvatar />
    </div>
  );
};
export default Avatar;
