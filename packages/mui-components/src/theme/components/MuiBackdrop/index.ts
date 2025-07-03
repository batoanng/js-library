import type { Components, Theme } from '@mui/material';

export const MuiBackdrop: Components<Theme>['MuiBackdrop'] = {
  styleOverrides: {
    root: () => ({
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)',
    }),
  },
};
