import React from "react";

const Error = ({ showErrMessage, setShowErrMessage }) => {
  return (
    <div className="errorBox">
      <div
        className="errMessage"
        onClose={setTimeout(() => setShowErrMessage(false), 5000)}>
        {showErrMessage.length <= 0 ? "Something went wrong!" : showErrMessage}
      </div>
    </div>
  );
};

export default Error;
