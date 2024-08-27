const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const crypto = require('crypto');

const router = new express.Router();

const sendEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is ${code}`,
    });
};

const sendSMS = async (phone, code) => {
    const client = twilio('your-twilio-account-sid', 'your-twilio-auth-token');

    await client.messages.create({
        body: `Your verification code is ${code}`,
        from: 'your-twilio-phone-number',
        to: phone,
    });
};

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

        // Generate a unique verification code
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        user.verificationCode = verificationCode;
        await user.save();

        // Send the code via email or SMS
        if (user.email) {
            await sendEmail(user.email, verificationCode);
        } else if (user.phone) {
            await sendSMS(user.phone, verificationCode);
        } else {
            return res.status(400).send({ error: 'No email or phone number found' });
        }

        res.send({ message: 'Verification code sent. Please check your email or phone.' });
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
