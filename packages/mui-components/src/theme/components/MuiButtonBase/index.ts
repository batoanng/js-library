import type { Components, Theme } from '@mui/material';

export const MuiButtonBase: Components<Theme>['MuiButtonBase'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'height': 'fit-content',

      '&.MuiButton-root': {
        'boxShadow': 'none',

        '&.Mui-disabled': {
          opacity: 0.4,
          cursor: 'not-allowed',
        },
      },

      // For icon buttons like help/info icons
      '&.MuiButton-root:hover.icon-button': {
        backgroundColor: 'transparent',
      },

      // For DatePicker (MUI X) calendar day — today but not selected
      '&.MuiPickersDay-root': {
        '&:not(.Mui-selected).MuiPickersDay-today': {
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.primary.light,
        },

        '&.Mui-selected': {
          color: `${theme.palette.text.primary}!important`,
          backgroundColor: `${theme.palette.primary.light}!important`,
        },

        '&:hover': {
          color: `${theme.palette.text.primary}!important`,
          backgroundColor: '#ebebeb3d!important',
        },
      },

      '&.MuiPaginationItem-root': {
        '&.Mui-selected': {
          color: `${theme.palette.text.primary}!important`,
          backgroundColor: `${theme.palette.primary.light}!important`,
        },

        '&:hover': {
          color: `${theme.palette.text.primary}!important`,
          backgroundColor: '#ebebeb3d!important',
        },
      },
    }),
  },
};
