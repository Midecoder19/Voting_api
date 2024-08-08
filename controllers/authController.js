const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NACOS = require('../models/NACOS');
const dotenv = require('dotenv');

dotenv.config();

const register = async (req, res) => {
  const { matricNumber, nacosId, level } = req.body;

  try {
    // Check if the student belongs to NACOS
    const nacosMember = await NACOS.findOne({ nacosId });
    if (!nacosMember) {
      return res.status(400).json({ error: 'NACOS ID not found' });
    }

    // Generate a unique code (password)
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      matricNumber,
      nacosId,
      level,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      matricNumber,
      generatedCode: password // Return the generated code for the user
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
};

const login = async (req, res) => {
  const { matricNumber, password } = req.body;

  try {
    const user = await User.findOne({ matricNumber });
    if (!user) {
      return res.status(400).json({ error: 'Invalid matric number or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid matric number or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
};

module.exports = {
  register,
  login
};
