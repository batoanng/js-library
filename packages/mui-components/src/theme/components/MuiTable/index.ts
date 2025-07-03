import type { Components, Theme } from '@mui/material';

export const MuiTable: Components<Theme>['MuiTable'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'minWidth': 0,
      'borderRadius': 0,

      '& .MuiTableCell-root': {
        borderBottom: `1px solid ${theme.palette.divider}`,
        verticalAlign: 'top',
      },

      '& .MuiTableRow-root.MuiTableRow-head': {
        'backgroundColor': theme.palette.grey[300],

        '& .MuiTableCell-root.MuiTableCell-head': {
          fontWeight: 700,
          fontSize: '1rem',
        },
      },

      '& .MuiTableCell-root.MuiTableCell-body': {
        fontSize: '1rem',
        fontWeight: 400,
      },

      '& .MuiTableFooter-root': {
        'backgroundColor': theme.palette.background.paper,

        '& .MuiTableCell-root.MuiTableCell-footer': {
          fontWeight: 700,
          fontSize: '1rem',
          color: theme.palette.text.primary,
        },
      },
    }),
  },
};
