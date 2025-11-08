import { createSlice } from "@reduxjs/toolkit";

// Simple customer slice for managing customer-specific UI state
// API calls are now handled by RTK Query (see services/api.js)
// Use hooks like useGetBookingsQuery(), useCreateBookingMutation() instead
const customerSlice = createSlice({
  name: "customer",
  initialState: {
    selectedService: null,
    filters: {},
  },
  reducers: {
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setSelectedService, setFilters, clearFilters } =
  customerSlice.actions;
export default customerSlice.reducer;
