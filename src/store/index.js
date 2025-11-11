import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customer/customerSlice";
import workerReducer from "../features/worker/workerSlice";
import profileReducer from "../features/worker/profileSlice";
import { baseApi } from "../services/baseApi";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "profile"], // Only persist auth and profile
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  worker: workerReducer,
  profile: profileReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
