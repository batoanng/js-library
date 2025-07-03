import type { Components, Theme } from '@mui/material';

export const MuiCssBaseline: Components<Theme>['MuiCssBaseline'] = {
  styleOverrides: (theme: Theme) => ({
    '.form-error-text': {
      'color': theme.palette.text.primary,
      'backgroundColor': theme.palette.error.light,
      'padding': '0.5rem',

      '& > .MuiTypography-root': {
        color: theme.palette.text.primary,
        fontWeight: 700,
        fontSize: '1rem',
      },
    },
  }),
};
