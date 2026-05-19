import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon,
  MoonIcon,
  SunIcon,
  GlobeIcon,
  LockIcon,
  BellIcon,
  EyeIcon,
  LanguageIcon,
  HelpIcon,
  InfoIcon,
  LogoutIcon,
  ShieldIcon,
  PaletteIcon,
  SmartphoneIcon,
  MailIcon,
  KeyIcon,
  FingerprintIcon
} from '../components/Icons';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';
import { setTheme, setUserData } from '../redux/userSlice';

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, theme } = useSelector((state) => state.user);
  const [activeSection, setActiveSection] = useState('main');
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showActivity: true,
    allowTagging: true,
    allowMentions: true
  });

  const handleLogout = () => {
    dispatch(setUserData(null));
    navigate('/signin');
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const sections = {
    main: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-2"
      >
        {/* Account Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-4">
            Account
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveSection('profile')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Profile Information</p>
                <p className="text-xs text-zinc-500">Edit your profile, username, bio</p>
              </div>
              <ChevronLeftIcon className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <ShieldIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Security</p>
                <p className="text-xs text-zinc-500">Password, 2FA, login activity</p>
              </div>
              <ChevronLeftIcon className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-4">
            Preferences
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveSection('notifications')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <BellIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-zinc-500">Push, email, SMS preferences</p>
              </div>
              <ChevronLeftIcon className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>

            <button
              onClick={() => setActiveSection('privacy')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <LockIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Privacy</p>
                <p className="text-xs text-zinc-500">Account privacy, data sharing</p>
              </div>
              <ChevronLeftIcon className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>

            <button
              onClick={() => setActiveSection('appearance')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <PaletteIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Appearance</p>
                <p className="text-xs text-zinc-500">Theme, colors, display</p>
              </div>
              <ChevronLeftIcon className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>

            <button
              onClick={() => setActiveSection('language')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <LanguageIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Language & Region</p>
                <p className="text-xs text-zinc-500">Language, timezone, currency</p>
              </div>
              <ChevronLeftIcon className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-4">
            Support
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveSection('help')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-lg flex items-center justify-center">
                <HelpIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Help Center</p>
                <p className="text-xs text-zinc-500">FAQs, guides, support</p>
              </div>
              <ChevronLeftIcon className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>

            <button
              onClick={() => setActiveSection('about')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-lg flex items-center justify-center">
                <InfoIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">About</p>
                <p className="text-xs text-zinc-500">App info, terms, privacy</p>
              </div>
              <ChevronLeftIcon className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition mt-4"
        >
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
            <LogoutIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </motion.div>
    ),

    appearance: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setActiveSection('main')}
            className="p-2 hover:bg-white/10 rounded-xl transition"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">Appearance</h2>
        </div>

        {/* Theme Toggle */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-sm font-medium mb-3">Theme</p>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(setTheme('light'))}
              className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition ${
                theme === 'light' 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <SunIcon className="w-4 h-4" />
              <span className="text-sm">Light</span>
            </button>
            <button
              onClick={() => dispatch(setTheme('dark'))}
              className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition ${
                theme === 'dark' 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <MoonIcon className="w-4 h-4" />
              <span className="text-sm">Dark</span>
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-sm font-medium mb-3">Font Size</p>
          <input type="range" min="0" max="100" className="w-full" />
        </div>

        {/* Display Options */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-sm font-medium mb-3">Display</p>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Reduce Motion</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">High Contrast</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Large Text</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>
      </motion.div>
    ),

    notifications: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setActiveSection('main')}
            className="p-2 hover:bg-white/10 rounded-xl transition"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">Notifications</h2>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3">Push Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Likes</span>
              <input 
                type="checkbox" 
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                className="toggle" 
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Comments</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Follows</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Messages</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3">Email Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Weekly Digest</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Marketing Emails</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>
      </motion.div>
    ),

    privacy: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setActiveSection('main')}
            className="p-2 hover:bg-white/10 rounded-xl transition"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">Privacy</h2>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3">Account Privacy</h3>
          <label className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm">Private Account</p>
              <p className="text-xs text-zinc-500">Only followers can see your posts</p>
            </div>
            <input 
              type="checkbox" 
              checked={privacy.privateAccount}
              onChange={(e) => setPrivacy({...privacy, privateAccount: e.target.checked})}
              className="toggle" 
            />
          </label>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3">Interactions</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Allow Tagging</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Allow Mentions</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Show Activity Status</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>
      </motion.div>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0D0D0D] to-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.15),transparent_50%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Content */}
      <div className="pt-20 pb-24 max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {sections[activeSection]}
        </AnimatePresence>
      </div>

      <BottomNav />

      <style jsx>{`
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
