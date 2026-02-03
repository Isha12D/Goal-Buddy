import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((error) => {
      console.error("Mongo Error ❌", error);
      process.exit(1);
    });
};

export default connectDB;
