import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, backTo, action }) {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {backTo && (
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(backTo)}
            sx={{ color: 'text.secondary', minWidth: 0 }}
          />
        )}
        <Typography variant="h5" fontWeight={700} color="primary.main">
          {title}
        </Typography>
      </Box>
      {action && action}
    </Box>
  );
}
