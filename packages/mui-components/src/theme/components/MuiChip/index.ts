import type { Components, Theme } from '@mui/material';

export const MuiChip: Components<Theme>['MuiChip'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'height': '1.5rem',
      'padding': '0.25rem 1rem',
      'color': theme.palette.primary.contrastText,
      'whiteSpace': 'nowrap',
      'fontWeight': 700,
      'fontSize': '0.875rem',
      'lineHeight': 1,
      'textAlign': 'center',

      '& .MuiChip-label': {
        padding: 0,
      },
    }),
  },

  variants: [
    {
      props: { color: 'default' },
      style: ({ theme }) => ({
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.default,
      }),
    },
    {
      props: { color: 'error' },
      style: ({ theme }) => ({
        backgroundColor: theme.palette.error.main,
        color: theme.palette.getContrastText(theme.palette.error.main),
      }),
    },
    {
      props: { color: 'warning' },
      style: ({ theme }) => ({
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.getContrastText(theme.palette.warning.main),
      }),
    },
    {
      props: { color: 'success' },
      style: ({ theme }) => ({
        backgroundColor: theme.palette.success.main,
        color: theme.palette.getContrastText(theme.palette.success.main),
      }),
    },
    {
      props: { color: 'info' },
      style: ({ theme }) => ({
        backgroundColor: theme.palette.info.main,
        color: theme.palette.getContrastText(theme.palette.info.main),
      }),
    },
  ],
};
