import type { Components, Theme } from '@mui/material';

export const MuiInputBase: Components<Theme>['MuiInputBase'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'padding': '0rem 1rem',
      'transition': 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },

      '&.Mui-error': {
        'outlineOffset': '3px',

        '& .MuiInputAdornment-root': {
          height: 'calc(3rem - 2px)',
        },
      },

      '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
      },

      '&[type=number]': {
        MozAppearance: 'textfield',
      },

      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        display: 'none',
      },

      '&.MuiInputBase-multiline': {
        padding: 0,
      },
    }),
  },
};
