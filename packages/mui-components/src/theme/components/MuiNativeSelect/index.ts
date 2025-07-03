import type { Components, Theme } from '@mui/material';

export const MuiNativeSelect: Components<Theme>['MuiNativeSelect'] = {
  styleOverrides: {
    icon: ({ theme }) => ({
      transform: 'scale(1.25)',
      right: '0.5rem',
      color: theme.palette.text.primary,
    }),
    select: ({ theme }) => ({
      '&.MuiNativeSelect-select': {
        'height': '100%',
        'padding': '0 0.875rem',

        '&.MuiOutlinedInput-input': {
          paddingRight: '2.25rem',
        },

        '&:focus': {
          backgroundColor: theme.palette.background.paper,
        },

        // For Firefox
        '&.MuiInputBase-input.MuiOutlinedInput-input:not([multiple]) option': {
          backgroundColor: theme.palette.background.paper,
        },
      },
    }),
  },
};
