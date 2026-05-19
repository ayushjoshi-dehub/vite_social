import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

// ──────────────────────────────────────────────────────────────
// Expected props shape example:
// {
//   isOpen: boolean,
//   onClose: () => void,
//   currentUser: { id: string, username: string, avatar?: string },
//   conversations: Array<{ id: string, name?: string, username: string, online: boolean, lastMessage?: string, unread?: number, time?: string }>,
//   messages: Record<string, Array<Message>>,   // userId → messages[]
//   onSendMessage: (userId: string, content: string, attachments?: File[]) => void,
//   onTyping: (userId: string, isTyping: boolean) => void,   // optional
//   isDarkMode?: boolean,   // or use context
// }
// ──────────────────────────────────────────────────────────────

export default function ChatModal({
  isOpen,
  onClose,
  currentUser,
  conversations = [],
  messages = {},           // { [userId]: Message[] }
  onSendMessage,
  onTyping,                // optional callback
  isDarkMode = true,       // default dark — can come from theme context
}) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isUserTyping, setIsUserTyping] = useState(false); // local typing state
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedUser = conversations.find(u => u.id === selectedUserId);
  const chatHistory = messages[selectedUserId] || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, selectedUserId]);

  // Simulate typing detection (in real app → use socket / debounce)
  useEffect(() => {
    if (!newMessage.trim()) return;
    if (onTyping) onTyping(selectedUserId, true);
    const timer = setTimeout(() => {
      if (onTyping) onTyping(selectedUserId, false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [newMessage, selectedUserId, onTyping]);

  const handleSend = () => {
    if ((!newMessage.trim() && attachments.length === 0) || !selectedUserId) return;

    onSendMessage?.(selectedUserId, newMessage.trim(), attachments);

    setNewMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const theme = isDarkMode ? 'dark' : 'light';
  const bg = isDarkMode ? 'bg-zinc-950' : 'bg-gray-50';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const border = isDarkMode ? 'border-zinc-800' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-zinc-900' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-zinc-700' : 'border-gray-300';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className={`fixed inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/40'} backdrop-blur-sm z-[100] flex items-center justify-center p-4`}
      >
        <motion.div
          initial={{ scale: 0.92, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 30, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className={`w-full max-w-4xl h-[90vh] max-h-[720px] ${bg} border ${border} rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${text}`}
        >
          {/* Conversations Sidebar */}
          <div className={`w-full md:w-80 lg:w-96 border-b md:border-r ${border} flex flex-col ${isDarkMode ? 'bg-zinc-950/70' : 'bg-gray-100/70'}`}>
            <div className={`p-4 border-b ${border} flex items-center justify-between`}>
              <h3 className="font-bold text-lg">Messages</h3>
              <button className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map(user => (
                <motion.button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  whileHover={{ backgroundColor: isDarkMode ? 'rgba(39,39,42,0.4)' : 'rgba(200,200,200,0.3)' }}
                  className={`w-full flex items-center gap-3 p-3.5 transition-all ${
                    selectedUserId === user.id
                      ? isDarkMode ? 'bg-zinc-800/70 border-l-2 border-rose-500' : 'bg-gray-200 border-l-2 border-rose-500'
                      : 'hover:bg-opacity-10 hover:bg-gray-500'
                  }`}
                >
                  <Avatar name={user.username} size="w-12 h-12" online={user.online} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between">
                      <p className="font-medium truncate">{user.name || user.username}</p>
                      <span className="text-xs opacity-70">{user.time || 'now'}</span>
                    </div>
                    <p className="text-sm opacity-70 truncate">
                      {user.lastMessage?.slice(0, 38) || 'Start chatting...'}
                    </p>
                  </div>
                  {user.unread > 0 && (
                    <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {user.unread}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className={`p-4 border-b ${border} flex items-center gap-3 ${isDarkMode ? 'bg-zinc-950/50' : 'bg-gray-100'}`}>
                  <button onClick={() => setSelectedUserId(null)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <Avatar name={selectedUser.username} size="w-10 h-10" online={selectedUser.online} />
                  <div>
                    <p className="font-semibold">{selectedUser.name || selectedUser.username}</p>
                    <p className="text-xs opacity-70">
                      {selectedUser.online ? 'Active now' : 'Offline'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-5 ${isDarkMode ? 'bg-gradient-to-b from-black/20 to-transparent' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
                  <div className="text-center text-sm opacity-60 py-6">
                    You both can now send messages
                  </div>

                  {chatHistory.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          msg.sender === currentUser.id
                            ? isDarkMode
                              ? 'bg-rose-600 text-white rounded-br-none'
                              : 'bg-rose-500 text-white rounded-br-none'
                            : isDarkMode
                              ? 'bg-zinc-800 text-white rounded-bl-none'
                              : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        {msg.attachments?.length > 0 && (
                          <div className="mb-2 grid grid-cols-2 gap-2">
                            {msg.attachments.map((file, i) => (
                              <div key={i} className="rounded overflow-hidden bg-black/30">
                                {file.type.startsWith('image/') ? (
                                  <img src={URL.createObjectURL(file)} alt="attachment" className="max-h-40 object-contain" />
                                ) : (
                                  <div className="p-3 text-xs text-center">{file.name}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <p>{msg.text}</p>

                        <div className="flex items-center justify-end gap-2 mt-1 text-[10px] opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.sender === currentUser.id && (
                            <span>
                              {msg.status === 'seen' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                              {msg.status === 'seen' && <span className="text-blue-400">✓</span>}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isUserTyping && selectedUser && (
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                      <Avatar name={selectedUser.username} size="w-7 h-7" />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-4 py-2 bg-zinc-800/70 rounded-full text-sm"
                      >
                        typing...
                      </motion.div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input + Attachments */}
                <div className={`p-4 border-t ${border} ${isDarkMode ? 'bg-zinc-950/70' : 'bg-gray-100'}`}>
                  {/* Attachment Previews */}
                  {attachments.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/40">
                            {file.type.startsWith('image/') ? (
                              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs text-center p-1">
                                {file.name.slice(0, 15)}...
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 rounded-full text-white text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition"
                    >
                      <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.485 8.485L20.5 13" />
                      </svg>
                    </button>

                    <input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message..."
                      className={`flex-1 px-4 py-3 ${inputBg} border ${inputBorder} rounded-full text-sm focus:outline-none focus:border-rose-500/60 transition`}
                    />

                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={handleSend}
                      disabled={!newMessage.trim() && attachments.length === 0}
                      className={`p-3.5 rounded-full transition-all ${
                        (newMessage.trim() || attachments.length > 0)
                          ? 'bg-rose-600 text-white hover:bg-rose-500'
                          : 'bg-zinc-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-lg opacity-60">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}