import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';
import { 
  AddIcon, 
  MoreIcon, 
  TrashIcon, 
  CloseIcon,
  EyeIcon,
  ArchiveIcon,
  ShareIcon,
  SettingsIcon
} from './Icons';

export default function StoryHeader({ 
  onAdd, 
  onViewStory, 
  onDeleteStory, 
  onArchiveStory,
  onShareStory,
  stories = [],
  userAvatar,
  username = "Your Story",
  theme = 'dark'
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archived'
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const isLight = theme === 'light';

  // Separate stories into active and archived
  const activeStories = stories.filter(s => !s.archived);
  const archivedStories = stories.filter(s => s.archived);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme styles
  const themeStyles = {
    dark: {
      bg: 'bg-zinc-900',
      border: 'border-zinc-800',
      hover: 'hover:bg-zinc-800',
      text: 'text-white',
      textSecondary: 'text-zinc-400',
      menuBg: 'bg-zinc-900',
      itemHover: 'hover:bg-zinc-800/50',
    },
    light: {
      bg: 'bg-white',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100',
      text: 'text-gray-900',
      textSecondary: 'text-gray-500',
      menuBg: 'bg-white',
      itemHover: 'hover:bg-gray-50',
    }
  };

  const styles = themeStyles[isLight ? 'light' : 'dark'];

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const storyDate = new Date(timestamp);
    const diffHours = Math.floor((now - storyDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffHours < 48) return 'Yesterday';
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div className="fixed top-[calc(env(safe-area-inset-top)+5rem)] right-3 sm:right-6 z-[60] flex items-center gap-3">
      {/* Add Story Button with Tooltip */}
      <div className="relative">
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onAdd?.();
            setShowTooltip(false);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`
            relative w-14 h-14 rounded-2xl
            bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500
            flex items-center justify-center
            shadow-xl shadow-rose-500/20
            hover:shadow-2xl hover:shadow-rose-500/30
            transition-all duration-300
            group
          `}
          title="Add new story"
        >
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 animate-ping opacity-50" />
          
          {/* Inner content */}
          <div className="relative w-full h-full rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <AddIcon size="w-6 h-6" className="text-white" />
          </div>

          {/* Unviewed stories indicator */}
          {activeStories.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-bold text-white">
              {activeStories.length}
            </span>
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-zinc-800 text-white text-xs rounded-full shadow-lg"
            >
              Add to your story
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Story Menu Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMenu(!showMenu)}
          className={`
            w-12 h-12 rounded-xl
            ${isLight ? 'bg-white border border-gray-200' : 'bg-zinc-800'}
            flex items-center justify-center
            shadow-lg hover:shadow-xl
            transition-all duration-300
          `}
        >
          <MoreIcon className={`w-5 h-5 ${isLight ? 'text-gray-700' : 'text-white'}`} />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`
                absolute right-0 mt-2 w-80
                ${styles.menuBg} ${styles.border}
                rounded-2xl shadow-2xl
                overflow-hidden z-50
              `}
            >
              {/* Header */}
              <div className={`p-4 border-b ${styles.border}`}>
                <div className="flex items-center gap-3">
                  <Avatar 
                    name={username}
                    src={userAvatar}
                    size="w-12 h-12"
                    hasStory={activeStories.length > 0}
                    theme={theme}
                  />
                  <div className="flex-1">
                    <h3 className={`font-semibold ${styles.text}`}>{username}</h3>
                    <p className={`text-xs ${styles.textSecondary}`}>
                      {activeStories.length} active stories
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMenu(false)}
                    className={`p-2 ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800'} rounded-xl transition`}
                  >
                    <CloseIcon className={`w-4 h-4 ${styles.textSecondary}`} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className={`flex border-b ${styles.border}`}>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`
                    flex-1 py-3 text-sm font-medium transition-colors relative
                    ${activeTab === 'active' 
                      ? isLight ? 'text-gray-900' : 'text-white'
                      : styles.textSecondary
                    }
                  `}
                >
                  Active
                  {activeTab === 'active' && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500`}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('archived')}
                  className={`
                    flex-1 py-3 text-sm font-medium transition-colors relative
                    ${activeTab === 'archived'
                      ? isLight ? 'text-gray-900' : 'text-white'
                      : styles.textSecondary
                    }
                  `}
                >
                  Archived
                  {activeTab === 'archived' && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500`}
                    />
                  )}
                </button>
              </div>

              {/* Stories List */}
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {activeTab === 'active' ? (
                  activeStories.length > 0 ? (
                    <div className="divide-y divide-zinc-800/50">
                      {activeStories.map((story) => (
                        <motion.div
                          key={story.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`
                            p-3 ${styles.itemHover} transition
                            flex items-center gap-3
                          `}
                        >
                          {/* Story thumbnail */}
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 overflow-hidden">
                              {story.media ? (
                                story.mediaType?.startsWith('video') ? (
                                  <video src={story.media} className="w-full h-full object-cover" />
                                ) : (
                                  <img src={story.media} alt="" className="w-full h-full object-cover" />
                                )
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl">
                                  📸
                                </div>
                              )}
                            </div>
                            {story.viewed && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black" />
                            )}
                          </div>

                          {/* Story info */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${styles.text} truncate`}>
                              {story.caption || 'Untitled Story'}
                            </p>
                            <p className={`text-xs ${styles.textSecondary}`}>
                              {formatTimestamp(story.timestamp)}
                              {story.views && ` • ${story.views} views`}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                onViewStory?.(story.id);
                                setShowMenu(false);
                              }}
                              className={`p-2 ${isLight ? 'hover:bg-gray-200' : 'hover:bg-zinc-700'} rounded-lg transition`}
                              title="View story"
                            >
                              <EyeIcon className={`w-4 h-4 ${styles.textSecondary}`} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                onArchiveStory?.(story.id);
                                setShowMenu(false);
                              }}
                              className={`p-2 ${isLight ? 'hover:bg-gray-200' : 'hover:bg-zinc-700'} rounded-lg transition`}
                              title="Archive story"
                            >
                              <ArchiveIcon className={`w-4 h-4 ${styles.textSecondary}`} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                onShareStory?.(story.id);
                                setShowMenu(false);
                              }}
                              className={`p-2 ${isLight ? 'hover:bg-gray-200' : 'hover:bg-zinc-700'} rounded-lg transition`}
                              title="Share story"
                            >
                              <ShareIcon className={`w-4 h-4 ${styles.textSecondary}`} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                onDeleteStory?.(story.id);
                                setShowMenu(false);
                              }}
                              className={`p-2 ${isLight ? 'hover:bg-gray-200' : 'hover:bg-zinc-700'} rounded-lg transition`}
                              title="Delete story"
                            >
                              <TrashIcon className="w-4 h-4 text-red-500" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-3">📸</div>
                      <p className={`text-sm font-medium ${styles.text} mb-1`}>
                        No active stories
                      </p>
                      <p className={`text-xs ${styles.textSecondary} mb-4`}>
                        Add a story to share your moment
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onAdd?.();
                          setShowMenu(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold rounded-xl shadow-lg"
                      >
                        Add Your First Story
                      </motion.button>
                    </div>
                  )
                ) : (
                  archivedStories.length > 0 ? (
                    <div className="divide-y divide-zinc-800/50">
                      {archivedStories.map((story) => (
                        <motion.div
                          key={story.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`
                            p-3 ${styles.itemHover} transition
                            flex items-center gap-3 opacity-60
                          `}
                        >
                          {/* Similar structure as active stories but with archive styling */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 overflow-hidden">
                            {story.media ? (
                              <img src={story.media} alt="" className="w-full h-full object-cover opacity-60" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl opacity-60">
                                📸
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${styles.text} truncate`}>
                              {story.caption || 'Archived Story'}
                            </p>
                            <p className={`text-xs ${styles.textSecondary}`}>
                              {formatTimestamp(story.timestamp)}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              onDeleteStory?.(story.id);
                              setShowMenu(false);
                            }}
                            className={`p-2 ${isLight ? 'hover:bg-gray-200' : 'hover:bg-zinc-700'} rounded-lg transition`}
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-3">📦</div>
                      <p className={`text-sm font-medium ${styles.text} mb-1`}>
                        No archived stories
                      </p>
                      <p className={`text-xs ${styles.textSecondary}`}>
                        Archive stories to save them
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Footer */}
              <div className={`p-3 border-t ${styles.border} flex justify-between`}>
                <button
                  onClick={() => {
                    // Navigate to story settings
                    setShowMenu(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 ${styles.itemHover} rounded-xl transition`}
                >
                  <SettingsIcon className={`w-4 h-4 ${styles.textSecondary}`} />
                  <span className={`text-xs font-medium ${styles.textSecondary}`}>
                    Story Settings
                  </span>
                </button>

                <button
                  onClick={() => setShowMenu(false)}
                  className={`px-3 py-2 ${styles.itemHover} rounded-xl transition`}
                >
                  <span className={`text-xs font-medium ${styles.textSecondary}`}>
                    Close
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isLight ? '#f1f1f1' : '#2a2a2a'};
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isLight ? '#c1c1c1' : '#4a4a4a'};
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isLight ? '#a1a1a1' : '#6a6a6a'};
        }
      `}</style>
    </div>
  );
}
