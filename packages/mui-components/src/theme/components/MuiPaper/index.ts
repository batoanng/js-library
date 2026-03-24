import type { Components, Theme } from '@mui/material';

export const MuiPaper: Components<Theme>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'backgroundColor': theme.palette.background.default,
      '&.MuiPaper-root.MuiAccordion-root.Mui-expanded': {
        margin: theme.spacing(1, 0),
      },

      '&.MuiTableContainer-root': {
        boxShadow: 'unset',
      },

      '& .MuiIconButton-root': {
        backgroundColor: 'unset',
      },

      '& .MuiTypography-caption': {
        fontWeight: 700,
      },

      '& .MuiPickersYear-yearButton': {
        'backgroundColor': theme.palette.background.default,

        '&:hover': {
          backgroundColor: theme.designTokens.stateLayers.brandSurface,
          color: theme.palette.text.primary,
        },

        '&:focus': {
          'backgroundColor': theme.designTokens.stateLayers.brandSurface,
          'color': theme.palette.text.primary,

          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
          },
        },

        '&.Mui-selected': {
          'backgroundColor': theme.palette.primary.main,

          '&:hover': {
            backgroundColor: theme.designTokens.stateLayers.brandSurface,
            color: theme.palette.text.primary,
          },
        },
      },

      '& .MuiPickersDay-root': {
        'fontWeight': 500,
        'backgroundColor': theme.palette.background.default,

        '&:hover': {
          backgroundColor: theme.designTokens.stateLayers.interactiveHover,
          color: theme.palette.text.primary,
        },

        '&:focus': {
          'backgroundColor': theme.designTokens.stateLayers.brandSurface,
          'color': theme.palette.text.primary,

          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        },

        '&.Mui-selected': {
          'backgroundColor': theme.palette.primary.main,
          'color': theme.palette.primary.contrastText,

          '&:hover': {
            backgroundColor: theme.designTokens.stateLayers.brandSurface,
            color: theme.palette.text.primary,
          },
        },
      },

      '&.MuiPickersPopper-paper': {
        '& .MuiPickersDay-root.Mui-selected:hover, & .MuiPickersYear-yearButton.Mui-selected:hover': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      },

      '& .MuiCalendarPicker-root .MuiDayPicker-header.MuiTypography-root': {
        fontWeight: 700,
      },

      '&.MuiAutocomplete-paper': {
        width: '100%',
        borderRadius: theme.designTokens.dimensions.floatingRadius,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxShadow: theme.designTokens.elevation.popover,
      },
    }),
  },
};
