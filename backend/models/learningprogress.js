const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillGaps: [{ skill: String, status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' } }],
  learningPaths: [{ topic: String, resources: [String], priority: String }],
  completedTopics: [String],
  quizScores: [{ topic: String, score: Number, date: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

learningProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
