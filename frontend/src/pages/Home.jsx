import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

// Child Components
import LeftHome from "../components/LeftHome";
import Feed from "../components/Feed";
import RightHome from "../components/RightHome";
import BottomNav from "../components/BottomNav";
import ChatModal from "../components/ChatModal";
import CreateModal from "../components/CreateModal";
import StoriesViewer from "../components/StoriesViewer";
import AddStoryModal from "../components/AddStoryModal";
import StoryHeader from "../components/StoryHeader";
import { HeartIcon } from "../components/Icons";
import { setUserData } from "../redux/userSlice";

const serverUrl = "http://localhost:8000";

const themes = {
  dark: {
    name: 'dark',
    bg: 'from-[#0A0A0A] via-[#0D0D0D] to-black',
    bgSecondary: 'bg-black/80',
    bgTertiary: 'bg-zinc-900/50',
    text: 'text-white',
    textSecondary: 'text-zinc-400',
    textTertiary: 'text-zinc-500',
    border: 'border-white/5',
    borderSecondary: 'border-zinc-800',
    cardBg: 'bg-zinc-900/50',
    cardBgHover: 'hover:bg-zinc-800/50',
    inputBg: 'bg-zinc-900/50',
    inputBorder: 'border-zinc-800',
    shadow: 'shadow-black/50',
    gradient: { primary: 'from-rose-500 to-pink-500', secondary: 'from-indigo-500 to-purple-500', accent: 'from-amber-500 to-orange-500' },
    overlay: 'bg-black/50',
    modalBg: 'bg-zinc-900',
    iconColor: 'text-zinc-400',
    iconHover: 'hover:text-white',
  },
  light: {
    name: 'light',
    bg: 'from-gray-50 via-white to-gray-100',
    bgSecondary: 'bg-white/80',
    bgTertiary: 'bg-white/70',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textTertiary: 'text-gray-500',
    border: 'border-gray-200/50',
    borderSecondary: 'border-gray-300',
    cardBg: 'bg-white/70',
    cardBgHover: 'hover:bg-gray-100/80',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    shadow: 'shadow-black/10',
    gradient: { primary: 'from-rose-500 to-pink-500', secondary: 'from-indigo-500 to-purple-500', accent: 'from-amber-500 to-orange-500' },
    overlay: 'bg-white/50',
    modalBg: 'bg-white',
    iconColor: 'text-gray-600',
    iconHover: 'hover:text-gray-900',
  }
};

export default function Home() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user) || {};

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
    html.classList.toggle('light', theme === 'light');
  }, [theme]);

  // ── Real Data ─────────────────────────────────────────────
  const [posts, setPosts] = useState([]);
  const [storiesData, setStoriesData] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [dataLoading, setDataLoading] = useState(true);

  const formatRelativeTime = useCallback((dateString) => {
    if (!dateString) return "Just now";
    const diffMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }, []);

  const mapPostForFeed = useCallback((post) => ({
    id: post._id,
    user: {
      username: post.author?.username || "unknown",
      avatar: post.author?.profileImage || null,
      verified: !!post.author?.verified,
    },
    location: post.location || "",
    time: formatRelativeTime(post.createdAt),
    image: post.mediaType === "image" ? post.media : null,
    caption: post.caption || "",
    likes: Array.isArray(post.likes) ? post.likes.length : Number(post.likes || 0),
    comments: Array.isArray(post.comments) ? post.comments.length : Number(post.comments || 0),
  }), [formatRelativeTime]);

  const mapStoryForUi = useCallback((story) => ({
    id: story._id,
    username: story.author?.username || "unknown",
    name: story.author?.name || story.author?.username || "Story",
    avatar: story.author?.profileImage || null,
    viewed: Array.isArray(story.viewers) && !!userData?._id ? story.viewers.includes(userData._id) : false,
    hasLive: false,
    isYou: story.author?._id === userData?._id,
    media: story.media,
    mediaType: story.mediaType,
    caption: story.caption,
    timestamp: story.createdAt,
  }), [userData?._id]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [postsRes, storiesRes, suggestedRes, messagesRes] = await Promise.allSettled([
          axios.get(`${serverUrl}/api/post`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/story/feed`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/user/suggested`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/message/conversations`, { withCredentials: true }),
        ]);

        if (postsRes.status === "fulfilled") {
          const rawPosts = postsRes.value?.data?.posts || postsRes.value?.data || [];
          setPosts(Array.isArray(rawPosts) ? rawPosts.map(mapPostForFeed) : []);
        }
        if (suggestedRes.status === "fulfilled") {
          const followingSet = new Set((userData?.following || []).map((id) => String(id)));
          const normalizedSuggested = (suggestedRes.value.data || []).map((u) => ({
            ...u,
            following: followingSet.has(String(u._id)),
          }));
          setSuggested(normalizedSuggested);
        }
        if (messagesRes.status === "fulfilled") setMessages(messagesRes.value.data);

        const storyFeed = storiesRes.status === "fulfilled" ? storiesRes.value?.data?.stories || [] : [];
        const mappedFeedStories = Array.isArray(storyFeed) ? storyFeed.map(mapStoryForUi) : [];
        const hasOwnStory = mappedFeedStories.some((s) => s.isYou);
        setStoriesData([
          ...(!hasOwnStory ? [{
            id: "you",
            username: userData?.username || "You",
            name: userData?.name || "Your Story",
            avatar: userData?.profileImage || null,
            viewed: false,
            hasLive: false,
            isYou: true,
          }] : []),
          ...mappedFeedStories,
        ]);
      } catch (error) {
        console.log("Data fetch error:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchAll();
  }, [userData]);
  // ─────────────────────────────────────────────────────────

  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [searchMsg, setSearchMsg] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showStories, setShowStories] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const lastScrollY = useRef(0);
  const headerRef = useRef(null);

  const userStories = storiesData.filter((s) => s.isYou);
  const unreadMessages = messages.filter(m => m.unread > 0).length;

  const handleNewStory = async ({ media, type }) => {
    try {
      const mediaType = String(type || "").startsWith("video") ? "video" : "image";
      const response = await axios.post(`${serverUrl}/api/story`, {
        media,
        mediaType,
      }, { withCredentials: true });

      const createdStory = response?.data?.story;
      if (createdStory) {
        const mappedStory = mapStoryForUi(createdStory);
        setStoriesData((prev) => [mappedStory, ...prev.filter((s) => s.id !== mappedStory.id)]);
      }
      setShowStories(true);
      setShowAddStory(false);
    } catch (error) {
      console.log("Story upload failed:", error);
    }
  };

  const toggleLike = useCallback((id) => setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const toggleSave = useCallback((id) => setSavedPosts((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const toggleFollow = useCallback(async (id) => {
    const target = suggested.find((u) => u._id === id);
    if (!target) return;
    const shouldUnfollow = !!target.following;
    try {
      await axios.post(
        `${serverUrl}/api/user/${id}/${shouldUnfollow ? "unfollow" : "follow"}`,
        {},
        { withCredentials: true }
      );

      setSuggested((prev) =>
        prev.map((u) => (u._id === id ? { ...u, following: !shouldUnfollow } : u))
      );

      const previousFollowing = Array.isArray(userData?.following)
        ? userData.following.map((fid) => String(fid))
        : [];
      const nextFollowing = shouldUnfollow
        ? previousFollowing.filter((fid) => fid !== String(id))
        : [...new Set([...previousFollowing, String(id)])];
      dispatch(setUserData({ ...(userData || {}), following: nextFollowing }));
    } catch (error) {
      console.log("Follow toggle failed:", error);
    }
  }, [dispatch, suggested, userData]);

  const conversations = useMemo(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      return messages.map((m) => ({
        id: m.id || m._id || m.userId || m.username,
        username: m.username || m.name || "user",
        name: m.name || m.username || "User",
        unread: m.unread || 0,
        online: !!m.online,
        lastMessage: m.lastMessage || "",
        time: m.time || "",
      }));
    }
    return suggested.map((u) => ({
      id: u._id,
      username: u.username,
      name: u.name || u.username,
      unread: 0,
      online: false,
      lastMessage: "",
      time: "",
    }));
  }, [messages, suggested]);

  const filteredMessages = useMemo(() => {
    const query = searchMsg.toLowerCase();
    return conversations.filter((m) =>
      m.username?.toLowerCase().includes(query) ||
      m.name?.toLowerCase().includes(query) ||
      m.lastMessage?.toLowerCase().includes(query)
    );
  }, [searchMsg, conversations]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollTop(currentScrollY > 400);
      setIsHeaderVisible(!(currentScrollY > lastScrollY.current && currentScrollY > 100));
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowChat(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); setShowCreate(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === 't') { e.preventDefault(); toggleTheme(); }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleTheme]);

  const currentTheme = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      <div className={`min-h-screen bg-gradient-to-b ${currentTheme.bg} ${currentTheme.text} selection:bg-rose-500/30 transition-colors duration-300`}>
        <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.15),transparent_50%)] ${theme === 'dark' ? 'opacity-100' : 'opacity-30'}`} />
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.1),transparent_50%)] ${theme === 'dark' ? 'opacity-100' : 'opacity-20'}`} />
          {theme === 'light' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_70%)]" />}
        </div>

        {/* Header */}
        <motion.header ref={headerRef} initial={{ y: 0 }} animate={{ y: isHeaderVisible ? 0 : -100 }} transition={{ duration: 0.3 }}
          className={`fixed top-0 inset-x-0 z-50 ${currentTheme.bgSecondary} backdrop-blur-xl border-b ${currentTheme.border} px-4 sm:px-6 py-3 flex items-center justify-between transition-colors duration-300`}>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentTheme.gradient.primary} flex items-center justify-center shadow-lg shadow-rose-600/20`}>
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className={`text-xl font-black tracking-tight bg-gradient-to-r ${theme === 'dark' ? 'from-white to-zinc-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent hidden sm:block`}>Atlas</span>
          </motion.div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.gradient.primary} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`} />
              <div className="relative flex items-center">
                <svg className={`absolute left-4 w-4 h-4 ${currentTheme.textTertiary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search..."
                  className={`w-full ${currentTheme.inputBg} border ${currentTheme.inputBorder} rounded-2xl pl-10 pr-4 py-2.5 text-sm ${currentTheme.text} focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all`} />
                <kbd className={`absolute right-3 hidden sm:flex items-center gap-1 px-2 py-1 text-xs ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-200 text-gray-600'} rounded-md`}><span>⌘</span>K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleTheme}
              className={`p-2.5 ${currentTheme.iconColor} ${currentTheme.iconHover} ${currentTheme.cardBgHover} rounded-2xl transition-all`}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowChat(!showChat)}
              className={`relative p-2.5 ${currentTheme.iconColor} ${currentTheme.iconHover} ${currentTheme.cardBgHover} rounded-2xl transition-all`}>
              <MessageIcon />
              {unreadMessages > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className={`absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r ${currentTheme.gradient.primary} rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1 border-2 ${theme === 'dark' ? 'border-black' : 'border-white'}`}>
                  {unreadMessages}
                </motion.span>
              )}
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`relative p-2.5 ${currentTheme.iconColor} ${currentTheme.iconHover} ${currentTheme.cardBgHover} rounded-2xl transition-all hidden sm:block`}>
              <HeartIcon filled={false} size="w-5 h-5" />
              <span className={`absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[8px] flex items-center justify-center text-white border-2 ${theme === 'dark' ? 'border-black' : 'border-white'}`}>3</span>
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCreate(true)} className="relative group hidden sm:block">
              <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.gradient.primary} rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity`} />
              <div className={`relative px-5 py-2.5 bg-gradient-to-r ${currentTheme.gradient.primary} rounded-full text-sm font-semibold flex items-center gap-2 text-white`}>
                <CreateIcon /><span>Create</span>
              </div>
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCreate(true)}
              className={`sm:hidden p-2.5 ${currentTheme.iconColor} ${currentTheme.iconHover} ${currentTheme.cardBgHover} rounded-2xl transition-all`}>
              <CreateIcon />
            </motion.button>
          </div>
        </motion.header>

        {/* Main Layout */}
        <div className="relative pt-16 pb-28 sm:pb-24 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {dataLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex gap-4 lg:gap-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-20">
                  <LeftHome userData={userData} suggested={suggested} toggleFollow={toggleFollow} activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
                </div>
              </motion.div>

              <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-2xl mx-auto w-full">
                <Feed posts={posts} stories={storiesData} likedPosts={likedPosts} savedPosts={savedPosts}
                  toggleLike={toggleLike} toggleSave={toggleSave} theme={theme}
                  onYourStoryClick={() => { if (userStories.length > 0) setShowStories(true); else setShowAddStory(true); }} />
                {posts.length === 0 && (
                  <div className={`text-center -mt-4 py-8 ${currentTheme.textSecondary}`}>
                    <p className="text-lg font-semibold">No posts yet</p>
                    <p className="text-sm mt-1">Follow some users to see their posts here</p>
                  </div>
                )}
              </motion.main>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden xl:block w-80 flex-shrink-0">
                <div className="sticky top-20">
                  <RightHome searchMsg={searchMsg} setSearchMsg={setSearchMsg} filteredMessages={filteredMessages} theme={theme} />
                </div>
              </motion.div>
            </div>
          )}
        </div>

        <StoryHeader
          onAdd={() => setShowAddStory(true)}
          stories={userStories}
          username={userData?.username || "Your Story"}
          userAvatar={userData?.profileImage || userData?.avatar || null}
          theme={theme}
        />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} hidden={showStories} />

        <AnimatePresence>
          {showScrollTop && (
            <motion.button initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`fixed bottom-24 lg:bottom-10 right-5 lg:right-10 z-50 p-3.5 bg-gradient-to-r ${currentTheme.gradient.primary} text-white rounded-2xl shadow-2xl shadow-rose-600/30`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showChat && (
            <ChatModal
              isOpen={showChat}
              onClose={() => setShowChat(false)}
              currentUser={{ id: userData?._id || "me", username: userData?.username || "You", avatar: userData?.profileImage || null }}
              conversations={filteredMessages}
              messages={chatMessages}
              onSendMessage={(userId, content) => {
                if (!content?.trim()) return;
                setChatMessages((prev) => ({
                  ...prev,
                  [userId]: [
                    ...(prev[userId] || []),
                    { id: Date.now(), sender: userData?._id || "me", text: content, timestamp: new Date().toISOString(), status: "sent" },
                  ],
                }));
              }}
              isDarkMode={theme === "dark"}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showCreate && <CreateModal isOpen={showCreate} onClose={() => setShowCreate(false)} theme={theme} />}
        </AnimatePresence>
        <AnimatePresence>
          {showStories && <StoriesViewer isOpen={showStories} onClose={() => setShowStories(false)} stories={userStories} initialStoryIndex={0} theme={theme} />}
        </AnimatePresence>
        <AnimatePresence>
          {showAddStory && <AddStoryModal isOpen={showAddStory} onClose={() => setShowAddStory(false)} onUpload={handleNewStory} theme={theme} />}
        </AnimatePresence>

        <div className="fixed bottom-4 left-4 z-50 hidden lg:block">
          <div className={`px-3 py-2 ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white/70 border-gray-200'} backdrop-blur-sm border rounded-xl text-xs ${currentTheme.textSecondary}`}>
            <span className="flex items-center gap-2">
              {[['⌘K', 'Messages'], ['⌘N', 'Create'], ['⌘T', 'Theme']].map(([key, label], i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-current opacity-30">●</span>}
                  <span className={`px-1.5 py-0.5 ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-200 text-gray-600'} rounded`}>{key}</span>
                  <span>{label}</span>
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" strokeWidth={2} />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeWidth={2} />
  </svg>
);
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeWidth={2} />
  </svg>
);
const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const CreateIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
  </svg>
);
