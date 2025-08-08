const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const authMiddleware = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// GET
router.get("/", async (req, res) => {
  try {
    const result = await Category.getAll();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.data.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ID
router.get("/:id", async (req, res) => {
  try {
    const result = await Category.getById(req.params.id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST
router.post(
  "/",
  authMiddleware,
  [body("name").isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters").trim(), body("description").optional().isLength({ max: 500 }).withMessage("Description must be less than 500 characters").trim()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const existingCategories = await Category.getAll();
      if (existingCategories.success) {
        const nameExists = existingCategories.data.some((cat) => cat.name.toLowerCase() === req.body.name.toLowerCase());

        if (nameExists) {
          return res.status(400).json({
            success: false,
            message: "Category name already exists",
          });
        }
      }

      const result = await Category.create(req.body);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error,
        });
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: "Category created successfully",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// PUT
router.put(
  "/:id",
  authMiddleware,
  [body("name").isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters").trim(), body("description").optional().isLength({ max: 500 }).withMessage("Description must be less than 500 characters").trim()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const categoryExists = await Category.getById(req.params.id);
      if (!categoryExists.success) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      const existingCategories = await Category.getAll();
      if (existingCategories.success) {
        const nameExists = existingCategories.data.some((cat) => cat.name.toLowerCase() === req.body.name.toLowerCase() && cat.id !== parseInt(req.params.id));

        if (nameExists) {
          return res.status(400).json({
            success: false,
            message: "Category name already exists",
          });
        }
      }

      const result = await Category.update(req.params.id, req.body);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error,
        });
      }

      res.json({
        success: true,
        data: result.data,
        message: "Category updated successfully",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const categoryExists = await Category.getById(req.params.id);
    if (!categoryExists.success) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const result = await Category.delete(req.params.id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
