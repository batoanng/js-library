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
        outline: `2px solid ${theme.palette.action.hover}`,
      },

      '&.MuiLink-root:focus': {
        outline: `3px solid ${theme.palette.primary.main}`,
        outlineOffset: '0.1875rem',
      },

      '& svg': {
        'fontSize': '0.8rem',
        'marginLeft': '0.25rem',

        '& path': {
          fill: theme.palette.secondary.dark,
        },
      },

      '&.footer-link svg path': {
        fill: theme.palette.secondary.contrastText,
      },
    }),
  },
};
