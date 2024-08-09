const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate'); // Adjust the path as needed

// Route to handle voting
router.post('/vote/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Increment the vote count for the specified candidate
    const result = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all candidates
router.get('/all', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
