import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customer/customerSlice";
import workerReducer from "../features/worker/workerSlice";
import { baseApi } from "../services/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    worker: workerReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
