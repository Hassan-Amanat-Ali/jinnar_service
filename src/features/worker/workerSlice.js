import { createSlice } from "@reduxjs/toolkit";

// Simple worker slice for managing worker-specific UI state
// API calls are now handled by RTK Query (see services/api.js)
// Use hooks like useGetJobsQuery(), useAddJobMutation(), useUpdateJobMutation() instead
const workerSlice = createSlice({
  name: "worker",
  initialState: {
    selectedJob: null,
    filters: {},
  },
  reducers: {
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setSelectedJob, setFilters, clearFilters } = workerSlice.actions;
export default workerSlice.reducer;
