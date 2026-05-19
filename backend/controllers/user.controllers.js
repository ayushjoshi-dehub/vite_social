import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import sendMail from '../config/mail.js';

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser error ${error}` });
    }
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.find({ id:{$ne: req.userId} });
        const userToVerify = await User.findOne({ email });
        if (!userToVerify) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userToVerify.resetotp = otp;
        userToVerify.otpExpiry = Date.now() + 10 * 60 * 1000;
        userToVerify.isotpVerified = false;

        await userToVerify.save();
        await sendMail(email, otp);
        return res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).json({ message: `sendOtp error ${error}` });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetotp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        user.isotpVerified = true;
        user.resetotp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "OTP verified" });
    } catch (error) {
        return res.status(500).json({ message: `verifyOtp error ${error}` });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isotpVerified) {
            return res.status(400).json({ message: "OTP verification required" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isotpVerified = false;
        await user.save();
        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: `resetPassword error ${error}` });
    }
};
export const getSuggestedUser = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const users = await User.find({ _id: { $ne: currentUserId } })
            .select("-password")
            .limit(5);
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: `getSuggestedUser error ${error}` });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const query = String(req.query.q || "").trim();

        const filter = {
            _id: { $ne: currentUserId },
            ...(query
                ? {
                      $or: [
                          { username: { $regex: query, $options: "i" } },
                          { name: { $regex: query, $options: "i" } },
                          { email: { $regex: query, $options: "i" } },
                      ],
                  }
                : {}),
        };

        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(25);

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: `searchUsers error ${error}` });
    }
};

export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: `getUserByUsername error ${error}` });
    }
};

export const followUser = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const { userId } = req.params;

        if (!currentUserId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (currentUserId === userId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const [currentUser, targetUser] = await Promise.all([
            User.findById(currentUserId),
            User.findById(userId),
        ]);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const alreadyFollowing = currentUser.following.some(
            (id) => id.toString() === userId
        );
        if (alreadyFollowing) {
            return res.status(200).json({ message: "Already following" });
        }

        currentUser.following.push(targetUser._id);
        targetUser.followers.push(currentUser._id);
        await Promise.all([currentUser.save(), targetUser.save()]);

        return res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
        return res.status(500).json({ message: `followUser error ${error}` });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const { userId } = req.params;

        if (!currentUserId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const [currentUser, targetUser] = await Promise.all([
            User.findById(currentUserId),
            User.findById(userId),
        ]);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== userId
        );
        targetUser.followers = targetUser.followers.filter(
            (id) => id.toString() !== currentUserId
        );
        await Promise.all([currentUser.save(), targetUser.save()]);

        return res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        return res.status(500).json({ message: `unfollowUser error ${error}` });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, username, profileImage } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (typeof username === "string" && username.trim() && username.trim() !== user.username) {
            const existing = await User.findOne({ username: username.trim(), _id: { $ne: userId } });
            if (existing) {
                return res.status(400).json({ message: "Username already exists" });
            }
            user.username = username.trim();
        }

        if (typeof name === "string" && name.trim()) {
            user.name = name.trim();
        }

        if (typeof profileImage === "string") {
            user.profileImage = profileImage;
        }

        await user.save();

        const safeUser = user.toObject();
        delete safeUser.password;

        return res.status(200).json({
            message: "Profile updated successfully",
            user: safeUser
        });
    } catch (error) {
        return res.status(500).json({ message: `updateProfile error ${error}` });
    }
};
