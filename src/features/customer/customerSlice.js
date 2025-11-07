import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi } from '../../api/customerApi';

export const fetchCustomerBookings = createAsyncThunk(
  'customer/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      return await customerApi.getBookings();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchCustomerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
