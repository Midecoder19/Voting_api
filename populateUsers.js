const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define users to be populated
const users = [
  { matricNumber: '20240001', nacosId: '1234', level: 'ND1' },
  { matricNumber: '20240002', nacosId: '5678', level: 'HND1' },
  { matricNumber: '20240003', nacosId: '9101', level: 'ND1' }
  // Add more users as needed
];

async function populateUsers() {
  for (const userData of users) {
    try {
      // Generate a unique password
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with the provided data and the generated password
      const user = new User({
        matricNumber: userData.matricNumber,
        nacosId: userData.nacosId,
        level: userData.level,
        password: hashedPassword
      });

      // Save the user to the database
      await user.save();
      console.log(`User ${user.matricNumber} registered with password ${password}`);
    } catch (err) {
      console.error('Error registering user:', err);
    }
  }

  // Close the database connection
  mongoose.connection.close();
}

populateUsers();
