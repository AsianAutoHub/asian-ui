import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function Navbar({ onToggle }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', color: 'text.primary' }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton onClick={onToggle} edge="start" size="small">
          <MenuIcon />
        </IconButton>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e', flex: 1 }}>
          Asian Auto Hub
        </Typography>

        <Tooltip title="Notifications">
          <IconButton size="small">
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1a237e', fontSize: '0.8rem' }}>
            AD
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a237e' }}>
            Admin
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
