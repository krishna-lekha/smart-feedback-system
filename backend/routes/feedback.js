const express = require('express');
const router = express.Router();
const multer = require('multer');
const Feedback = require('../models/Feedback');

// Set up multer for file handling
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { description } = req.body;

        const feedbackData = {
            description,
        };

        // If an image is uploaded, add it to feedbackData
        if (req.file) {
            feedbackData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const feedback = new Feedback(feedbackData);
        await feedback.save();

        res.status(201).json({ success: true, message: 'Feedback received!' });
    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
});

module.exports = router;

// GET all feedbacks with base64 image
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();

        const formattedFeedbacks = feedbacks.map(feedback => {
            let imageUrl = null;

            if (feedback.image && feedback.image.data) {
                const base64Image = feedback.image.data.toString('base64');
                imageUrl = `data:${feedback.image.contentType};base64,${base64Image}`;
            }

            return {
                _id: feedback._id,
                description: feedback.description,
                imageUrl
            };
        });

        res.status(200).json(formattedFeedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch feedbacks' });
    }
});

