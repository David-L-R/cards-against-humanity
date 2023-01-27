import React from "react";

const Error = ({ showErrMessage, setShowErrMessage, success }) => {
  setTimeout(() => setShowErrMessage(false), 5000);

  if (!showErrMessage && !success) return;

  return (
    <div
      className="errMessage"
      style={
        success
          ? { backgroundColor: "rgb(2, 105, 2)" }
          : { backgroundColor: "#eb455f" }
      }>
      {showErrMessage.length <= 0
        ? "Something went wrong!"
        : success
        ? success
        : showErrMessage}
    </div>
  );
};

export default Error;
