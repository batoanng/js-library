import type { Components, Theme } from '@mui/material';

export const MuiLink: Components<Theme>['MuiLink'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'textDecorationColor': theme.palette.secondary.main,
      'color': theme.palette.secondary.dark,
      'fontWeight': 700,

      '&.MuiLink-root:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover,
      },

      '&.MuiLink-root:focus': {
        outlineOffset: '0.1875rem',
      },

      '& svg': {
        'fontSize': '0.8rem',
        'marginLeft': '0.25rem',

        '& path': {
          fill: 'currentColor',
        },
      },

      '&.footer-link': {
        color: theme.palette.secondary.contrastText,
      },
    }),
  },
};
