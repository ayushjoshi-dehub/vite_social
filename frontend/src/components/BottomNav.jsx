import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import {
  HomeIcon,
  SearchIcon,
  PlusIcon,
  ReelsIcon,
  ProfileIcon,
} from "./Icons";

export default function BottomNav({ theme = "dark", hidden = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLight = theme === "light";

  if (hidden) return null;

  const navItems = [
    { id: "home",    label: "Home",    icon: HomeIcon,    path: "/home" },
    { id: "search",  label: "Search",  icon: SearchIcon,  path: "/search" },
    { id: "add",     label: "",        icon: PlusIcon,    path: "/create", isCenter: true },
    { id: "reels",   label: "Reels",   icon: ReelsIcon,   path: "/reels" },
    { id: "profile", label: "Profile", icon: ProfileIcon, path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 180 }}
      className="fixed left-0 right-0 bottom-[env(safe-area-inset-bottom)] z-[60] pointer-events-none"
    >
      <div
        className={`
          pointer-events-auto
          mx-auto max-w-md px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]
          backdrop-blur-2xl
          border rounded-t-3xl rounded-b-3xl
          shadow-2xl overflow-hidden
          transition-colors duration-300
          ${isLight
            ? "border-gray-200/60 shadow-black/10"
            : "border-white/8 shadow-black/70"
          }
        `}
        style={{
          background: isLight
            ? "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(245,245,250,0.80) 100%)"
            : "linear-gradient(135deg, rgba(20,20,25,0.75) 0%, rgba(10,10,15,0.65) 100%)",
          boxShadow: isLight
            ? "0 -8px 32px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.9)"
            : "0 -8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-end justify-around relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isCenter = item.isCenter;

            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  relative flex flex-col items-center
                  ${isCenter ? "-mt-12" : "mt-2"}
                  transition-all duration-200
                `}
                whileTap={{ scale: 0.92 }}
                aria-label={item.label || "Create"}
              >
                {/* Floating center button */}
                {isCenter ? (
                  <div className="relative">
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500/40 to-pink-600/30 blur-2xl"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 0.8, scale: 1.5 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7 }}
                        />
                      )}
                    </AnimatePresence>

                    <div
                      className={`
                        relative z-10 w-16 h-16 rounded-full
                        flex items-center justify-center
                        bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-700
                        shadow-xl shadow-rose-900/50
                        border border-white/10
                        ${active ? "scale-110 ring-2 ring-rose-400/40" : "hover:scale-105"}
                        transition-all duration-300
                      `}
                    >
                      <Icon size="w-8 h-8" filled={true} className="text-white drop-shadow-md" />
                    </div>
                  </div>
                ) : (
                  <div className="relative pb-1">
                    <div
                      className={`
                        w-12 h-12 rounded-2xl
                        flex items-center justify-center
                        transition-all duration-300
                        ${active
                          ? isLight
                            ? "bg-rose-50 border border-rose-200/60 shadow-inner"
                            : "bg-white/10 backdrop-blur-md border border-white/15 shadow-inner"
                          : isLight
                            ? "bg-transparent hover:bg-gray-100"
                            : "bg-transparent hover:bg-white/5"
                        }
                      `}
                    >
                      <Icon
                        size="w-6 h-6"
                        filled={active}
                        className={active ? "text-rose-500" : isLight ? "text-gray-500" : "text-zinc-400"}
                      />
                    </div>

                    <AnimatePresence>
                      {active && (
                        <motion.div
                          layoutId="activePill"
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                          initial={{ opacity: 0, scaleX: 0.3 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {!isCenter && (
                  <span
                    className={`
                      mt-1.5 text-[10px] font-medium tracking-tight
                      transition-colors duration-300
                      ${active ? "text-rose-400" : isLight ? "text-gray-500" : "text-zinc-500"}
                    `}
                  >
                    {item.label}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
