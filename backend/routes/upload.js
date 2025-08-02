// File: backend/routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { supabase } = require("../config/database");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Setup multer untuk memory storage (tidak save ke disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Helper function untuk generate unique filename
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e9);
  const extension = path.extname(originalName);
  return `image-${timestamp}-${random}${extension}`;
};

// Helper function untuk upload ke Supabase Storage
const uploadToSupabase = async (file, filename) => {
  try {
    const { data, error } = await supabase.storage.from("article-images").upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("article-images").getPublicUrl(filename);

    return {
      path: data.path,
      publicUrl: publicUrl,
      fullPath: data.fullPath,
    };
  } catch (error) {
    console.error("Upload to Supabase error:", error);
    throw error;
  }
};

// POST /api/upload/image - Upload single image
router.post("/image", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    console.log("File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const filename = generateFileName(req.file.originalname);
    console.log("Generated filename:", filename);

    const uploadResult = await uploadToSupabase(req.file, filename);
    console.log("Upload result:", uploadResult);

    res.json({
      success: true,
      data: {
        url: uploadResult.publicUrl,
        filename: filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: uploadResult.path,
      },
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/upload/images - Upload multiple images
router.post("/images", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files uploaded",
      });
    }

    console.log("Files received:", req.files.length);

    const uploadPromises = req.files.map(async (file) => {
      const filename = generateFileName(file.originalname);
      const uploadResult = await uploadToSupabase(file, filename);

      return {
        url: uploadResult.publicUrl,
        filename: filename,
        originalName: file.originalname,
        size: file.size,
        path: uploadResult.path,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);
    console.log("All uploads completed:", uploadedImages.length);

    res.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} images uploaded successfully`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE /api/upload/image/:filename - Delete image from Supabase
router.delete("/image/:filename", authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    console.log("Deleting file:", filename);

    const { data, error } = await supabase.storage.from("article-images").remove([filename]);

    if (error) {
      console.error("Supabase delete error:", error);
      return res.status(500).json({
        success: false,
        message: `Delete failed: ${error.message}`,
      });
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
      data: data,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/upload/test - Test Supabase connection
router.get("/test", async (req, res) => {
  try {
    // Test bucket access
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
      throw new Error(`Bucket access error: ${bucketError.message}`);
    }

    // Test article-images bucket specifically
    const { data: files, error: filesError } = await supabase.storage.from("article-images").list("", { limit: 5 });

    const articleImagesBucket = buckets.find((bucket) => bucket.name === "article-images");

    res.json({
      success: true,
      data: {
        bucketsCount: buckets.length,
        articleImagesBucket: articleImagesBucket ? "Found" : "Not Found",
        buckets: buckets.map((b) => ({ name: b.name, public: b.public })),
        filesCount: files ? files.length : 0,
        recentFiles: files ? files.slice(0, 3).map((f) => f.name) : [],
        sampleUrl: files && files.length > 0 ? supabase.storage.from("article-images").getPublicUrl(files[0].name).data.publicUrl : null,
        baseUrl: process.env.SUPABASE_STORAGE_URL,
      },
    });
  } catch (error) {
    console.error("Test error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
