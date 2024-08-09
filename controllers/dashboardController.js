const Candidate = require('../models/Candidate');

const getDashboardData = async (req, res) => {
  try {
    const positions = ['Vice President', 'President', 'General Secretary', 'Assistant General Secretary', 'Tresurer','Fin sec','Audith','Software 1','Social'];

    const dashboardData = {};
    
    for (const position of positions) {
      dashboardData[position] = await Candidate.find({ position }).sort({ votes: -1 }).lean();
    }

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getDashboardData };
