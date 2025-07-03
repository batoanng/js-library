import type { Components, Theme } from '@mui/material';

export const MuiAlert: Components<Theme>['MuiAlert'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'color': theme.palette.text.primary,
      'borderLeft': '4px solid',
      'borderColor': theme.palette.primary.main,
      'backgroundColor': theme.palette.info.light,
      'padding': '1.5rem 1.5rem 1.5rem 1rem',
      'borderRadius': 0,

      '& .MuiAlert-message': {
        'padding': 0,
        'fontSize': '1rem',
        'fontWeight': 400,
        'lineHeight': 1.5,
        'flex': 'auto',

        '& p': {
          margin: 0,
        },

        '& a': {
          color: theme.palette.primary.main,
        },
      },

      '& .MuiAlert-icon': {
        padding: 0,
        marginRight: '1rem',
        color: theme.palette.primary.main,
      },
    }),
  },

  variants: [
    {
      props: { severity: 'error' },
      style: ({ theme }) => ({
        'borderColor': theme.palette.error.main,
        'backgroundColor': theme.palette.error.light,
        '& .MuiAlert-icon': {
          color: theme.palette.error.main,
        },
      }),
    },
    {
      props: { severity: 'warning' },
      style: ({ theme }) => ({
        'borderColor': theme.palette.warning.main,
        'backgroundColor': theme.palette.warning.light,
        '& .MuiAlert-icon': {
          color: theme.palette.warning.main,
        },
      }),
    },
    {
      props: { severity: 'success' },
      style: ({ theme }) => ({
        'borderColor': theme.palette.success.main,
        'backgroundColor': theme.palette.success.light,
        '& .MuiAlert-icon': {
          color: theme.palette.success.main,
        },
      }),
    },
    {
      props: { severity: 'info', icon: true },
      style: ({ theme }) => ({
        backgroundColor: theme.palette.info.light,
      }),
    },
    {
      props: { severity: 'info', icon: false },
      style: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }),
    },
  ],
};
