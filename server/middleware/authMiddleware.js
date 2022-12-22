import jwt from "jsonwebtoken";
import User from "../database/models/user.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from Bearer
      token = req.headers.authorization.split(" ")[1];
      console.log("token", token);
      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      req.user = null;
    }
  }
});
