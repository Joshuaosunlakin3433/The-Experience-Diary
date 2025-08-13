import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connection event listeners
    mongoose.connection.on("connected", () => {
      console.log("✅ Database connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("❌ Database connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Database disconnected");
    });

    // Connect using environment variable
    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
    // Exit process with failure if can't connect to database
    process.exit(1);
  }
};

export default connectDB;