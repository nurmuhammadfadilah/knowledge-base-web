// File: backend/routes/articles.js
const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const authMiddleware = require("../middleware/auth");
const { body, validationResult, query } = require("express-validator");

// GET /api/articles - Get all articles with filtering
router.get("/", [query("category_id").optional().isInt(), query("search").optional().isLength({ min: 1, max: 100 }), query("limit").optional().isInt({ min: 1, max: 50 })], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filters = {
      category_id: req.query.category_id,
      search: req.query.search,
      limit: req.query.limit || 20,
    };

    const result = await Article.getAll(filters);

    if (!result.success) {
      return res.status(500).json({ message: result.error });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.data.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/articles/:id - Get single article
router.get("/:id", async (req, res) => {
  try {
    const result = await Article.getById(req.params.id);

    if (!result.success) {
      return res.status(404).json({ message: result.error });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/articles - Create new article (Admin only - akan ditambah auth nanti)
router.post(
  "/",
  authMiddleware,
  [
    body("title").isLength({ min: 5, max: 255 }).withMessage("Title must be 5-255 characters"),
    body("content").isLength({ min: 20 }).withMessage("Content must be at least 20 characters"),
    body("category_id").isInt().withMessage("Category ID must be a number"),
    body("tags").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await Article.create(req.body);

      if (!result.success) {
        return res.status(500).json({ message: result.error });
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: "Article created successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// PUT /api/articles/:id - Update article (Admin only)
router.put("/:id", authMiddleware, [body("title").isLength({ min: 5, max: 255 }), body("content").isLength({ min: 20 }), body("category_id").isInt(), body("tags").optional().isArray()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await Article.update(req.params.id, req.body);

    if (!result.success) {
      return res.status(404).json({ message: result.error });
    }

    res.json({
      success: true,
      data: result.data,
      message: "Article updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/articles/:id - Delete article (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await Article.delete(req.params.id);

    if (!result.success) {
      return res.status(404).json({ message: result.error });
    }

    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
