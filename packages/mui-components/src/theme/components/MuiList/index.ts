import type { Components, Theme } from '@mui/material';

export const MuiList: Components<Theme>['MuiList'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'padding': 0,

      '& .MuiButtonBase-root.MuiMenuItem-root': {
        'padding': '0.75rem 1rem',

        '&:hover, &:focus': {
          backgroundColor: theme.palette.action.hover,
        },
      },
    }),
  },
};
