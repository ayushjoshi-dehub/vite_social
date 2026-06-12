import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import { API_BASE_URL } from '../config';

// ── Icons ────────────────────────────────────────────────
const HeartIcon = ({ filled }) => (
  <svg className="w-7 h-7" fill={filled ? "#f43f5e" : "none"} stroke={filled ? "#f43f5e" : "white"} strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CommentIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const ShareIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
const BookmarkIcon = ({ filled }) => (
  <svg className="w-7 h-7" fill={filled ? "white" : "none"} stroke="white" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const MuteIcon = ({ muted }) => (
  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
    {muted
      ? <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
      : <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    }
  </svg>
);
const PlayIcon = () => (
  <svg className="w-16 h-16" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
);

// ── Avatar ───────────────────────────────────────────────
const Avatar = ({ name = "?", src, size = "w-10 h-10" }) => {
  const colors = ["bg-rose-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-purple-500","bg-cyan-500"];
  const color = colors[(name.charCodeAt(0) || 0) % colors.length];
  return src
    ? <img src={src} alt={name} className={`${size} rounded-full object-cover border-2 border-white/30`} />
    : <div className={`${size} rounded-full ${color} flex items-center justify-center text-white font-bold text-sm border-2 border-white/30 flex-shrink-0`}>{name[0]?.toUpperCase()}</div>;
};

// ── Single Reel ──────────────────────────────────────────
const ReelCard = ({ reel, isActive, theme }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(reel.likes || 0);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) { video.pause(); setPlaying(false); }
    else { video.play(); setPlaying(true); }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setLiked(true);
      setLikes(l => l + 1);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(l => { if (!l) setLikes(c => c + 1); else setLikes(c => c - 1); return !l; });
  };

  return (
    <div className="relative w-full h-screen flex-shrink-0 overflow-hidden bg-black snap-start snap-always">
      {/* Video / Placeholder */}
      {reel.video ? (
        <video
          ref={videoRef}
          src={reel.video}
          className="absolute inset-0 w-full h-full object-cover"
          loop playsInline muted={muted}
          onClick={handleDoubleTap}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${reel.gradientFrom || '#1a1a2e'} 0%, ${reel.gradientTo || '#16213e'} 50%, ${reel.gradientAccent || '#0f3460'} 100%)` }}
          onClick={handleDoubleTap}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <svg className="w-10 h-10 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
          </motion.div>
        </div>
      )}

      {/* Play/Pause overlay */}
      <div className="absolute inset-0" onClick={togglePlay}>
        <AnimatePresence>
          {!playing && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/40 rounded-full p-4 backdrop-blur-sm">
                <PlayIcon />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Double-tap heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.4, opacity: 1 }} exit={{ scale: 1.8, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-24 h-24" fill="#f43f5e" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Right Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-10">
        {/* Avatar */}
        <div className="relative">
          <Avatar name={reel.user?.username || reel.username || "?"} src={reel.user?.profileImage} size="w-12 h-12" />
          <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-black text-white text-xs font-bold">+</button>
        </div>

        {/* Like */}
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleLike} className="flex flex-col items-center gap-1">
          <HeartIcon filled={liked} />
          <span className="text-white text-xs font-semibold drop-shadow">{likes.toLocaleString()}</span>
        </motion.button>

        {/* Comment */}
        <motion.button whileTap={{ scale: 0.8 }} className="flex flex-col items-center gap-1">
          <CommentIcon />
          <span className="text-white text-xs font-semibold drop-shadow">{(reel.comments || 0).toLocaleString()}</span>
        </motion.button>

        {/* Save */}
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setSaved(s => !s)} className="flex flex-col items-center gap-1">
          <BookmarkIcon filled={saved} />
          <span className="text-white text-xs font-semibold drop-shadow">Save</span>
        </motion.button>

        {/* Share */}
        <motion.button whileTap={{ scale: 0.8 }} className="flex flex-col items-center gap-1">
          <ShareIcon />
          <span className="text-white text-xs font-semibold drop-shadow">Share</span>
        </motion.button>

        {/* Mute */}
        <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); setMuted(m => !m); }}
          className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center border border-white/20">
          <MuteIcon muted={muted} />
        </motion.button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-24 left-4 right-20 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-bold text-base drop-shadow">@{reel.user?.username || reel.username || "unknown"}</span>
          {reel.user?.verified && (
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          )}
        </div>
        <p className="text-white/90 text-sm leading-relaxed line-clamp-2 drop-shadow">{reel.caption || reel.description || ""}</p>
        {reel.song && (
          <div className="flex items-center gap-2 mt-2">
            <svg className="w-3 h-3 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            <span className="text-white/70 text-xs">{reel.song}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Reels Page ───────────────────────────────────────────
export default function Reels({ theme = "dark" }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const cardRefs = useRef([]);

  // Mock gradient colors for placeholder reels
  const gradients = [
    { from: '#1a1a2e', to: '#16213e', accent: '#0f3460' },
    { from: '#2d1b69', to: '#11998e', accent: '#38ef7d' },
    { from: '#fc4a1a', to: '#f7b733', accent: '#fc4a1a' },
    { from: '#0f0c29', to: '#302b63', accent: '#24243e' },
    { from: '#134e5e', to: '#71b280', accent: '#134e5e' },
  ];

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/post`, { withCredentials: true });
        const posts = res?.data?.posts || [];
        const videoReels = posts
          .filter((p) => p.mediaType === "video")
          .map((p, i) => ({
            _id: p._id,
            video: p.media,
            user: p.author,
            caption: p.caption,
            likes: Array.isArray(p.likes) ? p.likes.length : Number(p.likes || 0),
            comments: Array.isArray(p.comments) ? p.comments.length : Number(p.comments || 0),
            ...gradients[i % gradients.length],
          }));

        if (videoReels.length > 0) {
          setReels(videoReels);
        } else {
          setReels([]);
        }
      } catch (error) {
        // Fallback to placeholder reels if API not ready
        setReels([
          { id: 1, username: "aditya123", caption: "Check out this awesome view! 🌅", likes: 1234, comments: 89, song: "Blinding Lights - The Weeknd", ...gradients[0] },
          { id: 2, username: "theankush_", caption: "Living my best life ✨ #vibes #reels", likes: 567, comments: 34, song: "As It Was - Harry Styles", ...gradients[1] },
          { id: 3, username: "gopal_sahu", caption: "New day new energy 🔥", likes: 2891, comments: 156, song: "Levitating - Dua Lipa", ...gradients[2] },
          { id: 4, username: "ayush_dev", caption: "Code and chill 💻", likes: 445, comments: 22, song: "Stay - Kid LAROI", ...gradients[3] },
          { id: 5, username: "priya_28", caption: "Golden hour never misses 🌇", likes: 3210, comments: 201, song: "Heat Waves - Glass Animals", ...gradients[4] },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  // Intersection Observer to detect active reel
  useEffect(() => {
    if (!reels.length) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );
    cardRefs.current.forEach((ref) => { if (ref) observerRef.current.observe(ref); });
    return () => observerRef.current?.disconnect();
  }, [reels]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Scrollable Reel Feed */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, index) => (
          <div key={reel._id || reel.id} ref={(el) => (cardRefs.current[index] = el)}>
            <ReelCard reel={reel} isActive={index === activeIndex} theme={theme} />
          </div>
        ))}

        {/* End of reels */}
        <div className="h-screen bg-black flex flex-col items-center justify-center gap-4 snap-start">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-700">
            <svg className="w-8 h-8 text-zinc-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          </div>
          <p className="text-white font-bold text-lg">You're all caught up</p>
          <p className="text-zinc-500 text-sm">Check back later for more reels</p>
          <button
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-4 px-6 py-3 bg-white text-black font-bold rounded-full text-sm hover:bg-zinc-200 transition-colors"
          >
            Back to top
          </button>
        </div>
      </div>

      {/* Top Header overlay */}
      <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-4 pointer-events-none">
        <h1 className="text-white font-black text-xl tracking-tight drop-shadow-lg">Reels</h1>
        <div className="flex items-center gap-3 pointer-events-auto">
          <button className="text-white drop-shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          <button className="text-white drop-shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5">
        {reels.map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: i === activeIndex ? 20 : 4, opacity: i === activeIndex ? 1 : 0.3 }}
            className="w-1 rounded-full bg-white"
          />
        ))}
      </div>

      <BottomNav theme={theme} />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
