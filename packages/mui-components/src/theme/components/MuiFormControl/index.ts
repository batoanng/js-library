import type { Components, Theme } from '@mui/material';

export const MuiFormControl: Components<Theme>['MuiFormControl'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'width': '100%',
      '& .Mui-error': {
        borderColor: theme.palette.error.main,
      },
    }),
  },
};
