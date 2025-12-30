import { alpha, type Components, type Theme } from '@mui/material';

export const MuiInputBase: Components<Theme>['MuiInputBase'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'border': `1px solid ${theme.palette.divider}`,
      'padding': '0rem 1rem',
      'borderRadius': '4px',
      'transition': '0.3s ease-out',

      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)',
      },

      '&:focus-within': {
        background: 'rgba(255, 255, 255, 0.1)',
      },

      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },

      '&.Mui-error': {
        'borderColor': theme.palette.error.main,
        'borderWidth': '2px',
        'outlineOffset': '3px',

        '& .MuiInputAdornment-root': {
          height: 'calc(3rem - 4px)',
        },
      },

      '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        border: `1px solid ${theme.palette.divider}`,
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
