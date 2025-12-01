import { createSlice } from "@reduxjs/toolkit";

// Simple auth slice for managing user state
// API calls are now handled by RTK Query (see services/api.js)
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: localStorage.getItem("role") || null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
