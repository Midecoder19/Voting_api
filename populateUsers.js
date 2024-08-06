const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcrypt');

dotenv.config();

const users = [
  { matricNumber: '20240001', phone: '08011122334', email: 'student1@example.com', level: 'ND1', nacosId: '1234' },
  { matricNumber: '20240002', phone: '08022334455', email: 'student2@example.com', level: 'ND1', nacosId: '5678' },
  { matricNumber: '20240003', phone: '08033445566', email: 'student3@example.com', level: 'HND1', nacosId: '9101' },
  // Add more users as needed
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    // Clear existing users
    await User.deleteMany({});

    // Hash passwords and insert new users
    for (let user of users) {
      const hashedPassword = await bcrypt.hash('password123', 10); // Use a default password or generate one
      user.password = hashedPassword;
      await User.create(user);
    }
    console.log('Users inserted');

    mongoose.connection.close();
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

seedUsers();
