// File: backend/routes/categories.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { body, validationResult } = require("express-validator");

// GET /api/categories - Get all categories
router.get("/", async (req, res) => {
  try {
    const result = await Category.getAll();

    if (!result.success) {
      return res.status(500).json({ message: result.error });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categories/:id - Get single category
router.get("/:id", async (req, res) => {
  try {
    const result = await Category.getById(req.params.id);

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

// POST /api/categories - Create new category (Admin only)
router.post("/", [body("name").isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters"), body("description").optional().isLength({ max: 500 })], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await Category.create(req.body);

    if (!result.success) {
      return res.status(500).json({ message: result.error });
    }

    res.status(201).json({
      success: true,
      data: result.data,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
