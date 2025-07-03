import type { Components, Theme } from '@mui/material';

export const MuiModal: Components<Theme>['MuiModal'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',

      '& .MuiModal-root .MuiBackdrop-root': {
        backgroundColor: theme.palette.action.disabledBackground,
      },

      '& .MuiButton-root > svg': {
        color: theme.palette.text.secondary,
      },

      '& .modal': {
        'backgroundColor': theme.palette.background.paper,
        'color': theme.palette.text.primary,
        'left': 'auto',
        'right': 'auto',
        'position': 'relative',
        'bottom': 'auto',
        'width': '100%',
        'marginRight': '1.875rem',
        'marginLeft': '1.875rem',
        'borderRadius': '0.25rem',
        'padding': '2rem',
        'maxHeight': '90vh',
        'maxWidth': '44rem',
        'overflow': 'auto',

        '@media (max-width: 600px)': {
          position: 'fixed',
          width: 'auto',
          right: 0,
          left: 0,
          bottom: 0,
          marginRight: 0,
          marginLeft: 0,
          padding: '1.5rem 1.25rem 2.5rem',
          overflow: 'none',
          borderRadius: 0,
        },
      },

      '& .modal-contents': {
        marginTop: '1rem',
        marginBottom: '1rem',
      },

      '& .modal-buttons': {
        'display': 'flex',
        'justifyContent': 'flex-end',
        'marginTop': '2rem',
        'gap': '1rem',

        '@media (max-width: 960px)': {
          'flexDirection': 'column',

          '& button:last-of-type': {
            order: -1,
          },
        },
      },
    }),
  },
};
