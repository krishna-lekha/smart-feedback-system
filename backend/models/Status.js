const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true },
  status: { type: String, enum: ['Yet to Begin', 'In Progress', 'Resolved'], default: 'Yet to Begin' },
  updatedAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Status', statusSchema);
