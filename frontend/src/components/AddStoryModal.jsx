import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="2" strokeWidth={1.5} />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <path d="M21 15L16 10L5 21" strokeWidth={1.5} />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth={1.5} />
    <path d="M10 12L15 9L15 15L10 12Z" fill="currentColor" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={1.5} />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth={1.5} />
    <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
  </svg>
);

export default function AddStoryModal({ isOpen, onClose, onUpload, theme = 'dark' }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const fileToDataUrl = useCallback((inputFile) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(inputFile);
  }), []);

  // Theme-based colors
  const isDark = theme === 'dark';
  
  const themeStyles = {
    dark: {
      bg: 'bg-zinc-900',
      border: 'border-zinc-700',
      text: 'text-white',
      textSecondary: 'text-zinc-400',
      buttonBg: 'bg-gradient-to-r from-rose-500 to-pink-500',
      buttonHover: 'hover:from-rose-600 hover:to-pink-600',
      dropZoneBg: 'bg-zinc-800/50',
      dropZoneActive: 'bg-zinc-700/50 border-rose-500',
      previewBg: 'bg-zinc-800',
    },
    light: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-500',
      buttonBg: 'bg-gradient-to-r from-rose-500 to-pink-500',
      buttonHover: 'hover:from-rose-600 hover:to-pink-600',
      dropZoneBg: 'bg-gray-100',
      dropZoneActive: 'bg-gray-200 border-rose-500',
      previewBg: 'bg-gray-100',
    }
  };

  const styles = themeStyles[isDark ? 'dark' : 'light'];

  // Handle file selection
  const handleFile = useCallback((selectedFile) => {
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/'))) {
      setFile(selectedFile);
      setFileType(selectedFile.type.split('/')[0]);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setFileType(null);
      setUploadProgress(0);
      setIsUploading(false);
      setDragActive(false);
    }
  }, [isOpen]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      setUploadProgress(20);
      const mediaDataUrl = await fileToDataUrl(file);
      setUploadProgress(100);

      const mediaInfo = {
        media: mediaDataUrl,
        type: file.type,
        duration: fileType === 'video' ? 15 : undefined, // Default 15 seconds for videos
      };
      
      onUpload?.(mediaInfo);

      setTimeout(() => {
        setIsUploading(false);
        onClose();
      }, 500);
    } catch (error) {
      console.log("Story media conversion failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setFileType(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`relative w-full max-w-lg ${styles.bg} rounded-3xl shadow-2xl overflow-hidden border ${styles.border}`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${styles.border}`}>
              <h2 className={`text-2xl font-bold ${styles.text}`}>Add to Story</h2>
              <button
                onClick={onClose}
                className={`p-2 ${styles.textSecondary} hover:${isDark ? 'bg-zinc-800' : 'bg-gray-100'} rounded-xl transition-colors`}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!file ? (
                // Upload area
                <div
                  ref={dropZoneRef}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative cursor-pointer
                    ${styles.dropZoneBg}
                    border-2 border-dashed rounded-2xl
                    ${dragActive ? styles.dropZoneActive : styles.border}
                    transition-all duration-200
                    p-8 text-center
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center gap-4">
                    <div className={`${styles.textSecondary}`}>
                      <CameraIcon />
                    </div>
                    
                    <div>
                      <p className={`text-lg font-semibold ${styles.text} mb-1`}>
                        Drag & drop or click to upload
                      </p>
                      <p className={`text-sm ${styles.textSecondary}`}>
                        Support for images and videos (max 60s)
                      </p>
                    </div>
                    
                    <div className="flex gap-3 mt-2">
                      <div className={`flex items-center gap-1 px-3 py-1.5 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'} rounded-full`}>
                        <ImageIcon />
                        <span className={`text-xs ${styles.textSecondary}`}>Image</span>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1.5 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'} rounded-full`}>
                        <VideoIcon />
                        <span className={`text-xs ${styles.textSecondary}`}>Video</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Preview area
                <div className="space-y-4">
                  <div className={`relative rounded-2xl overflow-hidden ${styles.previewBg} aspect-square`}>
                    {fileType === 'video' ? (
                      <video 
                        src={preview} 
                        controls 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    )}
                    
                    {/* Remove button */}
                    <button
                      onClick={removeFile}
                      className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                    
                    {/* Duration indicator for videos */}
                    {fileType === 'video' && (
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white">
                        15s max
                      </div>
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className={`flex items-center justify-between text-sm ${styles.textSecondary}`}>
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>

                  {/* Upload progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className={styles.textSecondary}>Uploading...</span>
                        <span className={styles.text}>{uploadProgress}%</span>
                      </div>
                      <div className={`w-full h-2 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className={`h-full bg-gradient-to-r ${styles.buttonBg}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {file && (
              <div className={`p-6 border-t ${styles.border}`}>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`
                    w-full py-3.5 rounded-xl font-semibold text-white
                    ${styles.buttonBg} ${styles.buttonHover}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    flex items-center justify-center gap-2
                  `}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Uploading... {uploadProgress}%</span>
                    </>
                  ) : (
                    'Share to Story'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
