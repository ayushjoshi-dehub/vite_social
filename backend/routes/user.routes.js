import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import {
    getCurrentUser,
    getSuggestedUser,
    updateProfile,
    searchUsers,
    getUserByUsername,
    followUser,
    unfollowUser
} from '../controllers/user.controllers.js';

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/suggested", isAuth, getSuggestedUser);
userRouter.get("/search", isAuth, searchUsers);
userRouter.put("/profile", isAuth, updateProfile);
userRouter.get("/profile/:username", isAuth, getUserByUsername);
userRouter.post("/:userId/follow", isAuth, followUser);
userRouter.post("/:userId/unfollow", isAuth, unfollowUser);

export default userRouter;
