import type { Components, Theme } from '@mui/material';

export const MuiBreadcrumbs: Components<Theme>['MuiBreadcrumbs'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      fontSize: '0.875rem',
      lineHeight: 1.4,
      color: theme.palette.secondary.dark,
    }),

    separator: {
      'margin': '0 0.25rem',

      '& .MuiSvgIcon-root': {
        fontSize: '1rem',
      },
    },

    li: {
      '& .MuiLink-root': {
        fontWeight: 400,
      },
    },
  },
};
