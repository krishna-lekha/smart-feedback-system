const express = require("express");
const axios = require("axios");
const router = express.Router();
const Feedback = require("../models/Feedback");
const fetchFacebookComments = require("../fetchFacebookComments"); // ✅ Adjust if needed

// ✅ Route: Fetch and store Facebook comments
router.get("/fetch-facebook", async (req, res) => {
  try {
    const result = await fetchFacebookComments();

    res.status(200).json({
      success: true,
      message: "✅ Facebook comments fetched and stored.",
      count: result?.count || 0,
    });
  } catch (error) {
    console.error("❌ Error fetching Facebook comments:", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Error fetching Facebook comments.",
      error: error.message,
    });
  }
});

// ✅ Route: Reply to a Facebook comment using commentId
router.post("/reply", async (req, res) => {
  const { commentId, replyText } = req.body;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!commentId || !replyText || !accessToken) {
    return res.status(400).json({ 
      success: false, 
      error: "❌ Missing required fields: commentId, replyText, or accessToken." 
    });
  }

  try {
    // ✅ Reply to Facebook comment
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${commentId}/comments`,
      null,
      {
        params: {
          message: replyText,
          access_token: accessToken,
        },
      }
    );

    // ✅ Mark feedback as replied
    await Feedback.findOneAndUpdate(
      { commentId },
      {
        repliedOnFacebook: true,
        facebookReplyTime: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: `✅ Reply posted successfully to comment ${commentId}.`,
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Reply failed:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "❌ Failed to reply to Facebook comment.",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
