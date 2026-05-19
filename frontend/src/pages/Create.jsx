import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlusIcon,
  ImageIcon,
  VideoIcon,
  EmojiIcon,
  ChevronLeftIcon,
  SettingsIcon
} from '../components/Icons';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';

const serverUrl = "http://localhost:8000";

const MusicIcon = ({ className = "w-4 h-4" }) => <span className={className}>♫</span>;
const LocationIcon = ({ className = "w-4 h-4" }) => <span className={className}>📍</span>;
const SmileIcon = ({ className = "w-5 h-5" }) => <EmojiIcon className={className} />;
const CropIcon = ({ className = "w-5 h-5" }) => <span className={className}>▣</span>;
const FilterIcon = ({ className = "w-5 h-5" }) => <span className={className}>◐</span>;
const TextIcon = ({ className = "w-5 h-5" }) => <span className={className}>T</span>;
const StickerIcon = ({ className = "w-5 h-5" }) => <span className={className}>★</span>;
const BrushIcon = ({ className = "w-5 h-5" }) => <span className={className}>✎</span>;
const ArrowRightIcon = ({ className = "w-4 h-4" }) => <span className={className}>→</span>;
const CheckIcon = ({ className = "w-5 h-5" }) => <span className={className}>✓</span>;

export default function Create() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select'); // select, edit, caption, share
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1'); // 1:1, 4:5, 16:9
  const [selectedMusic, setSelectedMusic] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Filters for images
  const filters = [
    { id: 'original', name: 'Original', class: '' },
    { id: 'clarendon', name: 'Clarendon', class: 'brightness-110 contrast-125' },
    { id: 'gingham', name: 'Gingham', class: 'sepia brightness-90 contrast-75' },
    { id: 'moon', name: 'Moon', class: 'grayscale contrast-125' },
    { id: 'lark', name: 'Lark', class: 'brightness-105 contrast-90 saturate-90' },
    { id: 'reyes', name: 'Reyes', class: 'sepia brightness-105 contrast-85' },
    { id: 'juno', name: 'Juno', class: 'brightness-110 saturate-150' },
    { id: 'slumber', name: 'Slumber', class: 'brightness-95 contrast-90 saturate-80' },
    { id: 'aden', name: 'Aden', class: 'sepia brightness-90 contrast-90' },
    { id: 'perpetua', name: 'Perpetua', class: 'brightness-95 contrast-110' },
  ];

  // Music tracks
  const musicTracks = [
    { id: 1, title: 'Summer Vibes', artist: 'Artist Name', duration: '2:34', cover: '🎵' },
    { id: 2, title: 'Chill Morning', artist: 'Another Artist', duration: '3:12', cover: '🎸' },
    { id: 3, title: 'Night Drive', artist: 'DJ Name', duration: '4:01', cover: '🎹' },
  ];

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      setFileType(file.type.split('/')[0]);
      setPreview(URL.createObjectURL(file));
      setStep('edit');
    }
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Cleanup preview on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !fileType) return;
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const media = await fileToDataUrl(selectedFile);
      setUploadProgress(55);

      await axios.post(`${serverUrl}/api/post`, {
        caption,
        location,
        media,
        mediaType: fileType === "video" ? "video" : "image",
      }, { withCredentials: true });

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        navigate('/home');
      }, 400);
    } catch (error) {
      console.log("Post upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Get aspect ratio class
  const getAspectRatioClass = () => {
    switch(aspectRatio) {
      case '1:1': return 'aspect-square';
      case '4:5': return 'aspect-[4/5]';
      case '16:9': return 'aspect-video';
      default: return 'aspect-square';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0D0D0D] to-black text-white selection:bg-rose-500/30">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => step === 'select' ? navigate(-1) : setStep('select')}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {step === 'select' && 'Create New Post'}
              {step === 'edit' && 'Edit Media'}
              {step === 'caption' && 'Add Caption'}
              {step === 'share' && 'Share Post'}
            </h1>
          </div>

          {step !== 'select' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (step === 'edit') setStep('caption');
                else if (step === 'caption') setStep('share');
                else if (step === 'share') handleUpload();
              }}
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all flex items-center gap-2"
            >
              {step === 'share' ? 'Share' : 'Next'}
              <ArrowRightIcon className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-20 pb-24 sm:pb-24 max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Media */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative group"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
                
                <div className="relative bg-zinc-900/50 border-2 border-dashed border-zinc-700 rounded-3xl p-16 text-center hover:border-rose-500/50 transition-all cursor-pointer backdrop-blur-sm"
                     onClick={() => fileInputRef.current?.click()}>
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center">
                      <PlusIcon size="w-12 h-12" className="text-rose-500" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3">Create a new post</h2>
                  <p className="text-zinc-400 mb-8">Drag & drop or click to upload</p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="flex items-center justify-center gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-rose-500/25 transition-all">
                      Choose File
                    </button>
                  </div>

                  {/* Quick options */}
                  <div className="flex items-center justify-center gap-6 mt-8 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Images</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VideoIcon className="w-4 h-4" />
                      <span>Videos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MusicIcon className="w-4 h-4" />
                      <span>Music</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent uploads or templates */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4">Recent uploads</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-zinc-800/50 rounded-xl border border-zinc-800 hover:border-rose-500/50 transition cursor-pointer" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Edit Media */}
          {step === 'edit' && preview && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview Area */}
                <div className="lg:col-span-2">
                  <div className={`relative ${getAspectRatioClass()} bg-black rounded-2xl overflow-hidden border border-zinc-800`}>
                    {fileType === 'video' ? (
                      <video
                        ref={videoRef}
                        src={preview}
                        controls
                        className={`w-full h-full object-contain ${filters.find(f => f.id === selectedFilter)?.class}`}
                      />
                    ) : (
                      <img
                        src={preview}
                        alt="Preview"
                        className={`w-full h-full object-contain ${filters.find(f => f.id === selectedFilter)?.class}`}
                      />
                    )}

                    {/* Tools overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-full backdrop-blur-sm transition flex items-center gap-2 ${
                          showFilters ? 'bg-rose-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                        }`}
                      >
                        <FilterIcon className="w-4 h-4" />
                        <span className="text-sm">Filters</span>
                      </button>
                      <button
                        onClick={() => setShowTools(!showTools)}
                        className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-sm hover:bg-black/70 transition flex items-center gap-2"
                      >
                        <BrushIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tools Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sticky top-24">
                    <h3 className="font-semibold mb-4">Edit Tools</h3>
                    
                    {/* Aspect Ratio */}
                    <div className="mb-6">
                      <p className="text-xs text-zinc-400 mb-3">Aspect Ratio</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['1:1', '4:5', '16:9'].map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                              aspectRatio === ratio
                                ? 'bg-rose-500 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filters */}
                    <AnimatePresence>
                      {showFilters && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 overflow-hidden"
                        >
                          <p className="text-xs text-zinc-400 mb-3">Filters</p>
                          <div className="grid grid-cols-3 gap-2">
                            {filters.map((filter) => (
                              <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                                  selectedFilter === filter.id ? 'border-rose-500' : 'border-transparent'
                                }`}
                              >
                                <img
                                  src={preview}
                                  alt={filter.name}
                                  className={`w-full h-full object-cover ${filter.class}`}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-center py-1">
                                  {filter.name}
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Edit Tools */}
                    <AnimatePresence>
                      {showTools && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition flex flex-col items-center gap-1">
                              <CropIcon className="w-5 h-5" />
                              <span className="text-xs">Crop</span>
                            </button>
                            <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition flex flex-col items-center gap-1">
                              <TextIcon className="w-5 h-5" />
                              <span className="text-xs">Text</span>
                            </button>
                            <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition flex flex-col items-center gap-1">
                              <StickerIcon className="w-5 h-5" />
                              <span className="text-xs">Stickers</span>
                            </button>
                            <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition flex flex-col items-center gap-1">
                              <BrushIcon className="w-5 h-5" />
                              <span className="text-xs">Draw</span>
                            </button>
                          </div>

                          {/* Adjustments */}
                          <div className="space-y-3">
                            <p className="text-xs text-zinc-400">Adjustments</p>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Brightness</span>
                                  <span className="text-zinc-400">50%</span>
                                </div>
                                <input type="range" min="0" max="100" className="w-full" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Contrast</span>
                                  <span className="text-zinc-400">50%</span>
                                </div>
                                <input type="range" min="0" max="100" className="w-full" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Saturation</span>
                                  <span className="text-zinc-400">50%</span>
                                </div>
                                <input type="range" min="0" max="100" className="w-full" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Add Caption */}
          {step === 'caption' && (
            <motion.div
              key="caption"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <Avatar name="User" size="w-12 h-12" />
                  <div className="flex-1">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder-zinc-600"
                      rows="4"
                    />
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button className="p-2 hover:bg-zinc-800 rounded-lg transition">
                        <SmileIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-zinc-800 rounded-lg transition">
                        <LocationIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-zinc-800 rounded-lg transition">
                        <MusicIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-xl">
                    <LocationIcon className="w-5 h-5 text-zinc-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Add location"
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Music */}
                <div>
                  <p className="text-sm font-semibold mb-3">Add Music</p>
                  <div className="space-y-2">
                    {musicTracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setSelectedMusic(track.id)}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                          selectedMusic === track.id
                            ? 'bg-rose-500/20 border border-rose-500/50'
                            : 'bg-zinc-800/50 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-xl">
                          {track.cover}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{track.title}</p>
                          <p className="text-xs text-zinc-400">{track.artist}</p>
                        </div>
                        <span className="text-xs text-zinc-500">{track.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Share */}
          {step === 'share' && (
            <motion.div
              key="share"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
                {/* Preview */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-zinc-800">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 overflow-hidden">
                    {preview && (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300 line-clamp-2">{caption || 'No caption'}</p>
                    {location && (
                      <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                        <LocationIcon className="w-3 h-3" />
                        {location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Share Options */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">f</span>
                      </div>
                      <span className="text-sm">Share to Facebook</span>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">ig</span>
                      </div>
                      <span className="text-sm">Share to Instagram</span>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black rounded-lg border border-zinc-700 flex items-center justify-center">
                        <span className="text-white text-lg">X</span>
                      </div>
                      <span className="text-sm">Share to X</span>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>

                {/* Advanced Settings */}
                <button className="w-full p-3 bg-zinc-800/50 rounded-xl flex items-center justify-between hover:bg-zinc-800 transition">
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    <span className="text-sm">Advanced Settings</span>
                  </div>
                  <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                </button>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-6">
                    <div className="flex justify-between text-xs mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
                      />
                    </div>
                  </div>
                )}

                {/* Share Button */}
                {!isUploading && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Share to Feed
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />

      {/* Add custom styles */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 4px;
          background: #27272a;
          border-radius: 2px;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #f43f5e;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .toggle {
          appearance: none;
          width: 44px;
          height: 24px;
          background: #3f3f46;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle:checked {
          background: #f43f5e;
        }

        .toggle::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: all 0.2s;
        }

        .toggle:checked::before {
          left: 22px;
        }
      `}</style>
    </div>
  );
}
