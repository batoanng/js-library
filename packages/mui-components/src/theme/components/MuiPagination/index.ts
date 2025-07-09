import type { Components, Theme } from '@mui/material/styles';

export const MuiPagination: Components<Theme>['MuiPagination'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiPagination-ul': {
        flexWrap: 'unset',
        justifyContent: 'center',
        height: '2.5rem',
      },

      '& .MuiPaginationItem-root': {
        'color': theme.palette.secondary.dark,
        'fontWeight': 700,
        'textDecoration': 'underline',
        'minWidth': '0',
        'width': '2.5rem',
        'height': '2.5rem',
        'padding': '0',
        'borderRadius': '50%',
        'display': 'flex',
        'margin': '0 0.25rem',

        '&:hover': {
          backgroundColor: 'transparent',
        },

        '&.MuiPaginationItem-previousNext:focus': {
          borderRadius: '0',
          borderColor: theme.palette.secondary.main,
        },

        '&.Mui-focusVisible': {
          backgroundColor: 'transparent',
          borderColor: theme.palette.text.primary,
        },

        '&.Mui-focusVisible.MuiPaginationItem-previousNext': {
          borderRadius: '0',
          borderColor: theme.palette.secondary.main,
        },

        '&.Mui-selected': {
          'textDecoration': 'none',

          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
          },
        },
      },

      '& .Mui-selected': {
        textDecoration: 'none',
      },

      '& .Mui-disabled': {
        visibility: 'hidden',
      },

      '& svg': {
        fontSize: '1.75rem',
      },

      '& .MuiPaginationItem-ellipsis': {
        textDecoration: 'none',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '0.5rem',
      },
    }),
  },
};
