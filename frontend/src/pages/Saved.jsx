import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon,
  BookmarkIcon,
  GridIcon,
  ListIcon,
  FilterIcon,
  SearchIcon
} from '../components/Icons';
import BottomNav from '../components/BottomNav';

export default function Saved() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');

  // Mock saved posts
  const savedPosts = [
    { id: 1, caption: 'Beautiful sunset 🌅', location: 'Beach', likes: 1234, saved: true, image: null },
    { id: 2, caption: 'Coffee time ☕️', location: 'Cafe', likes: 892, saved: true, image: null },
    { id: 3, caption: 'Travel goals ✈️', location: 'Paris', likes: 2341, saved: true, image: null },
    { id: 4, caption: 'Foodie heaven 🍜', location: 'Tokyo', likes: 1567, saved: true, image: null },
    { id: 5, caption: 'Art gallery 🎨', location: 'NYC', likes: 945, saved: true, image: null },
    { id: 6, caption: 'Workout 💪', location: 'Gym', likes: 678, saved: true, image: null },
  ];

  // Collections
  const collections = [
    { id: 'all', name: 'All Posts', count: savedPosts.length },
    { id: 'travel', name: 'Travel', count: 8 },
    { id: 'food', name: 'Food', count: 5 },
    { id: 'fitness', name: 'Fitness', count: 3 },
    { id: 'art', name: 'Art', count: 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0D0D0D] to-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.15),transparent_50%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Saved
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition ${
                viewMode === 'grid' ? 'bg-rose-500 text-white' : 'hover:bg-white/10'
              }`}
            >
              <GridIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition ${
                viewMode === 'list' ? 'bg-rose-500 text-white' : 'hover:bg-white/10'
              }`}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="pt-20 pb-24 max-w-4xl mx-auto px-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-zinc-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved posts..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition"
          />
        </div>

        {/* Collections */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedCollection === collection.id
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                  : 'bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {collection.name} ({collection.count})
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-zinc-400">
            {savedPosts.length} saved posts
          </p>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm hover:bg-zinc-800 transition">
            <FilterIcon className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Posts Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {savedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-square bg-gradient-to-br from-rose-500/10 to-indigo-500/10 rounded-xl border border-zinc-800 overflow-hidden group cursor-pointer"
                >
                  <div className="w-full h-full flex items-center justify-center p-4 text-center">
                    <p className="text-sm text-zinc-300 line-clamp-3">{post.caption}</p>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div className="flex items-center gap-3 text-white">
                      <div className="flex items-center gap-1">
                        <HeartIcon size={16} filled />
                        <span className="text-xs">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CommentIcon size={16} />
                        <span className="text-xs">24</span>
                      </div>
                    </div>
                  </div>

                  {/* Saved indicator */}
                  <div className="absolute top-2 right-2">
                    <BookmarkIcon filled className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {savedPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4 hover:bg-zinc-800/50 transition cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center text-2xl">
                    📸
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium mb-1">{post.caption}</p>
                    <p className="text-xs text-zinc-500">{post.location}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <HeartIcon size={14} filled />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <CommentIcon size={14} />
                        <span>24</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 hover:bg-white/10 rounded-lg transition">
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {savedPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📌</div>
            <h3 className="text-xl font-semibold mb-2">No saved posts yet</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Save posts you want to come back to later
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-semibold"
            >
              Explore Posts
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
