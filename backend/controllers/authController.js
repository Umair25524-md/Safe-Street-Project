const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/UserModel');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,    // your email
        pass: process.env.EMAIL_PASS     // your app password
    }
});

const getAuthentication = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ isAuthenticated: false });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ isAuthenticated: true });
    } catch (err) {
        res.json({ isAuthenticated: false });
    }
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        const existingUserName = await User.findOne({ name });
        if (existingUser || existingUserName) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate verification token
        const verificationToken = jwt.sign(
            { name, email, password },
            process.env.EMAIL_VERIFICATION_SECRET,
            { expiresIn: '15m' } // Token expires in 15 minutes
        );

        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        // Send verification email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "SafeStreet - Verify your email",
            html: `
                <h2>Welcome to SafeStreet!</h2>
                <p>Click below to verify your email:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link will expire in 15 minutes.</p>
            `
        });

        res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Invalid or missing token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        const { name, email, password } = decoded;

        // // Check if the user already exists
        const existingUser = await User.findOne({ email });

        // // If the user exists, but is not verified, update them
        if (existingUser && existingUser.isEmailVerified) {
            existingUser.isEmailVerified = true;
            existingUser.password = await bcrypt.hash(password, 10);  // Ensure password is hashed
            await existingUser.save();

            return res.status(200).json({ message: 'Email verified! You can now login.' });
        }


        // If the user doesn't exist, create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isEmailVerified: true,
            authProvider: 'local'
        });

        await newUser.save();

        res.status(201).json({ message: 'Email verified! You can now login.' });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};



const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user;

        // Check if input is email or username
        if (email.includes('@')) {
            user = await User.findOne({ email });
        } else {
            user = await User.findOne({ name: email });
        }

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (user.authProvider === 'google') {
            return res.status(400).json({ message: "Please login with Google." });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ message: "Please verify your email first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User logged in successfully",
            name: user.name,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { getAuthentication, logout, login, signup, verifyEmail };
