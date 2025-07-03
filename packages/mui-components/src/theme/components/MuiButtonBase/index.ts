import type { Components, Theme } from '@mui/material';

export const MuiButtonBase: Components<Theme>['MuiButtonBase'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'height': 'fit-content',

      '&.MuiButton-root': {
        'boxShadow': 'none',

        '&:focus': {
          outline: `${theme.palette.primary.main} solid 3px`,
          outlineOffset: '3px',
        },

        '&.Mui-disabled': {
          opacity: 0.4,
          cursor: 'not-allowed',
        },
      },

      '&.Mui-focusVisible': {
        outline: `${theme.palette.primary.main} solid 3px`,
        outlineOffset: '3px',
      },

      // For icon buttons like help/info icons
      '&.MuiButton-root:hover.icon-button': {
        backgroundColor: 'transparent',
      },

      // For DatePicker (MUI X) calendar day — today but not selected
      '&.MuiPickersDay-root:not(.Mui-selected).MuiPickersDay-today': {
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.grey[200],
      },

      // For DatePicker arrows
      '&.MuiIconButton-root.MuiPickersArrowSwitcher-button:hover': {
        backgroundColor: theme.palette.grey[300],
      },
    }),
  },
};
