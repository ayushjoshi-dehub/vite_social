import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import storyRouter from './routes/story.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ======================
// MIDDLEWARE
// ======================

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ======================
// REQUEST LOGGING
// ======================
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
});

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is running", timestamp: new Date() });
});

// ======================
// ERROR HANDLING
// ======================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        error: "Route not found", 
        path: req.path,
        method: req.method
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Error:", {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ======================
// SERVER STARTUP
// ======================
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`✓ Server running on port ${PORT}`);
        console.log(`✓ Environment: ${process.env.NODE_ENV}`);
        console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL}`);
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
});

// Graceful Shutdown
process.on("SIGINT", () => {
    console.log("\nServer shutting down...");
    process.exit(0);
});

export default app;
