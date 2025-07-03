import type { Components, Theme } from '@mui/material';

export const MuiCard: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
    }),
  },
};
