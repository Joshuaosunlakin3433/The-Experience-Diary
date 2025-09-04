import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();

// Don't await connectDB at top level for Vercel
// connectDB();

//middleware
app.use(cors());
app.use(express.json());

// Database connection middleware - connects on each request if needed
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log("Database connected");
    } catch (error) {
      console.error("Database connection failed:", error);
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }
  }
  next();
});

// Add a root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blog API Server is running successfully! 🚀",
    version: "1.0.0",
    endpoints: {
      admin: "/api/admin",
      blog: "/api/blog",
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbConnected ? "Connected" : "Not Connected",
  });
});

//Routes
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      root: "/",
      health: "/health",
      admin: "/api/admin",
      blog: "/api/blog",
    },
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;

// Only listen in development (not needed for Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );
}

export default app;
