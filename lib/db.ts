import mongoose from "mongoose";

// Connection options
const options = {
  bufferCommands: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 60000,
  retryWrites: true,
  retryReads: true,
};

// Track connection status
let isConnected = false;

export async function connectDatabase() {
  // If already connected, return the existing connection
  if (isConnected) {
    return mongoose;
  }

  // Get MongoDB URL from environment variables
  const MONGODB_URL = process.env.MONGODB_URL;
  
  if (!MONGODB_URL) {
    throw new Error("Please define MONGODB_URL in .env file");
  }

  try {
    // Establish new connection
    await mongoose.connect(MONGODB_URL, options);
    
    // Set up connection event listeners
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