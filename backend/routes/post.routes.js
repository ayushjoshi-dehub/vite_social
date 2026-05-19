import express from "express";
import {
    createPost,
    getAllPosts,
    getUserPosts,
    getPost,
    toggleLike,
    addComment,
    deletePost,
    updatePost
} from "../controllers/post.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/user/:userId", getUserPosts);
router.get("/:postId", getPost);

// Protected routes
router.post("/", isAuth, createPost);
router.put("/:postId", isAuth, updatePost);
router.delete("/:postId", isAuth, deletePost);
router.post("/:postId/like", isAuth, toggleLike);
router.post("/:postId/comment", isAuth, addComment);

export default router;
