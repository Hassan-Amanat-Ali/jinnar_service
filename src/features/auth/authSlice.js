import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { ROLES } from '../../constants/roles';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ role, credentials }, { rejectWithValue }) => {
    try {
      const res =
        role === 'customer'
          ? await authApi.customerLogin(credentials)
          : await authApi.workerLogin(credentials);

      localStorage.setItem('token', res.token);
      localStorage.setItem('role', role);
      return res.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Register (signup) thunk. Backend expects { mobileNumber, role: 'buyer'|'seller' }
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ role, data }, { rejectWithValue }) => {
    try {
      // Map frontend role to backend role names
      const backendRole = role === ROLES.CUSTOMER ? 'buyer' : 'seller';
      const payload = { ...data, role: backendRole };

      const res =
        role === ROLES.CUSTOMER
          ? await authApi.customerSignup(payload)
          : await authApi.workerSignup(payload);

      // Persist token + frontend role
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', role);
      return res.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: localStorage.getItem('role') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
