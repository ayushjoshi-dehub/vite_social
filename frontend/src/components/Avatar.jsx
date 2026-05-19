import React from 'react';
import { motion } from 'framer-motion';

export default function Avatar({
  name = '?',
  src,                    // optional: image URL
  size = 'w-10 h-10',     // string like 'w-12 h-12' or number (px)
  hasStory = false,
  viewed = false,         // if hasStory && viewed → different ring style
  isLive = false,
  online = false,
  verified = false,
  className = '',
  onClick,
  ariaLabel,
}) {
  // Size normalization
  const sizePx = typeof size === 'number' ? size : parseInt(size.match(/\d+/)?.[0] || 40, 10);
  const ringThickness = Math.max(2, Math.round(sizePx * 0.08)); // scales with size

  // Initials fallback
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Dynamic gradient for background & story ring
  const gradients = [
    'from-pink-500 via-rose-500 to-purple-600',
    'from-cyan-500 via-blue-500 to-indigo-600',
    'from-emerald-500 via-teal-500 to-green-600',
    'from-amber-500 via-orange-500 to-red-500',
  ];
  const gradientIndex = (name.charCodeAt(0) || 65) % gradients.length;
  const gradient = gradients[gradientIndex];

  const storyRing = hasStory
    ? `p-[${ringThickness}px] bg-gradient-to-tr ${viewed ? 'from-zinc-600 to-zinc-500' : gradient} animate-pulse-slow`
    : '';

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.07 } : {}}
      whileTap={onClick ? { scale: 0.96 } : {}}
      className={`
        relative flex-shrink-0 cursor-pointer
        ${className}
      `}
      onClick={onClick}
      aria-label={ariaLabel || name || 'User avatar'}
      role={onClick ? 'button' : undefined}
    >
      {/* Story / Highlight ring */}
      <div
        className={`
          rounded-full transition-all duration-300
          ${storyRing}
          ${!hasStory && 'bg-zinc-800'}
        `}
      >
        <div
          className={`
            ${size} rounded-full overflow-hidden flex items-center justify-center
            border-2 border-zinc-950 shadow-inner
            ${src ? '' : `bg-gradient-to-br ${gradient}`}
          `}
        >
          {src ? (
            <img
              src={src}
              alt={name || 'User'}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => (e.target.style.display = 'none')} // fallback on broken image
            />
          ) : (
            <span className="text-white font-semibold tracking-wider drop-shadow-md">
              {initials}
            </span>
          )}
        </div>
      </div>

      {/* Status indicators */}
      {isLive && (
        <span
          className="
            absolute -bottom-1 left-1/2 -translate-x-1/2
            px-2 py-0.5 text-[9px] font-extrabold tracking-wide
            bg-gradient-to-r from-rose-600 to-pink-600
            text-white rounded-full border border-black/40 shadow-sm
          "
        >
          LIVE
        </span>
      )}

      {online && !isLive && (
        <span
          className="
            absolute bottom-0.5 right-0.5
            w-3.5 h-3.5 bg-emerald-500 rounded-full
            border-2 border-zinc-950 shadow-lg shadow-emerald-900/40
          "
        />
      )}

      {verified && (
        <span
          className="
            absolute -bottom-1 -right-1
            w-5 h-5 bg-blue-600 rounded-full
            flex items-center justify-center
            border-2 border-zinc-950 shadow-sm
          "
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
          </svg>
        </span>
      )}
    </motion.div>
  );
}