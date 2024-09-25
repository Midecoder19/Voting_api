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
    { "matricNumber": "2023235020124", "level": "ND1", "nacosId": "0000" },
    { "matricNumber": "2023235020025", "level": "ND1", "nacosId": "0002" },
    { "matricNumber": "2023705010282", "level": "ND1", "nacosId": "0003" },
    { "matricNumber": "2018235020026", "level": "HND1", "nacosId": "0004" },
    { "matricNumber": "2023235020249", "level": "ND1", "nacosId": "0001" },



    // Add more users as needed
];

async function populateUsers() {
  for (const userData of users) {
    try {
      // Check if user with the given matricNumber already exists
      const existingUser = await User.findOne({ matricNumber: userData.matricNumber });
      if (existingUser) {
        console.log(`User with matricNumber ${userData.matricNumber} already exists`);
        continue; // Skip this user and move to the next one
      }

      // Generate a unique password
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with the provided data and the generated password
      const user = new User({
        matricNumber: userData.matricNumber,
        level: userData.level,
        nacosId: userData.nacosId,
        password: hashedPassword
      });

      // Save the user to the database
      await user.save();
      console.log(`User ${user.matricNumber} registered with password ${password}`);

      // Optionally, send the unique password to the user's email or phone (this would be implemented in your API)
    } catch (err) {
      console.error('Error registering user:', err);
    }
  }

  // Close the database connection
  await mongoose.connection.close();
}

populateUsers();
