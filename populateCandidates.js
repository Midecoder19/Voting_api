const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('./models/Candidate');

dotenv.config();

const candidates = [
  { name: 'Candidate 1' },
  { name: 'Candidate 2' },
  { name: 'Candidate 3' },
  { name: 'Candidate 4' },
  { name: 'Candidate 5' },
  { name: 'Candidate 6' },
  { name: 'Candidate 7' },
  { name: 'Candidate 8' },
  { name: 'Candidate 9' },
  { name: 'Candidate 10' },
  { name: 'Candidate 11' },
  { name: 'Candidate 12' },
  { name: 'Candidate 13' },
  { name: 'Candidate 14' },
  { name: 'Candidate 15' },
  { name: 'Candidate 16' },
  { name: 'Candidate 17' },
  { name: 'Candidate 18' },
  { name: 'Candidate 19' },
  { name: 'Candidate 20' },
];

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    
    // Clear existing candidates
    await Candidate.deleteMany({});
    
    // Insert new candidates
    await Candidate.insertMany(candidates);
    console.log('Candidates inserted');
    
    mongoose.connection.close();
  })
  .catch(err => console.error('MongoDB connection error:', err));
