import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
});

const sendMail = async (email, otp) => {
    transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Code for Password Reset",
        text: `Your OTP code is: ${otp}`,
    });
}

export default sendMail;