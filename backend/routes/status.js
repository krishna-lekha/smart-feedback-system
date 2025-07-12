const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Status = require('../models/Status');


router.get('/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); // Get all feedbacks

    const result = await Promise.all(feedbacks.map(async (fb) => {
      const latestStatus = await Status.findOne({ feedbackId: fb._id }).sort({ updatedAt: -1 });

      return {
        _id: fb._id,
         name: fb.name, // ✅ added
          category: fb.category, // ✅ added
          source: fb.source, // ✅ added
          description: fb.description,
          status: latestStatus ? latestStatus.status : 'Not Updated',
          updatedAt: latestStatus ? latestStatus.updatedAt : null
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// POST: Update feedback status (Admin)
router.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

    const newStatus = new Status({ feedbackId: id, status });
    await newStatus.save();

    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.get('/viewstatus', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const result = await Promise.all(feedbacks.map(async (fb) => {
      const latestStatus = await Status.findOne({ feedbackId: fb._id }).sort({ updatedAt: -1 });
      return {
        name: fb.name || "Anonymous",
        category: fb.category || "N/A",
        source: fb.source || "—",
        description: fb.description,
        status: latestStatus ? latestStatus.status : 'Not Updated',
        updatedAt: latestStatus ? latestStatus.updatedAt : null,
      };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch view status' });
  }
});

module.exports = router;
