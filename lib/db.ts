import mongoose from "mongoose";

const options = {
  bufferCommands: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 60000,
  retryWrites: true,
  retryReads: true,
};

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) {
    return mongoose;
  }

  const MONGODB_URL = process.env.MONGODB_URL;
  
  if (!MONGODB_URL) {
    throw new Error("Please define MONGODB_URL in .env file");
  }

  try {
    await mongoose.connect(MONGODB_URL, options);
    
    mongoose.connection.on("connected", () => {
      isConnected = true;
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

    isConnected = true;
    return mongoose;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}