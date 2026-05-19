import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineBanner() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        className="fixed top-0 inset-x-0 z-[60] bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
          You are currently offline. Some features may be unavailable.
        </div>
      </motion.div>
    </AnimatePresence>
  );
}