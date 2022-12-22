import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

export default User;
