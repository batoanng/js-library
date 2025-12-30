import type { Components, Theme } from '@mui/material';

export const MuiCssBaseline: Components<Theme>['MuiCssBaseline'] = {
  styleOverrides: (theme: Theme) => ({
    '.form-error-text': {
      'color': theme.palette.text.primary,
      'padding': '0.5rem',
      'paddingTop': '0rem',

      '& > .MuiTypography-root': {
        color: theme.palette.text.primary,
        fontWeight: 700,
        fontSize: '0.75rem',
      },
    },
  }),
};
