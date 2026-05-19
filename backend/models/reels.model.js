import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"]
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
    thumbnail: {
        type: String,
        default: ""
    },
    duration: {
        type: Number,
        default: 0
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
            maxlength: [500, "Comment cannot exceed 500 characters"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    views: {
        type: Number,
        default: 0
    },
    tags: [String]
}, { timestamps: true });

// Indexes
reelSchema.index({ author: 1, createdAt: -1 });
reelSchema.index({ views: -1 });
reelSchema.index({ tags: 1 });

const Reel = mongoose.model("Reel", reelSchema);
export default Reel;