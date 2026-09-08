const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/email.js");
const OTP=require("../models/OTP.js");

const router = express.Router();

const registerUser= async (req,res)=>{
    const { name, email, password } = req.body;

    let userExists = await User.findOne({ email });

    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }
    // hash the password before saving to the database

    const salt= await bcrypt.genSalt(10);

    const hashedPassword= await bcrypt.hash(password,salt);

    try{
        const user = new User.create({ name, email, password: hashedPassword,role:"user",isVerified:false });

        const otp = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit OTP

        console.log(`OTP for ${email}: ${otp}`); 
        await OTP.create({ email, otp, action: 'account_verification' }); 
        await sendOtpEmail(email, otp, "account_verification");

        res.status(201).json({
            message:"User registered successfully. Please check your email for the OTP to verify your account.",
            email: user.email,
        });

    } catch (error) {
        return res.status(400).json({message:"Error registering user", error:error});
    }
}

module.exports = { registerUser};