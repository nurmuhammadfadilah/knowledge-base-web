// File: backend/server.js - UPDATE BAGIAN INI
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ TAMBAHKAN TRUST PROXY UNTUK IP DETECTION
app.set("trust proxy", true);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Troubleshooting KB API is running!",
    timestamp: new Date(),
    version: "1.0.0",
  });
});

// Import dan gunakan routes
try {
  const articleRoutes = require("./routes/articles");
  app.use("/api/articles", articleRoutes);
  console.log("✅ Article routes loaded");
} catch (error) {
  console.error("❌ Error loading article routes:", error.message);
}

try {
  const categoryRoutes = require("./routes/categories");
  app.use("/api/categories", categoryRoutes);
  console.log("✅ Category routes loaded");
} catch (error) {
  console.error("❌ Error loading category routes:", error.message);
}

// ✅ FIX RATING ROUTES - MOUNT DI /api BUKAN /api/ratings
try {
  const ratingRoutes = require("./routes/ratings");
  app.use("/api", ratingRoutes); // UBAH INI
  console.log("✅ Rating routes loaded");
} catch (error) {
  console.error("❌ Error loading rating routes:", error.message);
}

try {
  const authRoutes = require("./routes/auth");
  app.use("/api/auth", authRoutes);
  console.log("✅ Auth routes loaded");
} catch (error) {
  console.error("❌ Error loading auth routes:", error.message);
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
});
