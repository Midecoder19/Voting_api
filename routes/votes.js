const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

router.post('/', async (req, res) => {
  const { userId, candidateId, position } = req.body;

  try {
    // Check if the user has already voted for this candidate
    const existingVote = await Vote.findOne({ userId, candidateId });

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted for this candidate' });
    }

    // Increment the vote count for the candidate
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Record the vote
    const vote = new Vote({ userId, candidateId, position });
    await vote.save();

    res.json({ message: 'Vote successfully recorded', candidate });
  } catch (error) {
    console.error('Error during voting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
