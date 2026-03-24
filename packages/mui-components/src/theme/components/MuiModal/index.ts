import type { Components, Theme } from '@mui/material';

export const MuiModal: Components<Theme>['MuiModal'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',

      '& .MuiModal-root .MuiBackdrop-root': {
        backgroundColor: theme.designTokens.stateLayers.backdrop,
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
        'marginRight': theme.designTokens.dimensions.modalGutter,
        'marginLeft': theme.designTokens.dimensions.modalGutter,
        'padding': theme.designTokens.dimensions.modalPadding,
        'maxHeight': '90vh',
        'maxWidth': theme.designTokens.dimensions.modalMaxWidth,
        'overflow': 'auto',

        '@media (max-width: 600px)': {
          position: 'fixed',
          width: 'auto',
          right: 0,
          left: 0,
          bottom: 0,
          marginRight: 0,
          marginLeft: 0,
          padding: theme.designTokens.dimensions.modalMobilePadding,
          overflow: 'none',
        },
      },

      '& .modal-contents': {
        marginTop: theme.designTokens.dimensions.modalSectionGap,
        marginBottom: theme.designTokens.dimensions.modalSectionGap,
      },

      '& .modal-buttons': {
        'display': 'flex',
        'justifyContent': 'flex-end',
        'marginTop': theme.spacing(4),
        'gap': theme.spacing(2),

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
