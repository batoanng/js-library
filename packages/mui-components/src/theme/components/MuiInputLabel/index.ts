import type { Components, Theme } from '@mui/material';

export const MuiInputLabel: Components<Theme>['MuiInputLabel'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'position': 'relative',
      'marginBottom': '1rem',
      'marginTop': '1rem',
      'color': theme.palette.text.primary,

      '&.Mui-focused': {
        fontSize: '1rem',
        color: theme.palette.text.primary,
      },

      '& legend': { display: 'none' },
      '& fieldset': { top: 0 },
    }),
  },
};
