const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Mock AI response
  res.json({
    score: 85,
    skills: ['JavaScript', 'React', 'Node.js'],
    missingSkills: ['Python', 'Docker'],
    recommendedRoles: ['Full Stack Developer', 'Frontend Engineer']
  });
});

module.exports = router;
