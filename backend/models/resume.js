const mongoose = require('mongoose');
const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  skills: [String],
  recommendations: [String]
});
module.exports = mongoose.model('Resume', ResumeSchema);
