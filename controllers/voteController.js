const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const jwt = require('jsonwebtoken');

exports.vote = async (req, res) => {
  const { candidateId } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const studentId = decoded.id;

  try {
    const existingVote = await Vote.findOne({ studentId });

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted.' });
    }

    const vote = new Vote({ studentId, candidateId });
    await vote.save();

    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    res.json({ message: 'Vote registered successfully. Redirecting to homepage...' });
  } catch (error) {
    res.status(500).json({ error: 'Voting failed.' });
  }
};
