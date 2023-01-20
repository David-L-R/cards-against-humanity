import React from "react";
import { avataaars } from "@dicebear/collection";
import { CgCloseO } from "react-icons/Cg";

const AvatarCustomizer = ({
  handleSetAvatarOptions,
  setShowSettings,
  children,
}) => {
  const avaProps = avataaars.schema.properties;

  let hexColors = {
    "262e33": "dark navy blue",
    "65c9ff": "sky blue",
    "5199e4": "blue",
    "25557c": "dark blue",
    e6e6e6: "light gray",
    929598: "gray",
    "3c4f5c": "dark gray",
    b1e2ff: "light blue",
    a7ffc4: "mint green",
    ffdeb5: "peach",
    ffafb9: "pink",
    ffffb1: "yellow",
    ff488e: "red",
    ff5c5c: "light red",
    ffffff: "white",
    a55728: "brown",
    "2c1b18": "dark brown",
    b58143: "light brown",
    d6b370: "beige",
    724133: "dark beige",
    "4a312c": "medium brown",
    f59797: "light red",
    ecdcbf: "light beige",
    c93305: "dark orange",
    e8e1e1: "light gray",
    614335: "dark taupe",
    d08b5b: "medium taupe",
    ae5d29: "medium brown",
    edb98a: "light beige",
    ffdbb4: "peach",
    fd9841: "dark orange",
    f8d25c: "light orange",
  };

  return (
    <>
      {
        <div className="settings-wrapper">
          {children}
          <ul className="avata-settings">
            {Object.entries(avaProps)
              .filter(
                (entry) =>
                  entry[1].type !== "integer" &&
                  entry[1].description != "@deprecated" &&
                  entry[1].default.length > 1
              )
              .map((entry, index) => {
                const optionList = entry[1].default;
                // ? entry[1].items.enum
                // : entry[1].enum;
                const title = entry[0];
                const value = entry[1].items;
                return (
                  <li>
                    <h3>{title}</h3>
                    <select
                      onChange={(e) =>
                        handleSetAvatarOptions(e.target.value, entry[0])
                      }>
                      {optionList &&
                        optionList.map((option) => {
                          return (
                            <option propertie={entry[0]} value={option}>
                              {title.toLocaleLowerCase().includes("color")
                                ? hexColors[option]
                                : option}
                            </option>
                          );
                        })}
                    </select>
                  </li>
                );
              })}
          </ul>
          <button onClick={() => setShowSettings(false)}>
            <CgCloseO />
          </button>
        </div>
      }
    </>
  );
};
export default AvatarCustomizer;
