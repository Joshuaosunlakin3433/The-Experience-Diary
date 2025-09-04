import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();

await connectDB();

//middleware
app.use(cors());
app.use(express.json());

// Add a root route - this fixes the "Cannot GET /" error
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blog API Server is running successfully! 🚀",
    version: "1.0.0",
    endpoints: {
      admin: "/api/admin",
      blog: "/api/blog"
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route (useful for monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
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
      blog: "/api/blog"
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

export default app;