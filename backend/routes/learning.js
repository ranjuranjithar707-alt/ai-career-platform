const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });
  // Mock AI response
  res.json({
    topic,
    modules: [
      { title: `Introduction to ${topic}`, duration: '2 hours' },
      { title: `Advanced Concepts in ${topic}`, duration: '4 hours' },
      { title: `Practical Projects for ${topic}`, duration: '5 hours' }
    ]
  });
});

module.exports = router;
