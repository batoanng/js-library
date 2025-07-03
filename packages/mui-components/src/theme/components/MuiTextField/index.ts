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
        'backgroundColor': theme.palette.background.default,
        'borderRadius': '4px',

        '& fieldset': {
          border: `1px solid ${theme.palette.grey[400]}`,
        },

        '&:hover fieldset': {
          borderColor: theme.palette.primary.dark,
        },

        '&.Mui-focused fieldset': {
          border: `2px solid ${theme.palette.primary.main}`,
        },

        '&.Mui-error fieldset': {
          border: `2px solid ${theme.palette.error.main}`,
        },

        '&.Mui-disabled': {
          backgroundColor: theme.palette.action.disabledBackground,
        },

        '&.Mui-disabled fieldset': {
          borderColor: theme.palette.grey[300],
        },
      },
    }),
  },
};
