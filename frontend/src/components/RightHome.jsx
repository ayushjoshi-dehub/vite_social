// RightHome.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Avatar from './Avatar';
import { SearchIcon } from './Icons';
import { MESSAGES } from './mockData';

export default function RightHome({ searchMsg, setSearchMsg, filteredMessages }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden xl:flex flex-col w-80 pt-5 shrink-0"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Messages</p>
        <button className="text-xs text-blue-500 hover:text-blue-400">Requests (2)</button>
      </div>

      <div className="relative mb-6 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-zinc-300">
          <SearchIcon />
        </div>
        <input
          value={searchMsg}
          onChange={(e) => setSearchMsg(e.target.value)}
          placeholder="Search messages..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900/80 transition-all"
        />
      </div>

      <div className="space-y-1">
        {filteredMessages.map(m => (
          <motion.div
            key={m.id}
            whileHover={{ backgroundColor: 'rgba(24,24,27,0.6)' }}
            className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-colors relative"
          >
            <Avatar name={m.username} size="w-12 h-12" online={m.online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">{m.name || m.username}</p>
                <p className="text-[10px] text-zinc-600">{m.time}</p>
              </div>
              <p className="text-xs text-zinc-500 truncate flex items-center gap-1.5">
                {m.unread > 0 && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                {m.lastMessage}
              </p>
            </div>
            {m.unread > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                {m.unread}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Active now */}
      <div className="mt-6">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
          Active Now • {MESSAGES.filter(m => m.online).length}
        </p>
        <div className="flex -space-x-2 overflow-hidden">
          {MESSAGES.filter(m => m.online).map(m => (
            <motion.div
              key={m.id}
              whileHover={{ scale: 1.1 }}
              className="inline-block rounded-full ring-2 ring-black"
            >
              <Avatar name={m.username} size="w-8 h-8" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}