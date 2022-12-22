import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../database/models/user.js";
import asyncHandler from "express-async-handler";

// @desc Register new user
// @route Post/api/user/register
// @access Puplic
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //check received credentials
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await User.create({
    name: name,
    password: hashedPassword,
    email: email,
  });

  if (!user) {
    throw new Error("Invalid user data");
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc get user data
// @route Post/api/user/login
// @access Puplic
export const loginUser = asyncHandler(async (req, res) => {
  //If user used token, login in directly
  const usedToken = req.user && req.user;
  if (usedToken) {
    return res.status(200).json({
      _id: usedToken._id,
      name: usedToken.name,
      email: usedToken.email,
    });
  }

  const { email, password } = req.body;

  if (!email || !password) throw new Error("Please add all credentials");

  //Check for user email
  const user = await User.findOne({ email });

  //check password
  const checkedPassword = await bcrypt.compare(password, user?.password);

  if ((user && !checkedPassword) || !user) {
    throw new Error("Invalid credentials");
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
