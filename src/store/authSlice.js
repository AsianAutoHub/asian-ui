import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    expiresIn: null,
    user: null,
    isLoggedIn: false,
    isInitializing: true, // ✅ true until refresh check done
  },
  reducers: {
    // ✅ called after login + after token refresh
    setCredentials: (state, action) => {
      const { accessToken, expiresIn, user } = action.payload;
      state.accessToken = accessToken;
      state.expiresIn = expiresIn;
      state.user = user;
      state.isLoggedIn = true;
      state.isInitializing = false;
    },

    // ✅ called on logout or when refresh fails
    clearCredentials: (state) => {
      state.accessToken = null;
      state.expiresIn = null;
      state.user = null;
      state.isLoggedIn = false;
      state.isInitializing = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

// ── Selectors ──
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsInitializing = (state) => state.auth.isInitializing;
