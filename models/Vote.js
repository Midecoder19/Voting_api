const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
});

module.exports = mongoose.model('Vote', voteSchema);
