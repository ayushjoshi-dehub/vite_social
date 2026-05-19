import express from "express";
import {
    createStory,
    getStoriesFeed,
    getUserStories,
    getStory,
    viewStory,
    toggleLike,
    addComment,
    deleteStory
} from "../controllers/story.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Protected routes
router.post("/", isAuth, createStory);
router.get("/feed", isAuth, getStoriesFeed);
router.get("/user/:userId", getUserStories);
router.get("/:storyId", isAuth, getStory);
router.post("/:storyId/view", isAuth, viewStory);
router.post("/:storyId/like", isAuth, toggleLike);
router.post("/:storyId/comment", isAuth, addComment);
router.delete("/:storyId", isAuth, deleteStory);

export default router;
