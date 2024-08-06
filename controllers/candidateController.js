const Candidate = require('../models/Candidate');

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates.' });
  }
};
