import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { catchAsync, AppError } from "../utils/errorHandler.js";
import { validateCaption } from "../utils/validation.js";

// Create a new post
export const createPost = catchAsync(async (req, res) => {
    const { caption, media, mediaType, location, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!media || !mediaType) {
        return res.status(400).json({ message: "Media and mediaType are required" });
    }

    if (!validateCaption(caption)) {
        return res.status(400).json({ message: "Caption is invalid or exceeds 2200 characters" });
    }

    if (!["image", "video"].includes(mediaType)) {
        return res.status(400).json({ message: "Invalid media type" });
    }

    const post = new Post({
        author: userId,
        caption,
        media,
        mediaType,
        location,
        tags: tags || []
    });

    await post.save();
    await post.populate("author", "username profileImage");

    res.status(201).json({
        message: "Post created successfully",
        post
    });
});

// Get all posts with pagination
export const getAllPosts = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
        .populate("author", "username profileImage")
        .populate("comments.user", "username profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Post.countDocuments();

    res.status(200).json({
        posts,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    });
});

// Get posts by user
export const getUserPosts = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: userId })
        .populate("author", "username profileImage")
        .populate("comments.user", "username profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Post.countDocuments({ author: userId });

    res.status(200).json({
        posts,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    });
});

// Get single post
export const getPost = catchAsync(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
        .populate("author", "username profileImage verified")
        .populate("comments.user", "username profileImage");

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
});

// Like/Unlike a post
export const toggleLike = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
        post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
        post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
        message: isLiked ? "Post unliked" : "Post liked",
        post
    });
});

// Add comment to post
export const addComment = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 500) {
        return res.status(400).json({ message: "Comment cannot exceed 500 characters" });
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
        user: userId,
        text: text.trim()
    });

    await post.save();
    await post.populate("comments.user", "username profileImage");

    res.status(201).json({
        message: "Comment added successfully",
        post
    });
});

// Delete a post
export const deletePost = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
        return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
});

// Update post
export const updatePost = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const { caption, location, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
        return res.status(403).json({ message: "You can only update your own posts" });
    }

    if (caption !== undefined) {
        if (!validateCaption(caption)) {
            return res.status(400).json({ message: "Caption is invalid" });
        }
        post.caption = caption;
    }

    if (location !== undefined) post.location = location;
    if (tags !== undefined) post.tags = tags;

    await post.save();

    res.status(200).json({
        message: "Post updated successfully",
        post
    });
});
