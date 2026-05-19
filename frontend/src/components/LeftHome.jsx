// LeftHome.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { SUGGESTED } from './mockData';
import { setUserData } from '../redux/userSlice';

export default function LeftHome({ userData, suggested, toggleFollow }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <motion.aside
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex flex-col w-72 xl:w-80 pt-5 gap-7 shrink-0"
    >
      {/* Your profile */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-zinc-900/60 transition-colors"
      >
        <Avatar
          name={userData?.username || "You"}
          size="w-14 h-14"
          hasStory
          verified
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate flex items-center gap-1.5">
            {userData?.username || "theankushsahu_"}
            <span className="text-blue-500 text-sm">✓</span>
          </p>
          <p className="text-sm text-zinc-400 truncate">{userData?.name || "Ankush"}</p>
        </div>
        {/* logout button on right */}
        <button
          onClick={() => {
            dispatch(setUserData(null));
            navigate('/signin');
          }}
          className="ml-auto text-xs font-semibold px-4 py-2 bg-red-600 hover:bg-red-500 rounded-full"
        >
          Logout
        </button>
      </motion.div>

      {/* Suggested users */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Suggested</p>
          <button className="text-xs text-zinc-400 hover:text-white">See all</button>
        </div>
        <div className="space-y-2">
          {suggested.map(u => (
            <motion.div
              key={u._id || u.id}
              whileHover={{ x: 6, backgroundColor: 'rgba(39,39,42,0.5)' }}
              className="flex items-center gap-3.5 p-2.5 rounded-xl transition-colors"
            >
              <Avatar name={u.username} src={u.profileImage || null} size="w-12 h-12" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{u.username}</p>
                <p className="text-xs text-zinc-500">{u.mutualFollowers || 0} mutual followers</p>
              </div>
              <button
                onClick={() => toggleFollow(u._id || u.id)}
                className={`text-xs font-semibold px-5 py-1.5 rounded-full transition ${
                  u.following
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110"
                }`}
              >
                {u.following ? "Following" : "Follow"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-auto pt-6 text-xs text-zinc-600 px-2 space-y-1.5">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span>About</span> • <span>Help</span> • <span>Privacy</span> • <span>Terms</span>
        </div>
        <p>© 2026 Atlas</p>
      </div>
    </motion.aside>
  );
}
