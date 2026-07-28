import React from "react";
import { Box, Typography, Button } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
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
      <DirectionsCarIcon sx={{ fontSize: 72, color: "#e0e0e0" }} />
      <Typography variant="h5" fontWeight={700} color="text.secondary">
        404 — Page Not Found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        The page you're looking for doesn't exist.
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
