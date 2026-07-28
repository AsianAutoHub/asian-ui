import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCredentials, clearCredentials } from "../store/authSlice";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // ✅ on every app start/refresh
        // try to get new accessToken using HttpOnly cookie
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        console.log(res);

        const { accessToken, expiresIn, user } = res.data;

        // ✅ session restored silently
        dispatch(setCredentials({ accessToken, expiresIn, user }));
      } catch {
        // ✅ no valid cookie → not logged in
        dispatch(clearCredentials());
      }
    };

    initAuth();
  }, []); // runs only once on mount

  // render children regardless
  // ProtectedRoute handles the spinner
  return children;
}
