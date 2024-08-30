const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Update the path as necessary
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define users to be populated
const users = [
  { "matricNumber": "2023235020245", "level": "HND1","nacosId":"4321" },
  { "matricNumber": "20242000", "level": "ND1","nacosId":"5432" },
  { "matricNumber": "20243456", "level": "HND1","nacosId":"1324" },
    { "matricNumber": "2023235020124", "level": "ND1","nacosId":"0087" }
  // Add more users as needed
];1

async function populateUsers() {
  for (const userData of users) {
    try {
      // Generate a unique password
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with the provided data and the generated password
      const user = new User({
        matricNumber: userData.matricNumber,
        level: userData.level,
        nacosId:userData.nacosId,
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
  await mongoose.connection.close();
}

populateUsers();