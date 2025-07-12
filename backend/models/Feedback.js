const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },

  name: { type: String, required: true }, // ✅ User's name
  email: { type: String, required: true }, // ✅ User's email
  category: {
    type: String,
    enum: ["Credit Card", "Loan", "Transaction", "Mobile Banking", "Other"], // ✅ Feedback category
    required: true
  },

  description: { type: String, required: true },

  image: {
    data: Buffer,
    contentType: String,
  },

  source: {
    type: String,
    enum: ["web", "email", "instagram", "twitter", "whatsapp","facebook"],
    default: "web"
  },
  commentId: { type: String },

  accountId: {
    type: String,
    default: null
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  aiResponse: { type: String, default: null },
  aiResponseSentAt: { type: Date, default: null },
    
  sentiment: { type: String }, 
  sentimentExplanation: { type: String },
  sentimentGeneratedAt: Date,
  responseLength: {
  type: String,
  enum: ["short", "medium", "detailed"],
  default: "medium",
},
contextStyle: {
  type: String,
  enum: ["general", "apologetic", "action-oriented", "informative"],
  default: "general",
},
 repliedOnFacebook: {
  type: Boolean,
  default: false,
},
facebookReplyTime: {
  type: Date,
  default: null,
},
emailSent: {
  type: Boolean,
  default: false,
},
 repliedOnFacebook: { type: Boolean, default: false },
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
