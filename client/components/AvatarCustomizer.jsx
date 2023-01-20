import React from "react";
import { avataaars } from "@dicebear/collection";
import { CgCloseO } from "react-icons/Cg";
import hexColors from "../utils/hexCodes";

const AvatarCustomizer = ({
  handleSetAvatarOptions,
  setShowSettings,
  children,
}) => {
  const avaProps = avataaars.schema.properties;

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
