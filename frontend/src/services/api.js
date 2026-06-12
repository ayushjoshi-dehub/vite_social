// API service for calling backend endpoints
import { API_BASE_URL } from "../config";

const api = {
    // Helper method for all requests
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                credentials: "include" // Include cookies for authentication
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.status}`);
            }

            return { success: true, data };
        } catch (error) {
            console.error("API Error:", error);
            return {
                success: false,
                error: error.message || "An error occurred"
            };
        }
    },

    // Auth endpoints
    auth: {
        signup: (payload) =>
            api.request("/auth/signup", {
                method: "POST",
                body: JSON.stringify(payload)
            }),
        signin: (payload) =>
            api.request("/auth/signin", {
                method: "POST",
                body: JSON.stringify(payload)
            }),
        logout: () =>
            api.request("/auth/signout", {
                method: "POST"
            })
    },

    // Post endpoints
    posts: {
        getAll: (page = 1, limit = 10) =>
            api.request(`/post?page=${page}&limit=${limit}`, {
                method: "GET"
            }),
        getById: (postId) =>
            api.request(`/post/${postId}`, {
                method: "GET"
            }),
        getByUser: (userId, page = 1, limit = 10) =>
            api.request(`/post/user/${userId}?page=${page}&limit=${limit}`, {
                method: "GET"
            }),
        create: (payload) =>
            api.request("/post", {
                method: "POST",
                body: JSON.stringify(payload)
            }),
        update: (postId, payload) =>
            api.request(`/post/${postId}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            }),
        delete: (postId) =>
            api.request(`/post/${postId}`, {
                method: "DELETE"
            }),
        like: (postId) =>
            api.request(`/post/${postId}/like`, {
                method: "POST"
            }),
        comment: (postId, payload) =>
            api.request(`/post/${postId}/comment`, {
                method: "POST",
                body: JSON.stringify(payload)
            })
    },

    // Story endpoints
    stories: {
        getFeed: () =>
            api.request("/story/feed", {
                method: "GET"
            }),
        getByUser: (userId) =>
            api.request(`/story/user/${userId}`, {
                method: "GET"
            }),
        getById: (storyId) =>
            api.request(`/story/${storyId}`, {
                method: "GET"
            }),
        create: (payload) =>
            api.request("/story", {
                method: "POST",
                body: JSON.stringify(payload)
            }),
        view: (storyId) =>
            api.request(`/story/${storyId}/view`, {
                method: "POST"
            }),
        like: (storyId) =>
            api.request(`/story/${storyId}/like`, {
                method: "POST"
            }),
        comment: (storyId, payload) =>
            api.request(`/story/${storyId}/comment`, {
                method: "POST",
                body: JSON.stringify(payload)
            }),
        delete: (storyId) =>
            api.request(`/story/${storyId}`, {
                method: "DELETE"
            })
    },

    // User endpoints
    user: {
        getProfile: (userId) =>
            api.request(`/user/${userId}`, {
                method: "GET"
            }),
        updateProfile: (payload) =>
            api.request("/user/profile", {
                method: "PUT",
                body: JSON.stringify(payload)
            }),
        follow: (userId) =>
            api.request(`/user/${userId}/follow`, {
                method: "POST"
            }),
        unfollow: (userId) =>
            api.request(`/user/${userId}/unfollow`, {
                method: "POST"
            }),
        getSuggestions: () =>
            api.request("/user/suggestions", {
                method: "GET"
            })
    }
};

export default api;
