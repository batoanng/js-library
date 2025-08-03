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
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
      },

      '&.Mui-disabled': {
        backgroundColor: 'transparent',
        color: theme.palette.action.disabled,
      },
    }),
    colorPrimary: ({ theme }) => ({
      'color': theme.palette.primary.main,

      '&:hover': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
      },

      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    }),
    colorSecondary: ({ theme }) => ({
      'color': theme.palette.secondary.main,

      '&:hover': {
        color: theme.palette.secondary.contrastText,
      },

      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    }),
    colorError: ({ theme }) => ({
      'color': theme.palette.error.main,

      '&:hover': {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
      },

      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    }),
  },
};
