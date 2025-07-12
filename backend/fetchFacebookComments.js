const axios = require('axios');
const Feedback = require('./models/Feedback'); // adjust path if needed

const PAGE_ID = '723630647494467';
const PAGE_ACCESS_TOKEN = 'EAAUEuT5yOTEBO57K2KY4ZBqsZApvZBP7U6AfWYej7v5iftaOkRhmNZCS9WYNvWJXpG5AsmtWrIl2Ls5cESEwcNZBsKGp1Xj1Nb8TvNAO8ZB0UT1qfBphGxkV7gfSGMjxqBQU3ZAc9I3GujKN2IvyC3bs8Jll8FBtZCQYukO8FcJeBgcSmEPqLUgwgCDjTCbXgF5ZANG2PHRqs';

async function fetchAndStoreFacebookComments() {
  let count=0;
  try {
    // Get all posts
    const postsRes = await axios.get(`https://graph.facebook.com/v19.0/${PAGE_ID}/posts?access_token=${PAGE_ACCESS_TOKEN}`);
    const posts = postsRes.data.data;

    for (const post of posts) {
      // Get comments for each post
      const commentsRes = await axios.get(`https://graph.facebook.com/v19.0/${post.id}/comments?access_token=${PAGE_ACCESS_TOKEN}`);
      const comments = commentsRes.data.data;

      for (const comment of comments) {
        const exists = await Feedback.findOne({ description: comment.message });

        if (!exists) {
          const newFeedback = new Feedback({
            name: comment.from?.name || 'Facebook User (Private Profile) ',
            email: comment.from?.id
                ? `${comment.from.id}@facebookuser.com`
                : 'anonymous@facebookuser.com',
            description: comment.message,
            commentId: comment.id,
            category: 'Other',
            source: 'facebook',
          });

          await newFeedback.save();
          count++;
        }
      }
    }

    console.log(`✅ Facebook comments saved to DB. Total saved: ${count}`);
    return { success: true, count };
  } catch (err) {
    console.trace("🔍 Trace:");
    console.error('❌ Error fetching Facebook comments:', err.message);
  }
}

module.exports = fetchAndStoreFacebookComments;
