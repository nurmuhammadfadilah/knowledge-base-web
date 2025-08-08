const { supabase } = require("../config/database");

const ratingController = {
  submitRating: async (req, res) => {
    try {
      const { article_id } = req.params;
      const { rating, feedback } = req.body;

      const user_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : "127.0.0.1");

      console.log("Rating submission:", { article_id, rating, feedback, user_ip });

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      const { data: articleData, error: articleError } = await supabase.from("articles").select("id").eq("id", article_id).maybeSingle();

      if (articleError || !articleData) {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }
      const { data: existingRating, error: checkError } = await supabase.from("ratings").select("*").eq("article_id", article_id).eq("user_ip", user_ip).maybeSingle();

      if (checkError) throw checkError;

      let result;

      if (existingRating) {
        const { data, error } = await supabase
          .from("ratings")
          .update({
            rating,
            feedback,
            created_at: new Date().toISOString(),
          })
          .eq("id", existingRating.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("ratings")
          .insert({
            article_id,
            user_ip,
            rating,
            feedback,
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      await updateArticleAverageRating(article_id);

      res.json({
        success: true,
        message: "Rating submitted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error submitting rating:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getArticleRatings: async (req, res) => {
    try {
      const { article_id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: ratings, error } = await supabase.from("ratings").select("id, rating, feedback, created_at, user_ip").eq("article_id", article_id).order("created_at", { ascending: false }).range(from, to);

      if (error) throw error;

      const maskedRatings = ratings.map((r) => ({
        ...r,
        masked_ip: r.user_ip ? r.user_ip.substring(0, 3) + ".*.*.*" : "xxx.*.*.*",
      }));

      const { count: total, error: countError } = await supabase.from("ratings").select("*", { count: "exact", head: true }).eq("article_id", article_id);

      if (countError) throw countError;

      const { data: distributionData, error: distError } = await supabase.from("ratings").select("rating, count:rating").eq("article_id", article_id).group("rating");

      if (distError) throw distError;

      res.json({
        success: true,
        data: {
          ratings: maskedRatings,
          total,
          distribution: distributionData,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting ratings:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getUserRating: async (req, res) => {
    try {
      const { article_id } = req.params;
      const user_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : "127.0.0.1");

      console.log("Getting user rating for article:", article_id, "IP:", user_ip);

      const { data, error } = await supabase.from("ratings").select("rating, feedback").eq("article_id", article_id).eq("user_ip", user_ip).maybeSingle();

      if (error) throw error;

      res.json({
        success: true,
        data: data || null,
      });
    } catch (error) {
      console.error("Error getting user rating:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

async function updateArticleAverageRating(articleId) {
  try {
    const { data: ratings, error } = await supabase.from("ratings").select("rating").eq("article_id", articleId);

    if (error) throw error;

    const values = ratings.map((r) => r.rating);
    const average = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;

    const { error: updateError } = await supabase
      .from("articles")
      .update({
        average_rating: average,
        total_ratings: values.length,
      })
      .eq("id", articleId);

    if (updateError) throw updateError;

    console.log("Updated article average rating for article:", articleId);
  } catch (error) {
    console.error("Error updating article average rating:", error.message);
  }
}

module.exports = ratingController;
