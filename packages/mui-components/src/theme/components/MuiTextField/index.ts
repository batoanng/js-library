import type { Components, Theme } from '@mui/material/styles';

export const MuiTextField: Components<Theme>['MuiTextField'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& label.MuiInputLabel-outlined': {
        'transform': 'none',
        'transition': 'none',
        'color': theme.palette.text.primary,
        'marginBottom': '0px',
        'fontWeight': 500,
        'position': 'relative',

        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },

        '&.Mui-error': {
          color: theme.palette.error.main,
        },

        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
        },
      },

      '& .MuiOutlinedInput-root': {
        borderRadius: 0,
      },
    }),
  },
};
