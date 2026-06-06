import { type Components, type Theme, alpha, darken, lighten } from '@mui/material/styles';

const getContainedHoverColor = (theme: Theme, backgroundColor: string) =>
  theme.palette.mode === 'dark' ? lighten(backgroundColor, 0.08) : darken(backgroundColor, 0.08);

const getSubtleHoverColor = (theme: Theme, color: string = theme.palette.text.primary) =>
  alpha(color, theme.palette.mode === 'dark' ? 0.16 : 0.08);

export const MuiButton: Components<Theme>['MuiButton'] = {
  variants: [
    {
      props: { color: 'primary', variant: 'contained' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'border': `1px solid ${theme.palette.primary.main}`,
        'backgroundColor': theme.palette.primary.main,
        'color': theme.palette.primary.contrastText,

        '&:hover': {
          backgroundColor: getContainedHoverColor(theme, theme.palette.primary.main),
          borderColor: getContainedHoverColor(theme, theme.palette.primary.main),
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          borderColor: 'transparent',
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.42 : 0.32),
          color: theme.palette.primary.contrastText,
        },
      }),
    },
    {
      props: { color: 'primary', variant: 'outlined' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'border': `1px solid ${theme.palette.primary.main}`,
        'backgroundColor': 'transparent',
        'color': theme.palette.primary.main,

        '&:hover': {
          backgroundColor: getSubtleHoverColor(theme, theme.palette.primary.main),
          borderColor: theme.palette.primary.main,
          boxShadow: 'none',
        },
      }),
    },
    {
      props: { color: 'primary', variant: 'text' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'backgroundColor': 'transparent',
        'color': theme.palette.primary.main,

        '&:hover': {
          backgroundColor: getSubtleHoverColor(theme, theme.palette.primary.main),
          color: theme.palette.primary.main,
          boxShadow: 'none',
        },
      }),
    },
    {
      props: { color: 'secondary', variant: 'outlined' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'border': `1px solid ${theme.designTokens.borders.strong}`,
        'backgroundColor': 'transparent',
        'color': theme.palette.text.primary,

        '&:hover': {
          backgroundColor: getSubtleHoverColor(theme),
          color: theme.palette.text.primary,
          borderColor: theme.designTokens.borders.focus,
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          border: `1px solid ${theme.palette.action.disabled}`,
          backgroundColor: 'transparent',
          color: theme.palette.text.disabled,
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

        '&:hover': {
          backgroundColor: getContainedHoverColor(theme, theme.palette.secondary.main),
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          backgroundColor: alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.42 : 0.56),
          color: theme.palette.text.disabled,
        },
      }),
    },
    {
      props: { variant: 'text' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'fontWeight': 700,
        'textTransform': 'none',
        'backgroundColor': 'transparent',

        '&:hover': {
          backgroundColor: getSubtleHoverColor(theme),
          boxShadow: 'none',
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

        '&:hover': {
          textDecoration: 'underline',
          border: 0,
          backgroundColor: getSubtleHoverColor(theme),
          color: theme.palette.text.primary,
          boxShadow: 'none',
        },
      }),
    },
    {
      props: { color: 'error', variant: 'contained' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'border': `1px solid ${theme.palette.error.main}`,
        'backgroundColor': theme.palette.error.main,
        'color': theme.palette.getContrastText(theme.palette.error.main),

        '&:hover': {
          backgroundColor: getContainedHoverColor(theme, theme.palette.error.main),
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
    {
      props: { color: 'error', variant: 'outlined' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'border': `1px solid ${theme.palette.error.main}`,
        'backgroundColor': 'transparent',
        'color': theme.palette.error.main,

        '&:hover': {
          backgroundColor: getSubtleHoverColor(theme, theme.palette.error.main),
          borderColor: theme.palette.error.main,
          color: theme.palette.error.main,
          boxShadow: 'none',
        },
      }),
    },
    {
      props: { color: 'error', variant: 'text' },
      style: ({ theme }) => ({
        'fontSize': '1rem',
        'textTransform': 'none',
        'fontWeight': 700,
        'backgroundColor': 'transparent',
        'color': theme.palette.error.main,

        '&:hover': {
          backgroundColor: getSubtleHoverColor(theme, theme.palette.error.main),
          color: theme.palette.error.main,
          boxShadow: 'none',
        },
      }),
    },
  ],
};
