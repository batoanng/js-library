import type { Components, Theme } from '@mui/material';

export const MuiSwitch: Components<Theme>['MuiSwitch'] = {
  styleOverrides: {
    switchBase: ({ theme }) => ({
      'color': theme.palette.grey[400],

      '&.Mui-checked': {
        'color': theme.palette.primary.main,

        '+ .MuiSwitch-track': {
          backgroundColor: theme.palette.primary.main,
        },
      },
    }),
    track: ({ theme }) => ({
      backgroundColor: theme.palette.grey[400],
    }),
  },
};
