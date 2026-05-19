import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';
import { 
  CloseIcon, 
  PlayIcon, 
  PauseIcon, 
  VolumeUpIcon, 
  VolumeOffIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon
} from './Icons';

export default function StoriesViewer({ 
  isOpen, 
  onClose, 
  stories, 
  currentIndex = 0,
  onNext,
  onPrev,
  onLike,
  onComment,
  onShare,
  theme = 'dark'
}) {
  const [index, setIndex] = useState(currentIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [liked, setLiked] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const videoRef = useRef(null);
  const progressInterval = useRef(null);
  const storyDuration = 5000; // 5 seconds per story

  const isLight = theme === 'light';

  // Reset state when story changes
  useEffect(() => {
    setIndex(currentIndex);
    setProgress(0);
    setIsPaused(false);
    setLiked(false);
  }, [currentIndex, isOpen]);

  // Handle progress bar animation
  useEffect(() => {
    if (isPaused || !isOpen) return;

    const startTime = Date.now() - (progress / 100) * storyDuration;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / storyDuration) * 100;
      
      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
      }
    };

    progressInterval.current = setInterval(updateProgress, 50);

    return () => clearInterval(progressInterval.current);
  }, [index, isPaused, isOpen]);

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  const handleNext = useCallback(() => {
    if (index < stories.length - 1) {
      setIndex(index + 1);
      setProgress(0);
      onNext?.(index + 1);
    } else {
      onClose();
    }
  }, [index, stories.length, onNext, onClose]);

  const handlePrev = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      setProgress(0);
      onPrev?.(index - 1);
    }
  }, [index, onPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
        case 'm':
          setIsMuted(!isMuted);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, isMuted]);

  // Touch navigation
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentStory = stories[index];
  if (!currentStory) return null;

  const isVideo = currentStory.mediaType?.startsWith('video');
  const bgColor = isLight ? 'bg-white' : 'bg-black';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 ${bgColor} z-50 flex items-center justify-center`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background blur overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

          {/* Main container */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full max-w-md aspect-[9/16] mx-auto"
          >
            {/* Progress bars */}
            <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
              {stories.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: '0%' }}
                    animate={{
                      width: i < index ? '100%' : i === index ? `${progress}%` : '0%'
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <Avatar
                  name={currentStory.username}
                  src={currentStory.avatar}
                  size="w-10 h-10"
                  hasStory
                  theme={theme}
                />
                <div>
                  <p className="text-white text-sm font-semibold">
                    {currentStory.username}
                  </p>
                  <p className="text-white/60 text-xs">
                    {currentStory.timestamp || 'Just now'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Mute/Unmute button for videos */}
                {isVideo && (
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition"
                  >
                    {isMuted ? (
                      <VolumeOffIcon size="w-5 h-5" className="text-white" />
                    ) : (
                      <VolumeUpIcon size="w-5 h-5" className="text-white" />
                    )}
                  </button>
                )}
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition"
                >
                  <CloseIcon size="w-5 h-5" className="text-white" />
                </button>
              </div>
            </div>

            {/* Story content */}
            <div
              className="absolute inset-0"
              onClick={() => setIsPaused(!isPaused)}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={currentStory.media}
                  className="w-full h-full object-contain"
                  muted={isMuted}
                  loop={false}
                  autoPlay
                  playsInline
                />
              ) : currentStory.media ? (
                <img
                  src={currentStory.media}
                  alt="Story"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl mb-4">📸</p>
                    <p className="text-white text-xl font-semibold">
                      {currentStory.username}'s Story
                    </p>
                  </div>
                </div>
              )}

              {/* Play/Pause overlay */}
              <AnimatePresence>
                {isPaused && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/20"
                  >
                    <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <PlayIcon size="w-8 h-8" className="text-white" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <AnimatePresence>
              {showControls && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition"
                  >
                    <ChevronLeftIcon size="w-6 h-6" className="text-white" />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition"
                  >
                    <ChevronRightIcon size="w-6 h-6" className="text-white" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Interaction buttons */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="flex items-center gap-3">
                {/* Like button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setLiked(!liked);
                    onLike?.(currentStory.id);
                  }}
                  className="p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition"
                >
                  <HeartIcon 
                    filled={liked} 
                    size="w-6 h-6" 
                    className={liked ? 'text-rose-500' : 'text-white'}
                  />
                </motion.button>

                {/* Comment button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onComment?.(currentStory.id)}
                  className="p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition"
                >
                  <CommentIcon size="w-6 h-6" className="text-white" />
                </motion.button>

                {/* Share button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onShare?.(currentStory.id)}
                  className="p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition"
                >
                  <ShareIcon size="w-6 h-6" className="text-white" />
                </motion.button>

                {/* Reply input */}
                <input
                  type="text"
                  placeholder="Send message..."
                  className="flex-1 px-4 py-2 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {/* Tap areas hint */}
            <div className="absolute inset-x-0 bottom-20 text-center text-white/50 text-xs z-20">
              Tap left side to go back • Tap right side to skip
            </div>
          </motion.div>

          {/* Keyboard shortcut hint */}
          <div className="absolute bottom-4 left-4 text-white/30 text-xs hidden lg:block">
            ← → to navigate • Space to pause • M to mute • Esc to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}