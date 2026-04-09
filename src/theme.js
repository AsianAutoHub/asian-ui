import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#283593',
      contrastText: '#ffffff',
    },
    success: { main: '#1b5e20' },
    error:   { main: '#b71c1c' },
    background: {
      default: '#f4f6f9',
      paper:   '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#1a237e',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.8rem',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, fontSize: '0.7rem' } },
    },
  },
});

export default theme;
