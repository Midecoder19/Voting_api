// routes/dashboardRoutes.js
const express = require('express');
const Candidate = require('../models/Candidate');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const candidates = await Candidate.find();

    const positions = {
      "Vice President": [],
      "President": [],
      "General Secretary": [],
      "Assistant General Secretary": [],
      "Treasurer": [],
      "Financial Secretary": [],
      "Auditor": [],
      "Software 1": [],
      "Social": []
    };

    // Group candidates by their positions
    candidates.forEach(candidate => {
      if (positions[candidate.position]) {
        positions[candidate.position].push(candidate);
      }
    });

    res.status(200).json(positions);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
