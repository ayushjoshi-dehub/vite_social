// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // Optional: add middleware, devTools config, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // useful if you store non-serializable data (like dates)
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;