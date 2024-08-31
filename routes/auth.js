const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

const router = new express.Router();

router.post('/login', async (req, res) => {
    const { matricNumber, level, nacosId, password } = req.body;

    try {
        const user = await User.findOne({ matricNumber, level, nacosId });
        if (!user) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        user.verificationCode = verificationCode;
        await user.save();

        
        res.send({ message: 'Login Succesfull. Please proceed.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred during login. Please try again later.' });
    }
});

module.exports = router;
