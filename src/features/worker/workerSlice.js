import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workerApi } from '../../api/workerApi';

export const fetchWorkerJobs = createAsyncThunk(
  'worker/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      return await workerApi.getJobs();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const workerSlice = createSlice({
  name: 'worker',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkerJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkerJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchWorkerJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default workerSlice.reducer;
