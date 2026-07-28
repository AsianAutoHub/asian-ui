import React from "react";
import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
        bgcolor: "#f4f6f9",
      }}
    >
      <LockIcon sx={{ fontSize: 72, color: "#e0e0e0" }} />
      <Typography variant="h5" fontWeight={700} color="text.secondary">
        403 — Access Denied
      </Typography>
      <Typography variant="body2" color="text.secondary">
        You don't have permission to view this page.
      </Typography>
      <Button
        variant="contained"
        sx={{ bgcolor: "#1a237e" }}
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}
