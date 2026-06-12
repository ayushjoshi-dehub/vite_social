// hooks/useRealData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const serverUrl = API_BASE_URL.replace(/\/api$/, "");

// Fetch posts from followed users + own posts
export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/post`, { withCredentials: true });
                setPosts(res.data.posts || res.data);
            } catch (error) {
                console.log("Posts fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return { posts, loading };
};

// Fetch suggested users
export const useSuggestedUsers = () => {
    const [suggested, setSuggested] = useState([]);

    useEffect(() => {
        const fetchSuggested = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/user/suggested`, { withCredentials: true });
                setSuggested(res.data);
            } catch (error) {
                console.log("Suggested fetch error:", error);
            }
        };
        fetchSuggested();
    }, []);

    return { suggested, setSuggested };
};

// Fetch stories
export const useStories = () => {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/story/feed`, { withCredentials: true });
                setStories(res.data);
            } catch (error) {
                console.log("Stories fetch error:", error);
            }
        };
        fetchStories();
    }, []);

    return { stories, setStories };
};

// Fetch messages/conversations
export const useMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Message backend routes are not implemented yet.
        setMessages([]);
    }, []);

    return { messages };
};