const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

router.post('/', async (req, res) => {
  const { userId, votes } = req.body; 

  try {
    for (let i = 0; i < votes.length; i++) {
      const { candidateId, position } = votes[i];

      // Check if the user has already voted for this position
      const existingVote = await Vote.findOne({ userId, position });

      if (existingVote) {
        return res.status(400).json({ error: `You have already voted for a candidate in the position: ${position}` });
      }

      // Increment the vote count for the candidate
      const candidate = await Candidate.findByIdAndUpdate(
        candidateId,
        { $inc: { votes: 1 } },
        { new: true }
      );

      if (!candidate) {
        return res.status(404).json({ error: `Candidate not found for position: ${position}` });
      }

      // Record the vote
      const vote = new Vote({ userId, candidateId, position });
      await vote.save();
    }

    res.json({ message: 'Votes successfully recorded' });
  } catch (error) {
    console.error('Error during voting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
