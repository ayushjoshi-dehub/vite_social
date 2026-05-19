// Custom error class for API responses
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handler wrapper for async route handlers
export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Common error responses
export const errorResponses = {
    VALIDATION_ERROR: (message = "Validation failed") => ({
        statusCode: 400,
        message: message
    }),
    UNAUTHORIZED: (message = "Unauthorized access") => ({
        statusCode: 401,
        message: message
    }),
    FORBIDDEN: (message = "Access forbidden") => ({
        statusCode: 403,
        message: message
    }),
    NOT_FOUND: (message = "Resource not found") => ({
        statusCode: 404,
        message: message
    }),
    CONFLICT: (message = "Resource already exists") => ({
        statusCode: 409,
        message: message
    }),
    INTERNAL_ERROR: (message = "Internal server error") => ({
        statusCode: 500,
        message: message
    })
};
