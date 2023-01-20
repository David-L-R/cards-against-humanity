import React from "react";
import { avataaars } from "@dicebear/collection";
const AvatarCustomizer = ({ handleSetAvatarOptions }) => {
  const avaProps = avataaars.schema.properties;
  console.log("avaProps", avaProps);
  return (
    <>
      {
        <ul className="avata-settings">
          {Object.entries(avaProps)
            .filter(
              (entry) =>
                entry[1].type !== "integer" &&
                entry[1].description != "@deprecated"
            )
            .map((entry, index) => {
              console.log("entry", entry);
              console.log("index", index);
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
                            {option}
                          </option>
                        );
                      })}
                  </select>
                </li>
              );
            })}
        </ul>
      }
    </>
  );
};
export default AvatarCustomizer;
