import { Theme, type Components } from '@mui/material';

export const MuiFormHelperText: Components<Theme>['MuiFormHelperText'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'color': theme.palette.text.primary,
      'display': 'block',
      'fontSize': '0.875rem',
      'lineHeight': 1.4,
      'outline': 'none',
      'marginLeft': '0',
      'marginTop': '0',

      '& a': {
        'color': theme.palette.secondary.main,
        'textDecorationColor': theme.palette.secondary.main,
        'fontWeight': 700,

        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          outline: `2px solid ${theme.palette.action.hover}`,
        },
      },

      '&.clarifying-text': {
        marginLeft: '3rem',
        color: theme.palette.text.primary,
        paddingTop: '0.25rem',
      },

      '& .icon-button': {
        marginLeft: '0.5rem',
      },

      '&.Mui-error': {
        color: theme.palette.error.main,
      },

      '&.Mui-disabled': {
        color: theme.palette.text.disabled,
      },
    }),
  },
};
