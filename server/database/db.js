import mongoose from "mongoose";

const connectDB = async () => {
  const yellow = "\x1b[33m%s\x1b[0m";
  const red = "\x1b[31m";

  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(yellow, `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(red, "Database connection error : ", error);
    process.exit(1);
  }
};

export default connectDB;
