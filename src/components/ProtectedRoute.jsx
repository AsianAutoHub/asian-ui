import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsLoggedIn,
  selectIsInitializing,
  selectUser,
} from "../store/authSlice";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function ProtectedRoute({ children, roles }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isInitializing = useSelector(selectIsInitializing);
  const user = useSelector(selectUser);
  const location = useLocation();

  // ✅ wait for AuthInitializer to finish
  if (isInitializing) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f4f6f9",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#1a237e" }} size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // ✅ not logged in → go to login
  // save current path so we redirect back after login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const hasRole = user?.roles?.some((r) => roles.includes(r.name));

    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ✅ role check — if roles required
  // if (roles && roles.length > 0) {
  //   const hasRole = user?.roles?.some((r) => roles.includes(r));
  //   if (!hasRole) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }

  return children;
}
