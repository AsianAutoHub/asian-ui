import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ onToggle }) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const initials = user
    ? `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase()
    : "?";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Sidebar toggle */}
        <IconButton onClick={onToggle} edge="start" size="small">
          <MenuIcon />
        </IconButton>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#1a237e",
            flex: 1,
          }}
        >
          Asian Auto Hub
        </Typography>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton size="small">
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* User menu trigger */}
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              bgcolor: "#1a237e",
              fontSize: "0.75rem",
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="#1a237e"
              lineHeight={1.2}
            >
              {user?.firstname} {user?.lastname}
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              {/* {user?.roles?.[0]} */}
              {user?.roles?.map((role) => role.name).join(", ")}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon fontSize="small" sx={{ color: "#9e9e9e" }} />
        </Box>

        {/* Dropdown menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 190,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          {/* User info */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {user?.firstname} {user?.lastname}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <Divider />

          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

// import React from 'react';
// import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Tooltip } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// export default function Navbar({ onToggle }) {
//   return (
//     <AppBar
//       position="sticky"
//       elevation={0}
//       sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', color: 'text.primary' }}
//     >
//       <Toolbar sx={{ gap: 1 }}>
//         <IconButton onClick={onToggle} edge="start" size="small">
//           <MenuIcon />
//         </IconButton>

//         <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e', flex: 1 }}>
//           Asian Auto Hub
//         </Typography>

//         <Tooltip title="Notifications">
//           <IconButton size="small">
//             <NotificationsNoneIcon fontSize="small" />
//           </IconButton>
//         </Tooltip>

//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
//           <Avatar sx={{ width: 32, height: 32, bgcolor: '#1a237e', fontSize: '0.8rem' }}>
//             AD
//           </Avatar>
//           <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a237e' }}>
//             Admin
//           </Typography>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }
