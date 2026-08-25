const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PUBLIC ROUTES (No auth required)
app.use('/api/auth', require('./routes/auth'));

// PROTECTED ROUTES (Auth required)
const authMiddleware = require('./middleware/auth');
app.use('/api/resume', authMiddleware, require('./routes/resume'));
app.use('/api/learning', authMiddleware, require('./routes/learning'));
app.use('/api/reviews', authMiddleware, require('./routes/reviews'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
