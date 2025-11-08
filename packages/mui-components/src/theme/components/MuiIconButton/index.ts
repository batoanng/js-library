import type { Components, Theme } from '@mui/material';

export const MuiIconButton: Components<Theme>['MuiIconButton'] = {
  defaultProps: {
    disableRipple: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      'padding': '0.5rem',
      'borderRadius': '4px',
      'transition': 'background-color 0.3s ease',
      'color': theme.palette.text.primary,

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },

      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    }),
    colorPrimary: ({ theme }) => ({
      'color': theme.palette.primary.main,

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },

      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    }),
    colorSecondary: ({ theme }) => ({
      'color': theme.palette.secondary.main,

      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    }),
    colorError: ({ theme }) => ({
      'color': theme.palette.error.main,

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },

      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    }),
  },
};
