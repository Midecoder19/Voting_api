// models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  position: String,  // This should match the position in the request
  votes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Candidate', candidateSchema);
