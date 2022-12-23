import mongoose from "mongoose";

const connectDB = async () => {
  const green = "\x1b[32m";

  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(green, `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error : ", error);
    process.exit(1);
  }
};

export default connectDB;
