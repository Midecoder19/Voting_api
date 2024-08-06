const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/votes');
const candidateRoutes = require('./routes/candidates');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root URL route
app.get('/', (req, res) => {
  res.send('Welcome to the School Voting API!');
});

app.use('/auth', authRoutes);
app.use('/votes', voteRoutes);
app.use('/candidates', candidateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
