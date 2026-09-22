const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/email.js");
const OTP = require("./../models/OTP.js");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Function to generate JWT token

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// User registration controller
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        // hash the password before saving to the database

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = User.create({ name, email, password: hashedPassword, role: "user", isVerified: false });

        // otp generation and sending email

        const otp = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit OTP

        console.log(`OTP for ${email}: ${otp}`);
        await OTP.create({ email, otp, action: 'account_verification' });
        await sendOtpEmail(email, otp, "account_verification");

        res.status(201).json({
            message: "User registered successfully. Please check your email for the OTP to verify your account.",
            email: user.email,
        });

    } catch (error) {
        return res.status(400).json({ message: "Error registering user", error: error.message });
    }
}

const loginUser = async (req, res) => {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials , Please sign up first" });
    }

    // Check if the provided password matches the user's password
    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid credentials, Please check your email and password" });
    }

    if (user.isVerified === false && user.role === "user") {
        const otp = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit OTP
        await OTP.deleteMany({ email, action: 'account_verification' }); // delete any existing OTPs for this email
        await OTP.create({ email, otp, action: 'account_verification' });
        await sendOtpEmail(email, otp, "account_verification");

        return res.status(400).json({ message: "Your account is not verified. Please check your email for the OTP to verify your account." });
    }

    res.json({
        messsage: "Login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    });
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email, otp, action: 'account_verification' });

    if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // If the OTP is valid, update the user's verification status
    const user = await User.findOneAndUpdate({ email }, { isVerified: true });
    await OTP.deleteMany({ email, otp, action: 'account_verification' });

    res.json({
        message: "OTP verified successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    });
}

module.exports = { registerUser, loginUser, verifyOtp };