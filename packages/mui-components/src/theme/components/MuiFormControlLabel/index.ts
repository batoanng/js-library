import type { Components, Theme } from '@mui/material';

export const MuiFormControlLabel: Components<Theme>['MuiFormControlLabel'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'color': theme.palette.text.primary,
      'margin': '0.5rem 0',

      '&.Mui-disabled': {
        '&:hover': {
          cursor: 'not-allowed',
        },
      },

      '& .MuiFormControlLabel-label.Mui-disabled': {
        color: theme.palette.text.primary,
      },

      '&:hover .MuiRadio-root:not(.Mui-disabled)': {
        backgroundColor: theme.palette.action.hover,
      },
    }),
  },
};
