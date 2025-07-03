import type { Components, Theme } from '@mui/material';

export const MuiInputAdornment: Components<Theme>['MuiInputAdornment'] = {
  styleOverrides: {
    filled: ({ theme }) => ({
      'backgroundColor': theme.palette.grey[200],
      'color': theme.palette.text.primary,
      'height': 'calc(3rem - 2px)',
      'padding': '0 0.625rem',
      'maxHeight': 'none',
      'margin': 0,

      '&.MuiInputAdornment-positionStart': {
        borderTopLeftRadius: '6px',
        borderBottomLeftRadius: '6px',
        position: 'relative',
        left: '-0.875rem',
        marginTop: '0 !important',
      },

      '&.MuiInputAdornment-positionEnd': {
        borderTopRightRadius: '6px',
        borderBottomRightRadius: '6px',
        position: 'relative',
        right: '-0.875rem',
      },

      '& > .MuiTypography-root': {
        fontWeight: 700,
      },
    }),
  },
};
