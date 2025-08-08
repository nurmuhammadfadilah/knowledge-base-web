const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Upload Image
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("✅ Static files middleware configured for /uploads");

// Check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Troubleshooting KB API is running!",
    timestamp: new Date(),
    version: "1.0.0",
  });
});

// Upload Route
try {
  const uploadRoutes = require("./routes/upload");
  app.use("/api/upload", uploadRoutes);
  console.log("✅ Upload routes loaded");
} catch (error) {
  console.error("❌ Error loading upload routes:", error.message);
}

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

// Rating
try {
  const ratingRoutes = require("./routes/ratings");
  app.use("/api", ratingRoutes);
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

// Test
app.get("/api/test-upload", (req, res) => {
  const fs = require("fs");
  const uploadDir = path.join(__dirname, "uploads", "images");

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      return res.json({
        message: "Upload directory created",
        path: uploadDir,
      });
    }

    const files = fs.readdirSync(uploadDir);
    res.json({
      message: "Upload directory exists",
      path: uploadDir,
      files: files,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking upload directory",
      error: error.message,
    });
  }
});

// Error handling
app.use("*", (req, res) => {
  res.status(404).json({ message: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error("Error Stack:", err.stack);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File too large. Maximum size is 5MB.",
      error: "FILE_TOO_LARGE",
    });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      message: "Too many files. Maximum 5 files allowed.",
      error: "TOO_MANY_FILES",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      message: "Unexpected field in file upload.",
      error: "UNEXPECTED_FIELD",
    });
  }

  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
  console.log(`📁 Upload folder: ${path.join(__dirname, "uploads")}`);
  console.log(`🖼️ Image URL format: http://localhost:${PORT}/uploads/images/filename.jpg`);
  const fs = require("fs");
  const uploadDir = path.join(__dirname, "uploads", "images");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Created uploads/images directory");
  } else {
    console.log("✅ Uploads directory already exists");
  }
});
