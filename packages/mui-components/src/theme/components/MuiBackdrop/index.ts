import type { Components, Theme } from '@mui/material';

export const MuiBackdrop: Components<Theme>['MuiBackdrop'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.designTokens.stateLayers.backdrop,
      backdropFilter: 'blur(2px)',
    }),
  },
};
