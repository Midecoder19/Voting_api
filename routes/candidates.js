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


// GET all candidates grouped by position
router.get('/candidates/all', async (req, res) => {
    try {
        // Find all candidates
        const candidates = await Candidate.find().sort({ position: 1 });

        if (!candidates || candidates.length === 0) {
            return res.status(404).json({ message: 'No candidates found' });
        }

        // Group candidates by position
        const groupedCandidates = candidates.reduce((acc, candidate) => {
            // Check if the position already exists in the accumulator
            if (!acc[candidate.position]) {
                acc[candidate.position] = [];
            }
            // Push candidate into the respective position array
            acc[candidate.position].push(candidate);
            return acc;
        }, {});

        // Send grouped candidates to frontend
        res.status(200).json(groupedCandidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'An error occurred while fetching candidates' });
    }
});

module.exports = router;


module.exports = router;
