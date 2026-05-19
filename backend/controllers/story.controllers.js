import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import { catchAsync, AppError } from "../utils/errorHandler.js";

// Create a new story
export const createStory = catchAsync(async (req, res) => {
    const { media, mediaType, caption } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!media || !mediaType) {
        return res.status(400).json({ message: "Media and mediaType are required" });
    }

    if (!["image", "video"].includes(mediaType)) {
        return res.status(400).json({ message: "Invalid media type" });
    }

    const story = new Story({
        author: userId,
        media,
        mediaType,
        caption: caption || "",
        viewers: []
    });

    await story.save();
    await story.populate("author", "username profileImage");

    res.status(201).json({
        message: "Story created successfully",
        story
    });
});

// Get all stories (feed)
export const getStoriesFeed = catchAsync(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId).select("following");
    const followingIds = user.following || [];
    followingIds.push(userId); // Include own stories

    const stories = await Story.find({ author: { $in: followingIds } })
        .populate("author", "username profileImage")
        .sort({ createdAt: -1 })
        .limit(50);

    res.status(200).json({ stories });
});

// Get stories by user
export const getUserStories = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const stories = await Story.find({ author: userId })
        .populate("author", "username profileImage")
        .sort({ createdAt: -1 });

    res.status(200).json({ stories });
});

// Get single story
export const getStory = catchAsync(async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const story = await Story.findById(storyId)
        .populate("author", "username profileImage")
        .populate("comments.user", "username profileImage");

    if (!story) {
        return res.status(404).json({ message: "Story not found" });
    }

    // Add viewer if not already viewed
    if (!story.viewers.includes(userId)) {
        story.viewers.push(userId);
        await story.save();
    }

    res.status(200).json({ story });
});

// Add viewer to story
export const viewStory = catchAsync(async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
        return res.status(404).json({ message: "Story not found" });
    }

    if (!story.viewers.includes(userId)) {
        story.viewers.push(userId);
        await story.save();
    }

    res.status(200).json({ message: "Story viewed", story });
});

// Like/Unlike a story
export const toggleLike = catchAsync(async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
        return res.status(404).json({ message: "Story not found" });
    }

    const isLiked = story.likes.includes(userId);

    if (isLiked) {
        story.likes = story.likes.filter(id => id.toString() !== userId);
    } else {
        story.likes.push(userId);
    }

    await story.save();

    res.status(200).json({
        message: isLiked ? "Story unliked" : "Story liked",
        story
    });
});

// Add comment to story
export const addComment = catchAsync(async (req, res) => {
    const { storyId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 250) {
        return res.status(400).json({ message: "Comment cannot exceed 250 characters" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
        return res.status(404).json({ message: "Story not found" });
    }

    story.comments.push({
        user: userId,
        text: text.trim()
    });

    await story.save();
    await story.populate("comments.user", "username profileImage");

    res.status(201).json({
        message: "Comment added successfully",
        story
    });
});

// Delete a story
export const deleteStory = catchAsync(async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
        return res.status(404).json({ message: "Story not found" });
    }

    if (story.author.toString() !== userId) {
        return res.status(403).json({ message: "You can only delete your own stories" });
    }

    await Story.findByIdAndDelete(storyId);

    res.status(200).json({ message: "Story deleted successfully" });
});
