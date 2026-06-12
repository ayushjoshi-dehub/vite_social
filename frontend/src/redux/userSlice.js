// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ===============================
    ASYNC THUNKS
================================ */

// Get current user
export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:8000/api/user/current", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      return data.user || data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===============================
    INITIAL STATE
================================ */

const initialState = {
  userData: null,
  suggestedUsers: [],
  isAuthenticated: false,
  isLoading: true,
  error: null,
  theme: localStorage.getItem("theme") || "light",
};

/* ===============================
    SLICE
================================ */

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const normalizedUser =
        action.payload?.user ?? action.payload?.data?.user ?? action.payload ?? null;
      state.userData = normalizedUser;
      state.isAuthenticated = !!normalizedUser;
      state.error = null;
      state.isLoading = false;
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },

    logout: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.suggestedUsers = [];
      state.error = null;
      localStorage.removeItem("token");
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // getCurrentUser
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        const normalizedUser =
          action.payload?.user ?? action.payload?.data?.user ?? action.payload ?? null;
        state.isLoading = false;
        state.userData = normalizedUser;
        state.isAuthenticated = !!normalizedUser;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.userData = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const normalizedUser =
          action.payload?.user ?? action.payload?.data?.user ?? action.payload ?? null;
        state.isLoading = false;
        state.userData = normalizedUser;
        state.isAuthenticated = !!normalizedUser;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

/* ===============================
    EXPORTS
================================ */

export const { setUserData, setTheme, logout, clearError } = userSlice.actions;
export default userSlice.reducer;