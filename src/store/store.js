import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// ✅ simple store — no localStorage, no redux-persist needed
// accessToken lives in memory only
// refreshToken lives in HttpOnly cookie
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
