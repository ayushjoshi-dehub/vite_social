import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ReelsIcon } from './Icons';

export default function CreateModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const options = [
    { id: 'post', label: 'Post', icon: '📸', color: 'from-blue-600 to-indigo-600' },
    { id: 'story', label: 'Story', icon: '📖', color: 'from-purple-600 to-pink-600' },
    { id: 'reel', label: 'Reel', icon: '🎬', color: 'from-rose-600 to-pink-600' },
    { id: 'profile', label: 'Update Profile', icon: '👤', color: 'from-cyan-600 to-blue-600' },
  ];

  const handleSelect = (id) => {
    onClose();
    if (id === 'post') navigate('/create?type=post');
    else if (id === 'story') navigate('/create?type=story');
    else if (id === 'reel') navigate('/create?type=reel');
    else if (id === 'profile') navigate('/profile?edit=true');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Create Something New</h2>

          <div className="grid grid-cols-2 gap-4">
            {options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(option.id)}
                className={`p-6 rounded-2xl border border-zinc-700 hover:border-zinc-600 transition flex flex-col items-center gap-3 bg-zinc-800/30 hover:bg-zinc-800/60`}
              >
                <span className="text-3xl">{option.icon}</span>
                <span className="font-semibold text-sm">{option.label}</span>
              </motion.button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm font-semibold transition"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
