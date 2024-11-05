import mongoose from "mongoose";
import { config } from "./config.js";
import winstonLogger from "../utils/winston.util.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    winstonLogger.info("Connected to MongoDB");
  } catch (error) {
    winstonLogger.fatal(`MongoDB connection error: ${error.message}`);
  }
};
