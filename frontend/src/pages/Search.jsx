import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config';

const serverUrl = API_BASE_URL.replace(/\/api$/, "");

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const Avatar = ({ name = "?", src, size = "w-12 h-12" }) => {
  const colors = ["bg-rose-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-purple-500","bg-cyan-500"];
  const color = colors[(name.charCodeAt(0) || 0) % colors.length];
  return src
    ? <img src={src} alt={name} className={`${size} rounded-full object-cover`} />
    : <div className={`${size} rounded-full ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{name[0]?.toUpperCase()}</div>;
};

// Gradient placeholder for explore grid
const gradients = [
  "from-rose-500 to-pink-700",
  "from-blue-500 to-indigo-700",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-700",
  "from-purple-500 to-violet-700",
  "from-cyan-500 to-blue-700",
  "from-fuchsia-500 to-pink-700",
  "from-lime-500 to-green-700",
  "from-red-500 to-rose-700",
];

export default function Search({ theme = "dark" }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user || {});
  const isLight = theme === "light";
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [followed, setFollowed] = useState({});
  const [explorePosts, setExplorePosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all | users | posts
  const debounceRef = useRef(null);

  // Fetch explore posts on mount
  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/post`, { withCredentials: true });
        const posts = res?.data?.posts || [];
        setExplorePosts(posts.map((p, i) => ({
          _id: p._id,
          image: p.mediaType === "image" ? p.media : null,
          gradient: gradients[i % gradients.length],
          likes: Array.isArray(p.likes) ? p.likes.length : Number(p.likes || 0),
          user: { username: p.author?.username || "user" },
        })));
      } catch {
        // Placeholder explore grid
        setExplorePosts(Array.from({ length: 12 }, (_, i) => ({
          _id: String(i),
          gradient: gradients[i % gradients.length],
          likes: Math.floor(Math.random() * 5000),
          user: { username: ["aditya123","ankush_","gopal__","ayush_dev","priya_28"][i % 5] },
        })));
      }
    };
    fetchExplore();
  }, []);

  // Debounced search
  const handleSearch = useCallback((value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (!value.trim()) { setResults([]); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/search?q=${encodeURIComponent(value)}`, { withCredentials: true });
        const followingSet = new Set((userData?.following || []).map((id) => String(id)));
        const mapped = (res.data || []).map((u) => ({ ...u, following: followingSet.has(String(u._id)) }));
        setResults(mapped);
        setFollowed((prev) => ({
          ...prev,
          ...Object.fromEntries(mapped.map((u) => [u._id, !!u.following])),
        }));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [userData?.following]);

  const toggleFollow = async (id) => {
    const current = followed[id] ?? results.find((u) => u._id === id)?.following ?? false;
    try {
      await axios.post(`${serverUrl}/api/user/${id}/${current ? 'unfollow' : 'follow'}`, {}, { withCredentials: true });
      setFollowed((f) => ({ ...f, [id]: !current }));
      setResults((prev) => prev.map((u) => (u._id === id ? { ...u, following: !current } : u)));
    } catch (error) {
      console.log('Search follow toggle failed:', error);
    }
  };

  const filteredResults = activeTab === 'users'
    ? results.filter(r => r.username)
    : results;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-gray-50 text-gray-900' : 'bg-[#030303] text-white'} selection:bg-rose-500/30 transition-colors duration-300`}>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.05),transparent_50%)] pointer-events-none" />

      {/* Header */}
      <motion.header initial={{ y: -80 }} animate={{ y: 0 }}
        className={`fixed top-0 inset-x-0 z-50 ${isLight ? 'bg-white/90 border-gray-200' : 'bg-black/80 border-zinc-800/50'} backdrop-blur-xl border-b px-4 sm:px-6 py-3 transition-colors duration-300`}>
        <div className="max-w-3xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}>
              {searching
                ? <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                : <SearchIcon />
              }
            </div>
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users..."
              autoComplete="off"
              className={`w-full ${isLight ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-rose-400' : 'bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700'} border rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all`}
            />
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); }}
                className={`absolute inset-y-0 right-0 pr-4 flex items-center ${isLight ? 'text-gray-400 hover:text-gray-700' : 'text-zinc-500 hover:text-white'} transition-colors`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="pt-20 pb-24 max-w-3xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {query ? (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {['all', 'users'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-rose-500 text-white'
                        : isLight ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {filteredResults.length === 0 && !searching ? (
                <div className={`text-center py-16 ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}>
                  <p className="text-lg font-semibold mb-1">No results found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResults.map((user, i) => (
                    <motion.div key={user._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-900/50'} cursor-pointer`}
                      onClick={() => navigate(`/profile/${user.username}`)}>
                      <div className="flex items-center gap-3">
                        <Avatar name={user.username} src={user.profileImage} size="w-12 h-12" />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className={`font-bold text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>{user.username}</span>
                            {user.verified && <VerifiedIcon />}
                          </div>
                          <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-zinc-500'}`}>{user.name}</p>
                          {user.followers?.length > 0 && (
                            <p className={`text-[10px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-zinc-600'}`}>
                              {user.followers.length.toLocaleString()} followers
                            </p>
                          )}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleFollow(user._id); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          (followed[user._id] ?? user.following)
                            ? isLight ? 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-400' : 'border-zinc-700 text-zinc-400 hover:border-red-500 hover:text-red-400'
                            : 'border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white'
                        }`}>
                        {(followed[user._id] ?? user.following) ? 'Following' : 'Follow'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
              <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}>Explore</p>

              {/* Mosaic Grid */}
              <div className="grid grid-cols-3 gap-1">
                {explorePosts.map((post, i) => {
                  // Every 7th item is large (spans 2 cols + 2 rows)
                  const isFeatured = i % 7 === 0;
                  return (
                    <motion.div
                      key={post._id || i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 0.98, zIndex: 10 }}
                      className={`relative overflow-hidden rounded-lg cursor-pointer group ${isFeatured ? 'col-span-2 row-span-2' : ''}`}
                      style={{ aspectRatio: isFeatured ? '1/1' : '1/1' }}
                    >
                      {post.image ? (
                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${post.gradient || gradients[i % gradients.length]} flex items-center justify-center`}>
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                          <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3 text-white font-bold text-sm">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            {post.likes?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav theme={theme} />
    </div>
  );
}
