const mongoose = require('mongoose');
const Candidate = require('./models/Candidate'); // Update path as necessary

const updateCandidates = async () => {
  try {
    await mongoose.connect('mongodb+srv://midecoder:midecoder555@voting.bgf6z9h.mongodb.net/voting?retryWrites=true&w=majority');


    // Mapping of candidate IDs to positions
    const candidatePositions = {
      "66b14471b15324fa1ea0c5a8": "President",
      "66b14471b15324fa1ea0c5a9": "Vice President",
      "66b14471b15324fa1ea0c5aa": "General Secretary",
      "66b14471b15324fa1ea0c5ab": "Assistant General Secretary",
      "66b14471b15324fa1ea0c5ac": "Treasurer",
      "66b14471b15324fa1ea0c5ad": "Financial Secretary",
      "66b14471b15324fa1ea0c5ae": "Auditor",
      "66b14471b15324fa1ea0c5af": "Software 1",
      "66b14471b15324fa1ea0c5b0": "Social",
      // Add more candidates as needed
    };

    // Update each candidate with the corresponding position
    for (const [candidateId, position] of Object.entries(candidatePositions)) {
      const result = await Candidate.updateOne(
        { _id: candidateId },
        { $set: { position: position } }
      );
      console.log(`Updated candidate ${candidateId} to position ${position}:`, result);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating candidates:', error);
  }
};

updateCandidates();
