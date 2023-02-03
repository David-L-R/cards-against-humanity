import React from "react";
import { CgCloseO } from "react-icons/cg";
import WhiteCard from "./WhiteCard";

function Profile({ showProfileMenu, setShowProfileMenu }) {
  if (!showProfileMenu) return;
  return (
    <div className="gameRulesBackdrop">
      <div className="gameRules">
        <h1>Profile</h1>
        <button onClick={() => setShowProfileMenu(false)}>
          <CgCloseO className="closeMenuButton" />
        </button>

        <h2>Choose Your Card background</h2>
        <div className="profileCardsContainer">
          <div className="whiteCardFaceMock whiteCardFace--frontMock">
            <img src="/Cardbackground.svg" alt="" className="logoCardMock" />
          </div>
          <div className="whiteCardFaceMock">
            <h2>Man Makes Monster.</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
