import type { Components, Theme } from '@mui/material';

export const MuiListItem: Components<Theme>['MuiListItem'] = {
  defaultProps: {
    disableGutters: false,
    dense: false,
    divider: false,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      'transition': 'background-color 0.2s ease',
      'color': theme.palette.primary.contrastText,
      'gap': '0.375rem',

      'svg': {
        transition: 'background-color 0.2s ease',
        fill: theme.palette.primary.contrastText,
      },

      '&:hover': {
        color: theme.palette.primary.main,

        svg: {
          fill: theme.palette.primary.main,
        },
      },

      '&.Mui-selected': {
        color: theme.palette.primary.main,

        svg: {
          fill: theme.palette.primary.main,
        },
      },

      '&.Mui-disabled': {
        opacity: 0.5,
        backgroundColor: 'transparent',
        color: theme.palette.action.disabled,

        svg: {
          fill: theme.palette.action.disabled,
        },
      },
    }),
  },
};

export const MuiListItemIcon: Components<Theme>['MuiListItemIcon'] = {
  styleOverrides: {
    root: () => ({
      minWidth: 'unset', // smaller spacing than default (default is 56px)
    }),
  },
};
