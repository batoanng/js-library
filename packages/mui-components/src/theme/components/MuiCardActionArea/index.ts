import type { Components, Theme } from '@mui/material';

export const MuiCardActionArea: Components<Theme>['MuiCardActionArea'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'boxShadow': '0 0 0 2px blue',
      'borderTop': `6px solid ${theme.palette.secondary.main}`,

      '&:before': {
        content: '""',
        position: 'absolute',
        top: -6,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        border: '2px solid transparent',
        borderRadius: '6px',
      },

      '&:hover': {
        '&:before': {
          border: `2px solid ${theme.palette.secondary.main}`,
          borderRadius: '6px',
        },

        '& [class*="MuiTypography-h"]': {
          textDecoration: 'underline',
        },
      },
    }),
  },
};
