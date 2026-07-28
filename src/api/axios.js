import axios from "axios";
import { store } from "../store/store";
import { setCredentials, clearCredentials } from "../store/authSlice";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// ✅ main api instance — used everywhere in app
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ sends HttpOnly cookie automatically
});

// ✅ separate instance only for refresh token call
// avoids triggering response interceptor again (infinite loop)
const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ── Request Interceptor ──
// runs before every API call
// attaches accessToken from Redux to Authorization header
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    const user = state.auth.user;

    // attach token if exists
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // attach audit headers
    const name = user?.firstname || "system";
    config.headers["X-Created-By"] = name;
    config.headers["X-Updated-By"] = name;

    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ──
// runs after every API response
// handles 401 by auto refreshing token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  // success → just return response
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // skip retry for auth endpoints
    if (originalRequest.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    // handle 401 — token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // if already refreshing → queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ call refresh
        // browser sends HttpOnly refreshToken cookie automatically
        const res = await refreshApi.post("/auth/refresh");
        const { accessToken, expiresIn, user } = res.data;

        // ✅ update Redux with new tokens
        store.dispatch(setCredentials({ accessToken, expiresIn, user }));

        // resolve queued requests
        processQueue(null, accessToken);

        // retry original request
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed → logout
        processQueue(refreshError, null);
        store.dispatch(clearCredentials());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default api;

// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Created-By': 'admin',
//     'X-Updated-By': 'admin',
//   },
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message = error.response?.data?.error || 'Something went wrong';
//     return Promise.reject(new Error(message));
//   }
// );

// export default api;
