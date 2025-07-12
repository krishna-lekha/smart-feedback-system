const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// CSV Export
router.post('/export/csv', async (req, res) => {
  try {
    //const feedbacks = await Feedback.find();
    const filteredSuggestions = req.body;
    const fields = ['name', 'category', 'description', 'sentiment', 'suggestion'];
    const parser = new Parser({ fields });
    const csv = parser.parse(filteredSuggestions);

    res.header('Content-Type', 'text/csv');
    res.attachment('feedbacks.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).send('CSV export failed');
  }
});

// PDF Export
router.get('/export/pdf', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=feedbacks.pdf');

    doc.pipe(res);
    doc.fontSize(16).text('Feedback Report', { align: 'center' });
    doc.moveDown();

    feedbacks.forEach(fb => {
      doc.fontSize(12).text(`Name: ${fb.name}`);
      doc.text(`Category: ${fb.category}`);
      doc.text(`Description: ${fb.description}`);
      doc.text(`Sentiment: ${fb.sentiment}`);
      doc.text(`Suggestion: ${fb.suggestion}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).send('PDF export failed');
  }
});

module.exports = router;
