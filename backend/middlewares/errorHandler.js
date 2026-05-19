// Error handling middleware for consistent error responses
export const errorMiddleware = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error details
    console.error({
        timestamp: new Date().toISOString(),
        status,
        message,
        path: req.path,
        method: req.method,
        userId: req.user?.id,
        stack: err.stack
    });

    // Send response
    res.status(status).json({
        success: false,
        error: {
            status,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// Async catch wrapper for route handlers
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error formatter
export const validateRequest = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errors = error.details.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    req.body = value;
    next();
};
