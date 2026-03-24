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
      'color': theme.palette.text.primary,
      'gap': theme.spacing(0.75),

      'svg': {
        transition: 'background-color 0.2s ease',
        fill: 'currentColor',
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
