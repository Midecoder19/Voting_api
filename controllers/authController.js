const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendCode = require('../utils/sendCode');

exports.register = async (req, res) => {
  const { matricNumber, email, phone, level, nacosId, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const student = new Student({
      matricNumber,
      email,
      phone,
      level,
      nacosId,
      password: hashedPassword,
      verificationCode,
    });

    await student.save();

    sendCode(email, verificationCode);

    res.status(201).json({ message: 'Student registered. Please verify your email.' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed.' });
  }
};

exports.login = async (req, res) => {
  const { matricNumber, password } = req.body;

  try {
    const student = await Student.findOne({ matricNumber });

    if (!student || !await bcrypt.compare(password, student.password)) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    if (!student.verified) {
      return res.status(400).json({ error: 'Please verify your email first.' });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

exports.verifyCode = async (req, res) => {
  const { matricNumber, code } = req.body;

  try {
    const student = await Student.findOne({ matricNumber });

    if (!student || student.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid code.' });
    }

    student.verified = true;
    student.verificationCode = null;
    await student.save();

    res.json({ message: 'Email verified. You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed.' });
  }
};
