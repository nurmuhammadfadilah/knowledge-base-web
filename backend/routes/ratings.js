// // File: backend/routes/ratings.js
// const express = require("express");
// const router = express.Router();
// const ratingController = require("../controllers/ratingController");
// const { authenticateToken, optionalAuth } = require("../middleware/auth");

// // Submit atau update rating (requires auth)
// router.post("/articles/:articleId/ratings", authenticateToken, ratingController.submitRating);

// // Get ratings untuk artikel (public)
// router.get("/articles/:articleId/ratings", ratingController.getArticleRatings);

// // Get user's rating untuk artikel (optional auth)
// router.get("/articles/:articleId/ratings/me", optionalAuth, ratingController.getUserRating);

// // Delete rating (requires auth)
// router.delete("/articles/:articleId/ratings", authenticateToken, ratingController.deleteRating);

// module.exports = router;
// File: backend/routes/ratings.js
const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const rateLimit = require("express-rate-limit");

// Rate limiting for rating submissions
const ratingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 rating requests per windowMs
  message: {
    success: false,
    message: "Too many rating attempts, please try again later",
  },
});

// Submit rating
router.post("/articles/:article_id/rating", ratingLimiter, ratingController.submitRating);

// Get ratings for article
router.get("/articles/:article_id/ratings", ratingController.getArticleRatings);

// Get user's rating for article
router.get("/articles/:article_id/user-rating", ratingController.getUserRating);

module.exports = router;
