import type { Components, Theme } from '@mui/material';

export const MuiDivider: Components<Theme>['MuiDivider'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      marginTop: '1rem',
      marginBottom: '1rem',
      borderColor: theme.palette.divider,
    }),
  },
};
