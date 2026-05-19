import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"]
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
        required: [true, "Media type is required"]
    },
    media: {
        type: String,
        required: [true, "Media URL is required"]
    },
    caption: {
        type: String,
        default: "",
        maxlength: [2200, "Caption cannot exceed 2200 characters"],
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
            required: [true, "Comment text is required"],
            maxlength: [500, "Comment cannot exceed 500 characters"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    location: {
        type: String,
        trim: true
    },
    tags: [String]
}, { timestamps: true });

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ likes: 1 });

const Post = mongoose.model("Post", postSchema);
export default Post;