import { createTheme } from '@mui/material';

import { breakpoints } from './breakpoints';
import { defaultTypography } from './typography/default';
import { colourTheme } from './colourTheme';

export const defaultTheme = createTheme({
  breakpoints: {
    values: breakpoints,
  },
  typography: defaultTypography,
  palette: colourTheme,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F6F9FC',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          'borderRadius': 8,
          'fontWeight': 600,
          'boxShadow': 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.75rem',
        },
      },
    },
  },
});
