import React from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";

const NAV = [
  { to: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { to: "/users", label: "Users", Icon: PeopleIcon },
  { to: "/roles", label: "Roles", Icon: AdminPanelSettingsIcon },
  { to: "/car-purchases", label: "Car Purchases", Icon: DirectionsCarIcon },
  { to: "/car-expenses", label: "Car Expenses", Icon: ReceiptLongIcon },
  { to: "/invoice", label: "Invoice", Icon: ArticleIcon },
];

export default function Sidebar({ open, drawerWidth }) {
  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: "#1a237e",
          color: "#fff",
          borderRight: "none",
          boxSizing: "border-box",
          overflowX: "hidden", // ✅ hide when closed
          transition: "width 0.3s ease",
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: 1, color: "#fff" }}
        >
          ASIAN AUTO HUB
        </Typography>
        <Typography variant="caption" sx={{ color: "#9fa8da" }}>
          Management System
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

      <List sx={{ px: 1.5, pt: 1 }}>
        {NAV.map(({ to, label, Icon }) => (
          <ListItem key={to} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={to}
              sx={{
                borderRadius: 2,
                color: "#9fa8da",
                "&.active": {
                  bgcolor: "#fff",
                  color: "#1a237e",
                  "& .MuiListItemIcon-root": { color: "#1a237e" },
                },
                "&:hover:not(.active)": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", px: 3, py: 2 }}>
        <Typography variant="caption" sx={{ color: "#7986cb" }}>
          v1.0.0 &copy; 2024 Asian Auto Hub
        </Typography>
      </Box>
    </Drawer>
  );
}
