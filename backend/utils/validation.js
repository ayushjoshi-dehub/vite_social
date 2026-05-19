// Validation utility functions
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

export const validateCaption = (caption, maxLength = 2200) => {
    if (!caption || typeof caption !== 'string') return false;
    return caption.trim().length <= maxLength;
};

export const validateMediaUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

export const validateFileSize = (fileSize, maxSize = 5242880) => {
    return fileSize <= maxSize;
};

export const validateMediaType = (mimeType, allowedTypes) => {
    return allowedTypes.includes(mimeType);
};
