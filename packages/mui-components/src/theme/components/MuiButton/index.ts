import type { Components, Theme } from '@mui/material';

export const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: {
    disableRipple: true,
  },
  variants: [
    {
      props: { color: 'primary' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'lineHeight': 1.5,
        'padding': '0.625rem 1.375rem',
        'borderRadius': '4px',
        'textTransform': 'none',
        'minWidth': '12.5rem',
        'height': 'fit-content',
        'fontWeight': 700,
        'border': `2px solid ${theme.palette.primary.main}`,
        'backgroundColor': theme.palette.primary.main,
        'color': theme.palette.primary.contrastText,

        '&.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.primary.dark ?? theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          border: `2px solid transparent`,
          backgroundImage: 'none',
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          borderColor: 'transparent',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      }),
    },
    {
      props: { color: 'secondary', variant: 'outlined' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'lineHeight': 1.5,
        'padding': '0.625rem 1.375rem',
        'borderRadius': '4px',
        'textTransform': 'none',
        'minWidth': '12.5rem',
        'height': 'fit-content',
        'fontWeight': 700,
        'border': `2px solid ${theme.palette.secondary.main}`,
        'backgroundColor': theme.palette.background.paper,
        'color': theme.palette.primary.main,

        '&.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.primary.main,
          border: '2px solid transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          border: `2px solid ${theme.palette.secondary.main}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.secondary.main,
        },
      }),
    },
    {
      props: { color: 'secondary', variant: 'contained' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'lineHeight': 1.5,
        'padding': '0.625rem 1.375rem',
        'borderRadius': '4px',
        'textTransform': 'none',
        'minWidth': '12.5rem',
        'height': 'fit-content',
        'fontWeight': 700,
        'border': '2px solid transparent',
        'backgroundColor': theme.palette.secondary.main,
        'color': theme.palette.secondary.contrastText,

        '&.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.secondary.dark,
          backgroundImage: `linear-gradient(rgba(255,255,255,.15),rgba(255,255,255,.15))`,
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
        },
      }),
    },
    {
      props: { color: 'secondary', variant: 'text' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'fontWeight': 700,
        'lineHeight': 1.5,
        'textTransform': 'none',
        'border': 'none',
        'textDecoration': 'underline',
        'padding': 0,
        'margin': 0,
        'borderRadius': 0,
        'minWidth': 0,
        'backgroundColor': 'transparent',
        'color': theme.palette.secondary.dark,

        '&.MuiButton-root:hover': {
          textDecoration: 'underline',
          border: 0,
          borderRadius: 0,
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.secondary.dark,
          boxShadow: 'none',
        },
      }),
    },
    {
      props: { color: 'error' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'lineHeight': 1.5,
        'padding': '0.625rem 1.375rem',
        'borderRadius': '4px',
        'textTransform': 'none',
        'minWidth': '12.5rem',
        'height': 'fit-content',
        'fontWeight': 700,
        'border': `2px solid ${theme.palette.error.main}`,
        'backgroundColor': theme.palette.error.main,
        'color': theme.palette.common.white,

        '&.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.error.dark ?? theme.palette.error.main,
          color: theme.palette.common.white,
          border: `2px solid transparent`,
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          border: `2px solid ${theme.palette.error.main}`,
          backgroundColor: theme.palette.error.main,
          color: theme.palette.common.white,
        },
      }),
    },
  ],
};
