import type { Components, Theme } from '@mui/material';

export const MuiAutocomplete: Components<Theme>['MuiAutocomplete'] = {
  styleOverrides: {
    root: {
      '& .MuiOutlinedInput-root': {
        'padding': 0,

        '& .MuiAutocomplete-input': {
          padding: '0.675rem 1rem',
        },
      },

      '& .MuiAutocomplete-endAdornment': {
        display: 'none', // remove clear icon or dropdown icon
      },
    },

    popper: {
      boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
    },

    option: ({ theme }) => ({
      'padding': '0.75rem 1rem',
      'textDecoration': 'underline',

      '&:hover, &.Mui-focused, &[aria-selected="true"], &[aria-selected="true"].Mui-focused': {
        backgroundColor: theme.palette.action.hover,
      },
    }),

    listbox: ({ theme }) => ({
      'padding': 0,

      '& .last-item': {
        'borderTop': 'none',

        '& .abr-link': {
          color: `${theme.palette.secondary.main} !important`,
          fontWeight: theme.typography.fontWeightBold,
        },
      },
    }),
  },
};
