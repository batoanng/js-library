import type { Components, Theme } from '@mui/material';

export const MuiFormGroup: Components<Theme>['MuiFormGroup'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'marginTop': '0.5rem',

      '&.MuiFormGroup-row .MuiFormControlLabel-root': {
        marginRight: '2rem',
      },

      '& textarea': {
        'border': '1px solid',
        'borderRadius': '4px',
        'borderColor': theme.palette.text.primary,
        'marginTop': '0.25rem',
        'fontSize': '16px',
        'fontWeight': 300,
        'lineHeight': '24px',
        'letterSpacing': '0px',
        'textAlign': 'left',
        'color': theme.palette.text.primary,
        'padding': '0.75rem 1rem',

        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },

        '&:disabled': {
          backgroundColor: theme.palette.action.disabledBackground,
        },
      },

      // Error state for checkbox
      '&.Mui-error .MuiCheckbox-root': {
        'color': theme.palette.error.main,
        'borderWidth': '2px',

        '&:hover': {
          backgroundColor: theme.palette.error.light,
        },
      },

      // Error state for radio
      '&.Mui-error .MuiRadio-root > span:first-of-type': {
        color: theme.palette.error.main,
        borderWidth: '2px',
      },
    }),
  },
};
