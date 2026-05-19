import React, { memo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';
import { 
  HeartIcon, 
  CommentIcon, 
  ShareIcon, 
  BookmarkIcon, 
  MoreIcon,
  PlayIcon,
  PauseIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  EmojiIcon,
  VerifiedIcon,
  LiveIcon,
  AddIcon
} from './Icons';

// Story Item Component
const StoryItem = memo(({ story, isLight, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="flex flex-col items-center gap-2 snap-center cursor-pointer min-w-[72px] relative group"
    >
      {/* Story Ring with Pulse Animation */}
      <div className="relative">
        {!story.viewed && !story.isYou && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-3px] rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 opacity-75"
          />
        )}
        
        <Avatar 
          name={story.username} 
          src={story.avatar}
          size="w-16 h-16" 
          hasStory={!story.viewed} 
          isLive={story.hasLive}
          isYourStory={story.isYou}
          storyViewed={story.viewed}
          theme={isLight ? 'light' : 'dark'}
        />
        
        {/* Live Badge */}
        {story.hasLive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-rose-500 rounded-full text-[8px] font-bold text-white whitespace-nowrap border border-white/20"
          >
            LIVE
          </motion.div>
        )}
      </div>
      
      {/* Username with gradient on hover */}
      <motion.span 
        animate={{ color: isHovered ? '#f43f5e' : isLight ? '#6b7280' : '#a1a1aa' }}
        className="text-[11px] font-medium truncate w-full text-center transition-colors"
      >
        {story.isYou ? 'Your Story' : story.username}
      </motion.span>
      
      {/* New Story Indicator */}
      {!story.viewed && !story.isYou && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-black"
        />
      )}
    </motion.div>
  );
});

// Post Actions Component
const PostActions = memo(({ post, liked, saved, onLike, onSave, isLight }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-5">
        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onLike}
          className="relative group"
        >
          <HeartIcon 
            filled={liked} 
            size="w-7 h-7"
            className={liked ? 'text-rose-500' : isLight ? 'text-gray-600' : 'text-zinc-400'}
          />
          {liked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 0] }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-50"
            />
          )}
        </motion.button>

        {/* Comment Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className={`transition-colors relative group ${
            isLight ? 'text-gray-600 hover:text-gray-900' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <CommentIcon size="w-7 h-7" />
          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-zinc-800 text-white text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {post.comments}
          </span>
        </motion.button>

        {/* Share Button with Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={`transition-colors ${
              isLight ? 'text-gray-600 hover:text-gray-900' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShareIcon size="w-7 h-7" />
          </motion.button>
          
          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute bottom-full mb-2 left-0 p-2 rounded-xl shadow-xl z-10 ${
                  isLight ? 'bg-white border border-gray-200' : 'bg-zinc-800 border border-zinc-700'
                }`}
              >
                <div className="flex gap-2">
                  {['📱', '💬', '📧', '🔗'].map((emoji, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      className="p-2 hover:bg-zinc-700 rounded-lg"
                    >
                      <span className="text-lg">{emoji}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSave}
        className="relative"
      >
        <BookmarkIcon 
          filled={saved} 
          className={saved ? 'text-white' : isLight ? 'text-gray-600' : 'text-zinc-400'}
        />
        {saved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 0] }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-white rounded-full blur-xl opacity-30"
          />
        )}
      </motion.button>
    </div>
  );
});

// Comment Input Component
const CommentInput = memo(({ isLight, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit?.(comment);
      setComment('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className={`w-full px-4 py-2.5 pr-10 text-sm rounded-xl transition-all ${
              isLight
                ? 'bg-gray-100 border border-gray-200 focus:bg-white focus:border-rose-300'
                : 'bg-zinc-800/50 border border-zinc-700 focus:bg-zinc-800 focus:border-rose-500/50'
            } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
          />
          
          {/* Emoji Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowEmoji(!showEmoji)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isLight ? 'text-gray-400' : 'text-zinc-500'
            } hover:text-rose-500 transition-colors`}
          >
            <EmojiIcon />
          </motion.button>
        </div>
        
        {/* Post Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!comment.trim()}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            comment.trim()
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25'
              : isLight
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          Post
        </motion.button>
      </div>
      
      {/* Emoji Picker (simplified) */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-full mb-2 left-0 p-2 rounded-xl shadow-xl ${
              isLight ? 'bg-white border border-gray-200' : 'bg-zinc-800 border border-zinc-700'
            }`}
          >
            <div className="grid grid-cols-8 gap-1">
              {['😊', '😂', '❤️', '👍', '🔥', '✨', '🎉', '😢', '👏', '🙌', '💯', '✅'].map((emoji, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setComment(prev => prev + emoji)}
                  className="p-1.5 hover:bg-zinc-700 rounded-lg text-lg"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
});

// Main Feed Component
const Feed = memo(({ 
  posts, 
  stories, 
  likedPosts, 
  savedPosts, 
  toggleLike, 
  toggleSave, 
  onYourStoryClick,
  onComment,
  theme = "dark" 
}) => {
  const isLight = theme === "light";
  const [activePost, setActivePost] = useState(null);
  const feedRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  return (
    <motion.main 
      ref={feedRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 max-w-150 w-full mx-auto px-4 sm:px-0"
    >
      {/* Stories Tray */}
      <div className="mb-6">
        <motion.div 
          className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none' }}
        >
          {stories.map((story) => (
            <StoryItem
              key={story.id}
              story={story}
              isLight={isLight}
              onClick={story.isYou ? onYourStoryClick : undefined}
            />
          ))}
        </motion.div>
      </div>

      {/* Posts */}
      <motion.div 
        variants={containerVariants}
        className="space-y-6"
      >
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className={`
              relative rounded-3xl overflow-hidden backdrop-blur-sm 
              transition-all duration-300 hover:shadow-2xl
              ${isLight 
                ? 'bg-white/80 border border-gray-200/60 shadow-lg hover:shadow-rose-500/10' 
                : 'bg-zinc-900/40 border border-zinc-800/50 shadow-xl hover:shadow-rose-500/5'
              }
            `}
          >
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none" />

            {/* Post Header */}
            <div className="relative flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar 
                  name={post.user.username} 
                  src={post.user.avatar}
                  size="w-10 h-10" 
                  verified={post.user.verified}
                  hasStory
                  theme={theme}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {post.user.username}
                    </h4>
                    {post.user.verified && (
                      <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <VerifiedIcon />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`text-[11px] ${isLight ? 'text-gray-500' : 'text-zinc-500'}`}>
                      {post.location}
                    </p>
                    <span className={`w-1 h-1 rounded-full ${isLight ? 'bg-gray-300' : 'bg-zinc-700'}`} />
                    <p className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-zinc-600'}`}>
                      {post.time}
                    </p>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-xl transition-all ${
                  isLight 
                    ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <MoreIcon />
              </motion.button>
            </div>

            {/* Post Media with Double-tap to Like */}
            <div className="relative aspect-square group">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div
                  className={`w-full h-full ${
                    isLight 
                      ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
                      : 'bg-gradient-to-br from-zinc-800 to-zinc-900'
                  }`}
                >
                  {/* Animated Grid Pattern */}
                  <div 
                    className="w-full h-full opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, ${isLight ? '#9ca3af' : '#52525b'} 1px, transparent 0)`,
                      backgroundSize: '40px 40px'
                    }}
                  />
                </div>
              )}

              {/* Hover Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/30 flex items-center justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-2 text-white">
                  <HeartIcon filled size="w-8 h-8" />
                  <span className="text-lg font-bold">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CommentIcon size="w-8 h-8" />
                  <span className="text-lg font-bold">{post.comments}</span>
                </div>
              </motion.div>

              {/* Double-tap Heart Animation */}
              {activePost === post.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8 }}
                  onAnimationComplete={() => setActivePost(null)}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <HeartIcon filled size="w-24 h-24" className="text-rose-500" />
                </motion.div>
              )}
            </div>

            {/* Post Actions */}
            <div className="p-4 pt-3">
              <PostActions
                post={post}
                liked={likedPosts[post.id]}
                saved={savedPosts[post.id]}
                onLike={() => {
                  toggleLike(post.id);
                  setActivePost(post.id);
                }}
                onSave={() => toggleSave(post.id)}
                isLight={isLight}
              />

              {/* Likes Count */}
              <p className={`text-sm font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {(post.likes + (likedPosts[post.id] ? 1 : 0)).toLocaleString()} likes
              </p>

              {/* Caption */}
              <div className="space-y-1">
                <p className="text-sm leading-relaxed">
                  <span className={`font-bold mr-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    {post.user.username}
                  </span>
                  <span className={isLight ? 'text-gray-600' : 'text-zinc-300'}>
                    {post.caption}
                  </span>
                </p>

                {/* View Comments Link */}
                {post.comments > 0 && (
                  <button className={`text-xs font-medium ${isLight ? 'text-gray-500' : 'text-zinc-500'} hover:${isLight ? 'text-gray-700' : 'text-zinc-400'} transition-colors`}>
                    View all {post.comments} comments
                  </button>
                )}
              </div>

              {/* Comment Input */}
              <div className="mt-4">
                <CommentInput 
                  isLight={isLight}
                  onSubmit={(comment) => onComment?.(post.id, comment)}
                />
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* End of Feed Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8"
      >
        <p className={`text-sm ${isLight ? 'text-gray-400' : 'text-zinc-600'}`}>
          You're all caught up! ✨
        </p>
      </motion.div>
    </motion.main>
  );
});

// Add display name for better debugging
Feed.displayName = 'Feed';
StoryItem.displayName = 'StoryItem';
PostActions.displayName = 'PostActions';
CommentInput.displayName = 'CommentInput';

export default Feed;
