import type { Components, Theme } from '@mui/material';

export const MuiFormLabel: Components<Theme>['MuiFormLabel'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'color': theme.palette.text.primary,
      'fontWeight': 700,
      'fontSize': '1rem',
      'display': 'block',
      'lineHeight': 1.5,

      '&.Mui-focused, &.Mui-error, &.Mui-disabled': {
        color: theme.palette.text.primary,
      },

      '& .icon-button': {
        marginLeft: '0.5rem',
      },
    }),
  },
};
