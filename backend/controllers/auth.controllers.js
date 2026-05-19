import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from '../config/mail.js'; 
const genToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const findByEmail = await User.findOne({ email });
        if (findByEmail)
            return res.status(400).json({ message: "User already exists" });

        const findByUserName = await User.findOne({ username });
        if (findByUserName)
            return res.status(400).json({ message: "Username already exists" });

        if (password.length < 6)
            return res.status(400).json({ message: "Password must be at least 6 characters" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = genToken(newUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        const safeUser = {
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            profileImage: newUser.profileImage,
            followers: newUser.followers,
            following: newUser.following,
            posts: newUser.posts,
            savedPosts: newUser.savedPosts,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.status(201).json({ message: "User created successfully", user: safeUser });

    } catch (error) {
        return res.status(500).json({ message: `Signup error: ${error.message}` });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid password" });

        const token = genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        const safeUser = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
            savedPosts: user.savedPosts,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({ message: "Signin successful", user: safeUser });

    } catch (error) {
        return res.status(500).json({ message: `Signin error: ${error.message}` });
    }
};

export const signout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Signed out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Signout error: ${error.message}` });
    }
};
// 1. Send OTP to Email
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetotp = otp;                          // ✅ was user.otp
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // ✅ was user.otpExpires
        await user.save();

        await sendMail(email, otp);

        res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: `OTP Error: ${error.message}` });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        console.log("DB otp:", user.resetotp);
        console.log("Received otp:", otp);
        console.log("OTP type DB:", typeof user.resetotp);
        console.log("OTP type received:", typeof otp);
        console.log("Expired?", user.otpExpiry < Date.now());

        if (!user || user.resetotp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        user.isotpVerified = true;
        user.resetotp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "OTP verified" });
    } catch (error) {
        return res.status(500).json({ message: `OTP Verification Error: ${error.message}` });
    }
};
// 3. Reset Password (THE MISSING LINK)
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        
        // Clear OTP fields so they can't be reused
        user.otp = undefined;
        user.otpExpires = undefined;
        
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: `Reset Error: ${error.message}` });
    }
};
