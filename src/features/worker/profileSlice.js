import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileData: null,
    lastUpdated: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profileData = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      if (state.profileData) {
        state.profileData[field] = value;
        state.lastUpdated = new Date().toISOString();
      }
    },
    clearProfile: (state) => {
      state.profileData = null;
      state.lastUpdated = null;
    },
  },
});

export const { setProfile, updateProfileField, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
