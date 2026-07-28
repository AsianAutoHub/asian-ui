import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  selectIsLoggedIn,
  selectAccessToken,
  clearCredentials,
} from "../store/authSlice";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const accessToken = useSelector(selectAccessToken);

  const logout = async () => {
    try {
      // tell backend to clear cookie + delete from DB
      await api.post("/auth/logout");
    } catch {
      // still logout even if API fails
    }
    dispatch(clearCredentials());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return { user, isLoggedIn, accessToken, logout };
};
