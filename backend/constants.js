// Shared constants for application
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500
};

export const VALIDATION = {
    username: {
        min: 3,
        max: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        message: 'Username must be 3-20 characters, alphanumeric and underscore only'
    },
    password: {
        min: 6,
        max: 128,
        message: 'Password must be at least 6 characters'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please provide a valid email'
    },
    caption: {
        max: 2200,
        message: 'Caption cannot exceed 2200 characters'
    },
    comment: {
        max: 500,
        message: 'Comment cannot exceed 500 characters'
    },
    storyCaption: {
        max: 500,
        message: 'Story caption cannot exceed 500 characters'
    }
};

export const MEDIA_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video'
};

export const ALLOWED_MIME_TYPES = {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    videos: ['video/mp4', 'video/webm', 'video/quicktime']
};

export const FILE_SIZE_LIMITS = {
    profile: 2 * 1024 * 1024, // 2MB
    post: 10 * 1024 * 1024, // 10MB
    story: 25 * 1024 * 1024, // 25MB
    reel: 100 * 1024 * 1024 // 100MB
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50
};

export const EXPIRY_TIMES = {
    TOKEN: 30 * 24 * 60 * 60, // 30 days in seconds
    STORY: 24 * 60 * 60, // 24 hours in seconds
    OTP: 15 * 60, // 15 minutes in seconds
    REFRESH_TOKEN: 60 * 24 * 60 * 60 // 60 days in seconds
};

export const ERROR_MESSAGES = {
    AUTH: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        EMAIL_EXISTS: 'Email already registered',
        USERNAME_EXISTS: 'Username already taken',
        UNAUTHORIZED: 'Unauthorized access',
        TOKEN_EXPIRED: 'Token has expired',
        INVALID_TOKEN: 'Invalid token',
        NOT_AUTHENTICATED: 'Please login to continue'
    },
    VALIDATION: {
        REQUIRED_FIELD: 'This field is required',
        INVALID_EMAIL: 'Please provide a valid email',
        WEAK_PASSWORD: 'Password must be at least 6 characters',
        INVALID_USERNAME: 'Username must be 3-20 characters',
        FILE_TOO_LARGE: 'File size exceeds limit',
        INVALID_FILE_TYPE: 'Invalid file type'
    },
    RESOURCE: {
        NOT_FOUND: 'Resource not found',
        ALREADY_EXISTS: 'Resource already exists',
        DELETED: 'Resource has been deleted',
        CANNOT_DELETE_OWN_ACCOUNT: 'Cannot delete your own account'
    },
    PERMISSION: {
        FORBIDDEN: 'You do not have permission to perform this action',
        CAN_ONLY_EDIT_OWN: 'You can only edit your own content',
        CAN_ONLY_DELETE_OWN: 'You can only delete your own content'
    },
    SERVER: {
        INTERNAL_ERROR: 'An internal server error occurred',
        DATABASE_ERROR: 'Database operation failed',
        EMAIL_ERROR: 'Failed to send email'
    }
};

export const API_PATHS = {
    AUTH: '/api/auth',
    USERS: '/api/user',
    POSTS: '/api/post',
    STORIES: '/api/story',
    REELS: '/api/reel',
    MESSAGES: '/api/message'
};

export const CACHE_KEYS = {
    USER: (id) => `user:${id}`,
    POST: (id) => `post:${id}`,
    STORY: (id) => `story:${id}`,
    USER_POSTS: (id) => `user:${id}:posts`,
    USER_STORIES: (id) => `user:${id}:stories`,
    FEED: (id) => `user:${id}:feed`
};
