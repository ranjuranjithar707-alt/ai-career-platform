const express = require('express');
const router = express.Router();

router.post('/detect', (req, res) => {
  const { review } = req.body;
  if (!review) return res.status(400).json({ error: 'Review text is required' });
  // Mock AI response
  const isFake = review.length < 20 || review.toLowerCase().includes('scam');
  res.json({
    isFake,
    confidence: 0.92,
    reason: isFake ? 'Review exhibits patterns common in bot-generated text.' : 'Review appears genuine based on sentiment analysis.'
  });
});

module.exports = router;
