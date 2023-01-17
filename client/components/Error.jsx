import React from "react";

const Error = ({ showErrMessage, setShowErrMessage }) => {
  setTimeout(() => setShowErrMessage(false), 5000);

  return (
    <div className="errMessage">
      {showErrMessage.length <= 0 ? "Something went wrong!" : showErrMessage}
    </div>
  );
};

export default Error;
