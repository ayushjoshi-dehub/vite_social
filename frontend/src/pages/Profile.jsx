import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from '../components/Avatar';
import {
  Settings,
  Grid3x3,
  Film,
  Bookmark,
  LogOut,
  ChevronLeft,
  MoreHorizontal,
  Camera,
  Edit3,
  Heart,
  MessageCircle,
  Share2,
  Play,
  X,
  Lock,
  Bell,
  Shield,
  HelpCircle,
  Info,
  FileText,
  ChevronRight,
  User,
  Mail,
  MapPin,
  Calendar,
  Link2,
  CheckCircle,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { setUserData } from '../redux/userSlice';
import BottomNav from '../components/BottomNav';

const serverUrl = "http://localhost:8000";

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useParams();
  const { userData } = useSelector((state) => state.user) || {};
  const isOwnProfile = !username || username === userData?.username;
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const userRes = isOwnProfile
          ? await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
          : await axios.get(`${serverUrl}/api/user/profile/${username}`, { withCredentials: true });

        const currentUser = userRes?.data?.user || userRes?.data;
        if (currentUser) {
          setProfileUser(currentUser);
          if (isOwnProfile && (currentUser?._id !== userData?._id || currentUser?.username !== userData?.username)) {
            dispatch(setUserData(currentUser));
          }
          setEditName(currentUser.name || '');
          setEditUsername(currentUser.username || '');
          setBio(currentUser.bio || '');
          setFollowers(Array.isArray(currentUser.followers) ? currentUser.followers.length : 0);
          setFollowing(Array.isArray(currentUser.following) ? currentUser.following.length : 0);
          setIsFollowing(Array.isArray(userData?.following) ? userData.following.map(String).includes(String(currentUser._id)) : false);
          const postsRes = await axios.get(`${serverUrl}/api/post/user/${currentUser._id}`, { withCredentials: true });
          const ownPosts = postsRes?.data?.posts || [];

          setPosts(
            ownPosts
              .filter((p) => p.mediaType !== 'video')
              .map((p) => ({
                id: p._id,
                user: {
                  username: p.author?.username || currentUser?.username || 'you',
                  verified: !!p.author?.verified,
                },
                image: p.media,
                caption: p.caption || '',
                location: p.location || '',
                likes: Array.isArray(p.likes) ? p.likes.length : Number(p.likes || 0),
                comments: Array.isArray(p.comments) ? p.comments.length : Number(p.comments || 0),
                time: 'now',
              }))
          );

          setReels(
            ownPosts
              .filter((p) => p.mediaType === 'video')
              .map((p) => ({
                id: p._id,
                user: { username: p.author?.username || currentUser?.username || 'you', verified: !!p.author?.verified },
                likes: Array.isArray(p.likes) ? p.likes.length : Number(p.likes || 0),
                caption: p.caption || '',
                duration: '30',
                views: '0',
                comments: Array.isArray(p.comments) ? p.comments.length : Number(p.comments || 0),
              }))
          );
        }

        setSavedPosts([]);
      } catch (error) {
        console.log('Profile load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [dispatch, isOwnProfile, username, userData?._id, userData?.username, userData?.following]);

  const handleLogout = () => {
    dispatch(setUserData(null));
    navigate('/signin');
  };

  const handleSaveProfile = async () => {
    if (!isOwnProfile) return;
    try {
      const res = await axios.put(`${serverUrl}/api/user/profile`, {
        name: editName,
        username: editUsername,
      }, { withCredentials: true });
      const updatedUser = res?.data?.user;
      if (updatedUser) {
        dispatch(setUserData(updatedUser));
      }
      setIsEditing(false);
    } catch (error) {
      console.log('Profile update failed:', error);
    }
  };

  const handleFollow = () => {
    if (isOwnProfile || !profileUser?._id) return;
    const nextFollow = !isFollowing;
    axios
      .post(`${serverUrl}/api/user/${profileUser._id}/${isFollowing ? 'unfollow' : 'follow'}`, {}, { withCredentials: true })
      .then(() => {
        setIsFollowing(nextFollow);
        setFollowers((prev) => (nextFollow ? prev + 1 : Math.max(prev - 1, 0)));
      })
      .catch((error) => console.log('Profile follow toggle failed:', error));
  };

  const stats = [
    { label: 'Posts', value: posts.length + reels.length },
    { label: 'Followers', value: followers.toLocaleString() },
    { label: 'Following', value: following.toLocaleString() },
  ];

  const tabs = [
    { id: 'posts', icon: Grid3x3, label: 'Posts', count: posts.length },
    { id: 'reels', icon: Film, label: 'Reels', count: reels.length },
    { id: 'saved', icon: Bookmark, label: 'Saved', count: savedPosts.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0D0D0D] to-black text-white selection:bg-rose-500/30">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Profile
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-20 pb-24 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden mb-20 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-purple-500/20 border border-white/5">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Camera button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-xl hover:bg-black/70 transition border border-white/10"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Profile Avatar - Positioned to overlap cover */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-16">
            <div className="relative">
              <Avatar
                name={profileUser?.username || userData?.username || 'User'}
                size="w-32 h-32"
                verified
                hasStory
                theme="dark"
              />
              
              {/* Edit avatar button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 p-2 bg-rose-500 rounded-full shadow-lg hover:bg-rose-600 transition border-2 border-black"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {profileUser?.username || userData?.username || 'Your Name'}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">@{profileUser?.username || userData?.username || 'username'}</p>
            
            {/* Bio with edit capability */}
            {isEditing ? (
              <div className="max-w-md mx-auto mt-4">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full mb-2 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  placeholder="Name"
                />
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full mb-2 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  placeholder="Username"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  rows="3"
                  placeholder="Tell your story..."
                />
                <div className="flex gap-2 mt-2 justify-center">
                  <button
                    onClick={handleSaveProfile}
                    className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-rose-500/25 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 bg-zinc-800 rounded-lg text-sm font-semibold hover:bg-zinc-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-300 max-w-md mx-auto mt-4">
                {bio || profileUser?.name || userData?.name || ''}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 my-8 p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => isOwnProfile && setIsEditing(true)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transition-all flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {isOwnProfile ? 'Edit Profile' : 'View Profile'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFollow}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isFollowing
                  ? 'bg-zinc-800 hover:bg-zinc-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35'
              }`}
            >
              {isOwnProfile ? `${following.toLocaleString()} Following` : isFollowing ? 'Following' : 'Follow'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex justify-around mb-6 border-b border-white/10">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-4 relative transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon className="w-5 h-5" strokeWidth={activeTab === tab.id ? 2 : 1.5} />
                <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{tab.count}</span>
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'posts' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        onClick={() => setSelectedPost(post)}
                        className="relative aspect-square bg-gradient-to-br from-rose-500/10 to-indigo-500/10 rounded-xl border border-white/10 overflow-hidden cursor-pointer group"
                      >
                        {post.image ? (
                          <img 
                            src={post.image} 
                            alt={post.caption}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4 text-center">
                            <p className="text-sm text-zinc-300 line-clamp-3">{post.caption}</p>
                          </div>
                        )}
                        
                        {/* Overlay with stats */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div className="flex items-center gap-3 text-white">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 fill-rose-500 stroke-rose-500" />
                              <span className="text-xs">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs">{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'reels' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {reels.map((reel, index) => (
                      <motion.div
                        key={reel.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        className="relative aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10 overflow-hidden cursor-pointer group"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center relative">
                          <Play className="w-10 h-10 text-white/50 mb-2" fill="white" />
                          <p className="text-sm text-zinc-300 line-clamp-2">{reel.caption}</p>
                        </div>
                        
                        {/* Duration badge */}
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold border border-white/10">
                          {reel.duration}s
                        </div>
                        
                        {/* Stats overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div className="flex items-center gap-3 text-white">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 fill-rose-500 stroke-rose-500" />
                              <span className="text-xs">{reel.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              <span className="text-xs">{reel.views}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'saved' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {savedPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-square bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-white/10 overflow-hidden group"
                      >
                        <div className="w-full h-full flex items-center justify-center p-4 text-center">
                          <div>
                            <p className="text-sm text-zinc-300 line-clamp-2">{post.caption}</p>
                            <p className="text-xs text-zinc-500 mt-2">{post.location}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Bookmark className="w-4 h-4 fill-white stroke-white" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty State */}
          {!loading && activeTab === 'posts' && posts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
              <p className="text-zinc-400 text-sm mb-6">Share your first moment with the world</p>
              <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all">
                Create Your First Post
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Post Preview Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar 
                    name={selectedPost.user.username} 
                    size="w-10 h-10" 
                    verified={selectedPost.user.verified}
                  />
                  <div>
                    <p className="font-semibold">{selectedPost.user.username}</p>
                    <p className="text-xs text-zinc-500">{selectedPost.location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="p-2 hover:bg-zinc-800 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="aspect-square bg-gradient-to-br from-rose-500/10 to-indigo-500/10 flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-lg mb-4">{selectedPost.caption}</p>
                  <p className="text-sm text-zinc-400">{selectedPost.time} ago</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center justify-around mb-4">
                  <div className="flex items-center gap-2 text-rose-500">
                    <Heart className="w-6 h-6 fill-rose-500 stroke-rose-500" />
                    <span className="font-semibold">{selectedPost.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-semibold">{selectedPost.comments}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Share2 className="w-6 h-6" />
                    <span className="font-semibold">0</span>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-bold">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-zinc-800 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  {[
                    { icon: Lock, label: 'Account Privacy' },
                    { icon: Bell, label: 'Notifications' },
                    { icon: Shield, label: 'Security' },
                    { icon: HelpCircle, label: 'Help' },
                    { icon: Info, label: 'About' },
                    { icon: FileText, label: 'Terms & Privacy' }
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-800 rounded-xl transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition" />
                        <span className="text-sm">{label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-semibold hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
