import express from 'express';
import { signup, signin, signout, sendOtp, verifyOtp, resetPassword } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

// Standard Auth
authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/signout", signout);

// Forgot Password Flow
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;