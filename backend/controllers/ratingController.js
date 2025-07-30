// File: backend/controllers/ratingController.js
const pool = require("../config/database");

const ratingController = {
  // Submit rating
  submitRating: async (req, res) => {
    try {
      const { article_id } = req.params;
      const { rating, feedback } = req.body;

      // Get user IP with better detection
      const user_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : "127.0.0.1");

      console.log("Rating submission:", { article_id, rating, feedback, user_ip });

      // Validation
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      // Check if article exists
      const articleCheck = await pool.query("SELECT id FROM articles WHERE id = $1", [article_id]);

      if (articleCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }

      // Insert or update rating
      const result = await pool.query(
        `
        INSERT INTO ratings (article_id, user_ip, rating, feedback)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (article_id, user_ip)
        DO UPDATE SET 
          rating = EXCLUDED.rating,
          feedback = EXCLUDED.feedback,
          created_at = CURRENT_TIMESTAMP
        RETURNING *
      `,
        [article_id, user_ip, rating, feedback || null]
      );

      // Update article average rating
      await updateArticleAverageRating(article_id);

      res.json({
        success: true,
        message: "Rating submitted successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Get ratings for article
  getArticleRatings: async (req, res) => {
    try {
      const { article_id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      console.log("Getting ratings for article:", article_id);

      // Get ratings with pagination
      const result = await pool.query(
        `
        SELECT 
          id,
          rating,
          feedback,
          created_at,
          SUBSTRING(user_ip, 1, 3) || '.*.*.*' as masked_ip
        FROM ratings 
        WHERE article_id = $1 
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `,
        [article_id, limit, offset]
      );

      // Get total count
      const countResult = await pool.query("SELECT COUNT(*) FROM ratings WHERE article_id = $1", [article_id]);

      // Get rating distribution
      const distributionResult = await pool.query(
        `
        SELECT 
          rating,
          COUNT(*) as count
        FROM ratings 
        WHERE article_id = $1 
        GROUP BY rating
        ORDER BY rating DESC
      `,
        [article_id]
      );

      res.json({
        success: true,
        data: {
          ratings: result.rows,
          total: parseInt(countResult.rows[0].count),
          distribution: distributionResult.rows,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(countResult.rows[0].count / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting ratings:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Get user's rating for article
  getUserRating: async (req, res) => {
    try {
      const { article_id } = req.params;
      const user_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : "127.0.0.1");

      console.log("Getting user rating for article:", article_id, "IP:", user_ip);

      const result = await pool.query("SELECT rating, feedback FROM ratings WHERE article_id = $1 AND user_ip = $2", [article_id, user_ip]);

      res.json({
        success: true,
        data: result.rows[0] || null,
      });
    } catch (error) {
      console.error("Error getting user rating:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

// Helper function to update article average rating
async function updateArticleAverageRating(articleId) {
  try {
    const result = await pool.query(
      `
      UPDATE articles 
      SET 
        average_rating = (
          SELECT ROUND(AVG(rating)::numeric, 2) 
          FROM ratings 
          WHERE article_id = $1
        ),
        total_ratings = (
          SELECT COUNT(*) 
          FROM ratings 
          WHERE article_id = $1
        )
      WHERE id = $1
    `,
      [articleId]
    );

    console.log("Updated article rating for article:", articleId);
  } catch (error) {
    console.error("Error updating article average rating:", error);
  }
}

module.exports = ratingController;
