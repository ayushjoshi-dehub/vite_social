import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"]
    },
    media: {
        type: String,
        required: [true, "Media URL is required"]
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
        required: [true, "Media type is required"]
    },
    caption: {
        type: String,
        default: "",
        maxlength: [500, "Caption cannot exceed 500 characters"],
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true,
            maxlength: [250, "Comment cannot exceed 250 characters"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Story expires after 24 hours
    }
}, { timestamps: true });

// Indexes
storySchema.index({ author: 1, createdAt: -1 });
storySchema.index({ viewers: 1 });

const Story = mongoose.model("Story", storySchema);
export default Story;