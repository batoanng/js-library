import type { Components, Theme } from '@mui/material';

export const MuiCheckbox: Components<Theme>['MuiCheckbox'] = {
  defaultProps: {
    disableRipple: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      'color': theme.palette.text.primary,
      'padding': 0,
      'border': '1px solid',
      'borderRadius': '0.25rem',
      'width': '2rem',
      'minWidth': '2rem',
      'alignSelf': 'flex-start',
      'height': '2rem',
      'marginRight': '1rem',
      'backgroundColor': theme.palette.background.paper,

      '& svg': {
        display: 'none',
      },

      '&.Mui-checked': {
        'backgroundColor': 'transparent',
        'color': theme.palette.text.primary,

        '& svg': {
          height: '1.375rem',
          width: '1.375rem',
          display: 'inline-block',
          color: theme.palette.common.white,
          backgroundColor: theme.palette.primary.main,
        },

        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      },

      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },

      '&.Mui-disabled': {
        'backgroundColor': theme.palette.action.disabledBackground,
        'borderColor': theme.palette.divider,

        '& svg': {
          backgroundColor: theme.palette.divider,
        },
      },
    }),
  },
};
