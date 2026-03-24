import type { Components, Theme } from '@mui/material';

export const MuiButton: Components<Theme>['MuiButton'] = {
  variants: [
    {
      props: { color: 'primary' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'border': `1px solid ${theme.palette.divider}`,
        'backgroundColor': theme.designTokens.stateLayers.interactiveSurface,
        'color': theme.palette.primary.main,

        '&.MuiButtonBase-root:hover': {
          backgroundColor: theme.designTokens.stateLayers.interactiveHover,
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
        'textTransform': 'none',
        'fontWeight': 700,
        'border': `1px solid ${theme.palette.secondary.main}`,
        'backgroundColor': theme.palette.background.paper,
        'color': theme.palette.primary.main,

        '&.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.primary.main,
          border: '1px solid transparent',
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
        'textTransform': 'none',
        'fontWeight': 700,
        'border': '1px solid transparent',
        'backgroundColor': theme.palette.secondary.main,
        'color': theme.palette.secondary.contrastText,

        '&.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.secondary.dark,
          backgroundImage: `linear-gradient(${theme.designTokens.stateLayers.interactiveStrong},${theme.designTokens.stateLayers.interactiveStrong})`,
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
        'textTransform': 'none',
        'border': 'none',
        'textDecoration': 'underline',
        'backgroundColor': 'transparent',
        'color': theme.palette.text.secondary,

        '&.MuiButton-root:hover': {
          textDecoration: 'underline',
          border: 0,
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.text.primary,
          boxShadow: 'none',
        },
      }),
    },
    {
      props: { color: 'error' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'border': `1px solid ${theme.palette.error.main}`,
        'backgroundColor': theme.palette.error.main,
        'color': theme.palette.getContrastText(theme.palette.error.main),

        '&.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.error.dark ?? theme.palette.error.main,
          color: theme.palette.getContrastText(theme.palette.error.main),
          border: `1px solid transparent`,
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          border: `1px solid ${theme.palette.error.main}`,
          backgroundColor: theme.palette.error.main,
          color: theme.palette.getContrastText(theme.palette.error.main),
        },
      }),
    },
  ],
};
