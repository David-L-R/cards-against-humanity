import mongoose from "mongoose";
import consoleSuccess from "../utils/consoleSuccess.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    consoleSuccess(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error : ", error);
    process.exit(1);
  }
};

export default connectDB;
