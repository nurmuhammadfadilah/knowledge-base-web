const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const rateLimit = require("express-rate-limit");

const ratingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many rating attempts, please try again later",
  },
});

// Submit rating
router.post("/articles/:article_id/rating", ratingLimiter, ratingController.submitRating);

// Get
router.get("/articles/:article_id/ratings", ratingController.getArticleRatings);

// Get user
router.get("/articles/:article_id/user-rating", ratingController.getUserRating);

module.exports = router;
